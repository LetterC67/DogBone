import AaveList from './AaveList.json';
import AaveAbi from './aave.abi.json';
import { sonic } from 'viem/chains';
import { formatUnits, createPublicClient, http } from 'viem';
const aaveVaultList = JSON.parse(JSON.stringify(AaveList));
const aaveAbi = JSON.parse(JSON.stringify(AaveAbi));
const AAVE_DATA_PROVIDER = '0x306c124fFba5f2Bc0BcAf40D249cf19D492440b9';
export async function getAaveAPY(vaultAddress) {
    const vaultConfig = aaveVaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Aave vault either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });
    const contractCall = await publicClient.readContract({
        address: AAVE_DATA_PROVIDER,
        abi: aaveAbi,
        functionName: 'getReserveData',
        args: [vaultConfig.token]
    });
    console.log('Deposit APY: ', Number(formatUnits(contractCall[5], 25)));
    return Number(formatUnits(contractCall[5], 25));
}
