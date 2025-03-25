import { Address, createPublicClient, http } from "viem";
import { GetWithdrawAmountParams } from "../ToolAPI";
import { sonic } from "viem/chains";
import IchiVaultAbi from './ichiVault.abi.json';
import IchiVaultList from './ichiVaultList.json';
const ichiVaultAbi = JSON.parse(JSON.stringify(IchiVaultAbi));
const ichiVaultList = JSON.parse(JSON.stringify(IchiVaultList));
interface IchiVaultConfig {
  vault: Address;
  token: Address;
  gauge: Address;
  tokenPosition: number;
}

export async function getIchiSwapAmountAfterWithdraw({
    vaultAddress,
    shares,
    userAddr
}: GetWithdrawAmountParams) {
    const ichiVaultConfig = ichiVaultList.find(
        (vault: IchiVaultConfig) => vault.vault === vaultAddress
      );
    
    if (!ichiVaultConfig) {
    throw new Error('Ichi vault either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });

    const { result } = await publicClient.simulateContract({
        address: vaultAddress,
        abi: ichiVaultAbi,
        functionName: 'withdraw',
        args: [shares, ichiVaultConfig.gauge],
        account: ichiVaultConfig.gauge,
    });

    const amounts = [result[0], result[1]] as [bigint, bigint];
    console.log("Ichi Position: ", amounts);
    return amounts;
}