import { createPublicClient, custom, parseUnits } from 'viem';
import VaultList from './pendleVaultList.json';
import { sonic } from 'viem/chains';
import { approveERC20, checkNeedApproval, getERC20Balance, getERC20Decimals, } from '../utils/erc20Utils';
const vaultList = JSON.parse(JSON.stringify(VaultList));
export async function depositPendle({ walletClient, vaultAddress, amount, }) {
    // Check if vault address is in vault list
    const vaultConfig = vaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
    }
    if (walletClient.chainId.slice(7, walletClient.chainId.length) !==
        sonic.id.toString()) {
        await walletClient.switchChain(sonic.id);
    }
    const userAddr = walletClient.address;
    const provider = await walletClient.getEthereumProvider();
    const publicClient = createPublicClient({
        transport: custom(provider),
    });
    const underlyingToken = vaultConfig.token;
    const parsedAmount = parseUnits(amount, await getERC20Decimals({ publicClient, tokenAddress: underlyingToken }));
    const userBalance = await getERC20Balance({
        publicClient,
        account: userAddr,
        tokenAddress: underlyingToken,
    });
    if (userBalance < parsedAmount) {
        throw new Error('Insufficient balance');
    }
    const PENDLE_API_URL = 'https://api-v2.pendle.finance/core';
    const response = await fetch(`${PENDLE_API_URL}/v1/sdk/${sonic.id}/markets/${vaultConfig.name}/swap?receiver=${userAddr}&slippage=0.01&enableAggregator=false&tokenIn=${underlyingToken}&tokenOut=${vaultConfig.pt}&amountIn=${parsedAmount}`);
    if (!response.ok) {
        throw new Error('Failed to swap');
    }
    const data = await response.json();
    const { tx } = data;
    if (await checkNeedApproval({
        publicClient,
        account: userAddr,
        tokenAddress: underlyingToken,
        spender: tx.to,
        amount: parsedAmount,
    })) {
        await approveERC20({
            provider,
            tokenAddress: underlyingToken,
            spender: tx.to,
            amount: parsedAmount,
        });
    }
    const transactionRequest = {
        to: tx.to,
        data: tx.data,
        value: BigInt(0),
    };
    try {
        const transactionHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [transactionRequest],
        });
        return transactionHash;
    }
    catch (error) {
        throw new Error('Failed to deposit token into Silo: ' + error);
    }
}
export async function getPendleRoute(vaultAddress, fromToken, parsedAmount, receiver) {
    console.log("parsedAmountdsd: ", parsedAmount);
    const vaultConfig = vaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
    }
    const PENDLE_API_URL = 'https://api-v2.pendle.finance/core';
    const response = await fetch(`${PENDLE_API_URL}/v1/sdk/${sonic.id}/markets/${vaultConfig.name}/swap?receiver=${receiver}&slippage=0.01&enableAggregator=true&tokenIn=${fromToken}&tokenOut=${vaultConfig.pt}&amountIn=${parsedAmount}`);
    if (!response.ok) {
        throw new Error('Failed to finding route swap to Pendle PT' + await response.text());
    }
    const data = await response.json();
    const { tx } = data;
    return tx;
}
