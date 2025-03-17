import { Address, createPublicClient, formatUnits, http } from 'viem';
import SiloAbi from './abi/Silo.abi.json';
import VaultList from './vaultList.json';
import { sonic } from 'viem/chains';
import { getERC20Balance, getERC20Decimals } from '../utils/erc20Utils';
import SiloConfigAbi from "./abi/SiloConfig.abi.json"
interface VaultConfig {
  marketId: number;
  vault: Address;
  token: Address;
  borrowable: boolean;
}

interface ViewSiloPositionArgs {
  vaultAddress: Address;
  userAddress: Address;
}

const siloConfigAbi = JSON.parse(JSON.stringify(SiloConfigAbi));
const siloAbi = JSON.parse(JSON.stringify(SiloAbi));
const vaultList: VaultConfig[] = JSON.parse(JSON.stringify(VaultList));

export async function viewSiloPosition({
  vaultAddress,
  userAddress,
}: ViewSiloPositionArgs) {
  const vaultConfig = vaultList.find(
    (vault: VaultConfig) => vault.vault === vaultAddress
  );

  if (!vaultConfig) {
    throw new Error('Vault either not found or not supported');
  }

  const borrowable = vaultConfig.borrowable;

  if (borrowable) return viewBorrowable(vaultAddress, userAddress, vaultConfig);
  else return viewNonBorrowable(vaultAddress, userAddress, vaultConfig);
}

export async function viewBorrowable(vaultAddress: Address, userAddress: Address, vaultConfig: VaultConfig) {
  const publicClient = createPublicClient({
    chain: sonic,
    transport: http(),
  });

  const userShareBalance = (await getERC20Balance({
    publicClient,
    account: userAddress,
    tokenAddress: vaultAddress,
  })) as bigint;


  const userUnderlyingBalance = (await publicClient.readContract({
    address: vaultAddress,
    abi: siloAbi,
    functionName: 'previewRedeem',
    args: [userShareBalance],
  })) as bigint;

  const tokenDecimal = await getERC20Decimals({
    publicClient,
    tokenAddress: vaultConfig.token,
  });

  console.log(
    'USER SILO BALANCE: ',
    formatUnits(userUnderlyingBalance, tokenDecimal)
  );
  return formatUnits(userUnderlyingBalance, tokenDecimal);
}

export async function viewNonBorrowable(vaultAddress: Address, userAddress: Address, vaultConfig: VaultConfig) {
  console.log("WEKWEJKLASDJKLASDJAKSLDJAS ", vaultAddress);
  const publicClient = createPublicClient({
    chain: sonic,
    transport: http(),
  });

  console.log("HALLDSLAD");

  const siloConfig = await publicClient.readContract({
    address: vaultAddress,
    abi: siloAbi,
    functionName: "siloConfig",
    args: []
  }) as Address;

  console.log("Silo config: ", siloConfig);

  const shareTokens = await publicClient.readContract({
    address: siloConfig,
    abi: siloConfigAbi,
    functionName: 'getShareTokens',
    args: [vaultAddress],
  }) as [Address, Address, Address];


  const userShareBalance = (await getERC20Balance({
    publicClient,
    account: userAddress,
    tokenAddress: shareTokens[0]
  })) as bigint;
  
  const userUnderlyingBalance = (await publicClient.readContract({
    address: vaultAddress,
    abi: siloAbi,
    functionName: 'previewRedeem',
    args: [userShareBalance, BigInt(0)],
  })) as bigint;

  const tokenDecimal = await getERC20Decimals({
    publicClient,
    tokenAddress: vaultConfig.token
  });
  

  return formatUnits(userUnderlyingBalance, tokenDecimal);
}