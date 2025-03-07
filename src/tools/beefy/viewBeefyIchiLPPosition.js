import { createPublicClient, http } from 'viem';
import { sonic } from 'viem/chains';
import BeefyIchiLPList from './beefyIchiLPList.json';
import BeefyVaultAbi from './beefyVault.abi.json';
import { viewBeefyIchiPosition } from '../ichi/viewIchiPosition';
const beefyIchiLPList = JSON.parse(JSON.stringify(BeefyIchiLPList));
const beefyVaultAbi = JSON.parse(JSON.stringify(BeefyVaultAbi));
export async function viewBeefyIchiLPPosition({ vaultAddress, userAddress, }) {
    const beefyLPConfig = beefyIchiLPList.find((lst) => lst.vault === vaultAddress);
    if (!beefyLPConfig) {
        throw new Error('Ichi LP either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http(),
    });
    const userShareBalance = (await publicClient.readContract({
        address: vaultAddress,
        abi: beefyVaultAbi,
        functionName: 'balanceOf',
        args: [userAddress],
    }));
    const pricePerShare = (await publicClient.readContract({
        address: vaultAddress,
        abi: beefyVaultAbi,
        functionName: 'getPricePerFullShare',
        args: [],
    }));
    const underlyingBalance = (userShareBalance * pricePerShare) / BigInt(1e18);
    const tokenUnderlyingBalance = await viewBeefyIchiPosition(beefyLPConfig.lpToken, underlyingBalance);
    return tokenUnderlyingBalance;
}
