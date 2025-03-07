const SILO_LENS = '0xE05966aee69CeCD677a30f469812Ced650cE3b5E';
import { formatUnits, http } from 'viem';
import { createPublicClient } from 'viem';
import SiloLensAbi from './abi/SiloLens.abi.json';
import VaultList from './vaultList.json';
import { sonic } from 'viem/chains';
const vaultList = JSON.parse(JSON.stringify(VaultList));
const siloLensAbi = JSON.parse(JSON.stringify(SiloLensAbi));
export async function getSiloAPR(vaultAddress) {
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
    const depositAPR = (await publicClient.readContract({
        address: SILO_LENS,
        abi: siloLensAbi,
        functionName: 'getDepositAPR',
        args: [vaultAddress],
    }));
    console.log('Deposit APR: ', formatUnits(depositAPR, 16));
    return Number(formatUnits(depositAPR, 16));
}
