import { createPublicClient, formatUnits, http } from 'viem';
import SiloAbi from './abi/Silo.abi.json';
import VaultList from './vaultList.json';
import { sonic } from 'viem/chains';
import { getERC20Balance, getERC20Decimals } from '../utils/erc20Utils';
const siloAbi = JSON.parse(JSON.stringify(SiloAbi));
const vaultList = JSON.parse(JSON.stringify(VaultList));
export async function viewSiloPosition({ vaultAddress, userAddress, }) {
    const vaultConfig = vaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
    }
    if (!vaultConfig.borrowable) {
        throw new Error('Vault does not support use asset as collateral');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http(),
    });
    const userShareBalance = (await getERC20Balance({
        publicClient,
        account: userAddress,
        tokenAddress: vaultAddress,
    }));
    const userUnderlyingBalance = (await publicClient.readContract({
        address: vaultAddress,
        abi: siloAbi,
        functionName: 'previewRedeem',
        args: [userShareBalance],
    }));
    const tokenDecimal = await getERC20Decimals({
        publicClient,
        tokenAddress: vaultConfig.token,
    });
    console.log('USER SILO BALANCE: ', formatUnits(userUnderlyingBalance, tokenDecimal));
    return formatUnits(userUnderlyingBalance, tokenDecimal);
}
