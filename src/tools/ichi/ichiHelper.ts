import { createPublicClient, http } from "viem";
import { GetWithdrawAmountParams } from "../ToolAPI";
import { sonic } from "viem/chains";
import IchiVaultAbi from './ichiVault.abi.json';

const ichiVaultAbi = JSON.parse(JSON.stringify(IchiVaultAbi));

export async function getIchiSwapAmountAfterWithdraw({
    vaultAddress,
    shares,
    userAddr
}: GetWithdrawAmountParams) {

    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });

    const { result } = await publicClient.simulateContract({
        address: vaultAddress,
        abi: ichiVaultAbi,
        functionName: 'withdraw',
        args: [shares, userAddr],
        account: userAddr,
    });

    const amounts = [result[0], result[1]] as [bigint, bigint];
    console.log("Ichi Position: ", amounts);
    return amounts;
}