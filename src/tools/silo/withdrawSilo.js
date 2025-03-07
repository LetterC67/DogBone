import { createPublicClient, custom, encodeFunctionData, parseUnits, } from 'viem';
import { sonic } from 'viem/chains';
import SiloAbi from './abi/Silo.abi.json';
import VaultList from './vaultList.json';
import { getERC20Decimals } from '../utils/erc20Utils';
const siloAbi = JSON.parse(JSON.stringify(SiloAbi));
const vaultList = JSON.parse(JSON.stringify(VaultList));
export async function withdrawSilo({ walletClient, vaultAddress, amount, }) {
    // Check if vault address is in vault list
    const vaultConfig = vaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
    }
    if (!vaultConfig.borrowable) {
        throw new Error('Vault does not support use asset as collateral');
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
    const underlyingToken = await getUnderlyingToken(publicClient, vaultAddress);
    const parsedAmount = parseUnits(amount, await getERC20Decimals({ publicClient, tokenAddress: underlyingToken }));
    const transactionData = encodeFunctionData({
        abi: siloAbi,
        functionName: 'withdraw',
        args: [parsedAmount, userAddr, userAddr],
    });
    const transactionRequest = {
        to: vaultAddress,
        data: transactionData,
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
async function getUnderlyingToken(publicClient, vaultAddress) {
    try {
        const underlyingToken = (await publicClient.readContract({
            address: vaultAddress,
            abi: siloAbi,
            functionName: 'asset',
            args: [],
        }));
        return underlyingToken;
    }
    catch (error) {
        throw new Error('Invalid vault address: ' + error);
    }
}
