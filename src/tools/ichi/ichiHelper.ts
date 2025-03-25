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

    const token0 = await publicClient.readContract({
        address: vaultAddress,
        abi: ichiVaultAbi,
        functionName: 'token0',
        args: [],
    }) as Address;

    const token1 = await publicClient.readContract({
        address: vaultAddress,
        abi: ichiVaultAbi,
        functionName: 'token1',
        args: [],
    }) as Address;

    const amounts = [
        {
            amountIn: result[0],
            tokenIn: token0
        },
        {
            amountIn: result[1],
            tokenIn: token1
        }
    ]
    console.log("Ichi Position: ", amounts);
    return amounts;
}