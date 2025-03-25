import { Address, createPublicClient, http } from "viem";
import { sonic } from "viem/chains";
import SiloAbi from './abi/Silo.abi.json';
import { GetWithdrawAmountParams } from "../ToolAPI";
import VaultList from './vaultList.json';

interface VaultConfig {
    marketId: number;
    vault: Address;
    token: Address;
    borrowable: boolean;
  }

const siloAbi = JSON.parse(JSON.stringify(SiloAbi));
const vaultList: VaultConfig[] = JSON.parse(JSON.stringify(VaultList));

export async function getSiloSwapAmountAfterWithdraw({
    vaultAddress,
    shares
}: GetWithdrawAmountParams) {
    const vaultConfig = vaultList.find(
        (vault: VaultConfig) => vault.vault === vaultAddress
      );
    
      if (!vaultConfig) {
        throw new Error('Vault either not found or not supported');
      }
    
    const amount = await getSiloWithdrawAmount({
        shares,
        vaultAddress
    });
    const amounts = [
        {
            amountIn: amount,
            tokenIn: vaultConfig.token
        }
    ];
    return amounts;
}   

export async function getSiloWithdrawAmount({
    shares,
    vaultAddress
}: GetWithdrawAmountParams) {
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