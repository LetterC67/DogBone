import { getERC20Balance, getERC20Decimals, approveERC20, checkNeedApproval, } from '../utils/erc20Utils';
import { createPublicClient, custom, parseUnits, formatUnits } from 'viem';
import { odosExecute } from './odos';
export async function swap({ walletClient, chainId, tokenIn, tokenOut, amountIn, }) {
    if (walletClient.chainId.slice(7, walletClient.chainId.length) !==
        chainId.toString()) {
        await walletClient.switchChain(chainId);
    }
    const userAddr = walletClient.address;
    const provider = await walletClient.getEthereumProvider();
    const publicClient = createPublicClient({
        transport: custom(provider),
    });
    const parsedAmountIn = parseUnits(amountIn, await getERC20Decimals({ publicClient, tokenAddress: tokenIn }));
    const userBalance = await getERC20Balance({
        publicClient,
        account: userAddr,
        tokenAddress: tokenIn,
    });
    if (userBalance < parsedAmountIn) {
        throw new Error('Insufficient balance');
    }
    const { transaction } = await odosExecute({
        receiver: walletClient.address,
        chainId,
        tokenIn,
        tokenOut,
        amountIn: parsedAmountIn,
    });
    if (await checkNeedApproval({
        publicClient,
        account: userAddr,
        tokenAddress: tokenIn,
        spender: transaction.to,
        amount: parsedAmountIn,
    })) {
        try {
            const approveTx = await approveERC20({
                provider,
                tokenAddress: tokenIn,
                spender: transaction.to,
                amount: parsedAmountIn,
            });
            await publicClient.waitForTransactionReceipt({ hash: approveTx });
        }
        catch (error) {
            throw new Error('Failed to approve transaction: ' + error);
        }
    }
    const beforeTokenOutBalance = await getERC20Balance({
        publicClient,
        account: userAddr,
        tokenAddress: tokenOut,
    });
    const transactionRequest = {
        to: transaction.to,
        value: transaction.value,
        data: transaction.data,
    };
    try {
        const transactionHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [transactionRequest],
        });
        await publicClient.waitForTransactionReceipt({ hash: transactionHash });
        const afterTokenOutBalance = await getERC20Balance({
            publicClient,
            account: userAddr,
            tokenAddress: tokenOut,
        });
        const tokenOutDecimal = await getERC20Decimals({
            publicClient,
            tokenAddress: tokenOut,
        });
        const amountOut = afterTokenOutBalance - beforeTokenOutBalance;
        console.log({
            "txHash": transactionHash,
            "amountOut": formatUnits(amountOut, tokenOutDecimal),
        });
        return {
            "txHash": transactionHash,
            "amountOut": formatUnits(amountOut, tokenOutDecimal),
        };
    }
    catch (error) {
        throw new Error(`Failed to send transaction: ${error}`);
    }
}
