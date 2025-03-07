import AaveList from './VicunaList.json';
import AaveAbi from './aave.abi.json';
import { sonic } from 'viem/chains';
import { formatUnits, createPublicClient, http } from 'viem';
const aaveVaultList = JSON.parse(JSON.stringify(AaveList));
const aaveAbi = JSON.parse(JSON.stringify(AaveAbi));
const AAVE_DATA_PROVIDER = '0xc67850eCd0EC9dB4c0fD65C1Ad43a53025e6d54D';
export async function getVicunaAPY(vaultAddress) {
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
    const getMerkleAPYList = await fetch("https://api.merkl.xyz/v4/opportunities?name=Vicuna&items=1000");
    const merkleAPYList = await getMerkleAPYList.json();
    const merkleAPY = merkleAPYList.find((item) => item.identifier === vaultConfig.identifier);
    console.log('Deposit APY: ', Number(formatUnits(contractCall[5], 25)) + merkleAPY.apr);
    return Number(formatUnits(contractCall[5], 25)) + merkleAPY.apr;
}
