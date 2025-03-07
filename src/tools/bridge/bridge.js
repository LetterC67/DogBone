import { getERC20Balance, getERC20Decimals, approveERC20, checkNeedApproval, } from '../utils/erc20Utils.ts';
import { createPublicClient, custom, parseUnits, formatUnits, http } from 'viem';
import { debridgeQuote } from './debridge.ts';
import supportedChains from './supportedChains.json';
import { sonic } from 'viem/chains';
const chainIdMapping = JSON.parse(JSON.stringify(supportedChains));
export async function bridge({ walletClient, srcChainId, dstChainId, srcChainTokenIn, srcAmountIn, dstChainTokenOut, externalCall, }) {
    if (walletClient.chainId.slice(7, walletClient.chainId.length) !==
        srcChainId.toString()) {
        await walletClient.switchChain(Number(srcChainId));
    }
    const userAddr = walletClient.address;
    const provider = await walletClient.getEthereumProvider();
    const publicClient = createPublicClient({
        transport: custom(provider),
    });
    const parsedAmountIn = parseUnits(srcAmountIn, await getERC20Decimals({ publicClient, tokenAddress: srcChainTokenIn }));
    const userBalance = await getERC20Balance({
        publicClient,
        account: userAddr,
        tokenAddress: srcChainTokenIn,
    });
    if (userBalance < parsedAmountIn) {
        throw new Error('Insufficient balance to bridge');
    }
    const { transaction, amountOut } = await debridgeQuote({
        walletClient,
        srcChainId: Number(chainIdMapping[srcChainId]),
        dstChainId: Number(chainIdMapping[dstChainId]),
        srcChainTokenIn,
        srcAmountIn: parsedAmountIn,
        dstChainTokenOut,
        externalCall,
    });
    if (await checkNeedApproval({
        publicClient,
        account: userAddr,
        tokenAddress: srcChainTokenIn,
        spender: transaction.to,
        amount: parsedAmountIn,
    })) {
        try {
            const approveTx = await approveERC20({
                provider,
                tokenAddress: srcChainTokenIn,
                spender: transaction.to,
                amount: parsedAmountIn,
            });
            await publicClient.waitForTransactionReceipt({ hash: approveTx });
        }
        catch (error) {
            throw new Error('Failed to approve transaction: ' + error);
        }
    }
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
        const sonicPublicClient = createPublicClient({
            chain: sonic,
            transport: http()
        });
        const tokenOutDecimal = await getERC20Decimals({
            publicClient: sonicPublicClient,
            tokenAddress: dstChainTokenOut,
        });
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
