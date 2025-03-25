import { Address, createPublicClient, http } from "viem";
import { GetWithdrawAmountParams } from "../ToolAPI";
import { sonic } from "viem/chains";
import BeefyVaultAbi from './beefyVault.abi.json';
import BeefyIchiLPList from './beefyIchiLPList.json';
import { getIchiSwapAmountAfterWithdraw } from "../ichi/ichiHelper";
import { getERC20Balance } from "../utils/erc20Utils";

interface BeefyIchiLPConfig {
  name: string;
  vault: Address;
  lpToken: Address;
  token: Address;
}


const beefyVaultAbi = JSON.parse(JSON.stringify(BeefyVaultAbi));
const beefyIchiLPList = JSON.parse(JSON.stringify(BeefyIchiLPList));

export async function getBeefyIchiSwapAmountAfterWithdraw({
    vaultAddress,
    shares,
    userAddr  
}: GetWithdrawAmountParams) {
    const beefyLPConfig = beefyIchiLPList.find(
        (lst: BeefyIchiLPConfig) => lst.vault === vaultAddress
      ) as BeefyIchiLPConfig;
      if (!beefyLPConfig) {
        throw new Error('Ichi LP either not found or not supported');
      }

    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });
    
    const beefyBalance = await publicClient.readContract({
        address: vaultAddress,
        abi: beefyVaultAbi,
        functionName: 'balance',
        args: []
    }) as bigint;

    const totalSupply = await publicClient.readContract({
        address: vaultAddress,
        abi: beefyVaultAbi,
        functionName: 'totalSupply',
        args: []
    }) as bigint;

    const strategy = await publicClient.readContract({
        address: vaultAddress,
        abi: beefyVaultAbi,
        functionName: 'strategy',
        args: []
    }) as Address;

    const ichiShares = (beefyBalance * shares) / totalSupply;

    return await getIchiSwapAmountAfterWithdraw({
        vaultAddress: beefyLPConfig.lpToken,
        shares: ichiShares,
        userAddr: strategy
    });
}