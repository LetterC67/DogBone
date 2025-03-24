import { Address, createPublicClient, http } from "viem";
import { sonic } from "viem/chains";
import SiloAbi from './abi/Silo.abi.json';

const siloAbi = JSON.parse(JSON.stringify(SiloAbi));

export async function getSiloWithdrawAmount({
    shares,
    vaultAddress
}: {shares: bigint, vaultAddress: Address}) {
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });

    const amount = await publicClient.readContract({
        address: vaultAddress,
        abi: siloAbi,
        functionName: 'previewRedeem',
        args: [shares]
    });


    console.log('Silo Position: ', amount);
    return amount;
}