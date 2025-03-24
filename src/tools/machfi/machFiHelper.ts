import { Address, createPublicClient, http } from "viem";
import { sonic } from "viem/chains";
import MachFiNativeAbi from './machFiNative.abi.json';
import { ZAP_CONTRACT } from "../constants";
import { GetWithdrawAmountParams } from "../ToolAPI";

const machFiNativeAbi = JSON.parse(JSON.stringify(MachFiNativeAbi));

export async function getMachFiWithdrawAmount({
    shares,
    vaultAddress
}: GetWithdrawAmountParams) {
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });

    const exchangeRateCurrent = await publicClient.simulateContract({
        address: vaultAddress,
        abi: machFiNativeAbi,
        functionName: 'exchangeRateCurrent',
        args: [],
        account: ZAP_CONTRACT
    });

    console.log('exchangeRateCurrent: ', exchangeRateCurrent.result);

    const rate = BigInt(exchangeRateCurrent.result as any);
    const amount = shares * rate / BigInt(1e18);

    console.log('MachFi Position: ', amount);

    return amount;
}