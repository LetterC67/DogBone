import IchiVaultList from './ichiVaultList.json';
import IchiVaultAbi from './ichiVault.abi.json';
import IchiGaugeAbi from './ichiGauge.abi.json';
import { sonic } from 'viem/chains';
import { Address, createPublicClient, formatUnits, http } from 'viem';
import { getERC20Balance, getERC20Decimals } from '../utils/erc20Utils';

const ichiVaultList = JSON.parse(JSON.stringify(IchiVaultList));
const ichiVaultAbi = JSON.parse(JSON.stringify(IchiVaultAbi));
const ichiGaugeAbi = JSON.parse(JSON.stringify(IchiGaugeAbi));

interface IchiVaultConfig {
  vault: Address;
  token: Address;
  gauge: Address;
  tokenPosition: number;
}

interface ViewIChiPositionArgs {
  vaultAddress: Address;
  userAddress: Address;
}

export async function viewIchiPosition({
  vaultAddress,
  userAddress,
}: ViewIChiPositionArgs) {
  const ichiVaultConfig = ichiVaultList.find(
    (vault: IchiVaultConfig) => vault.vault === vaultAddress
  );

  if (!ichiVaultConfig) {
    throw new Error('Ichi vault either not found or not supported');
  }

  const publicClient = createPublicClient({
    chain: sonic,
    transport: http(),
  });

  let userShareBalance = (await getERC20Balance({
    publicClient,
    account: userAddress,
    tokenAddress: vaultAddress,
  })) as bigint;

  userShareBalance += (await getERC20Balance({
    publicClient,
    account: userAddress,
    tokenAddress: ichiVaultConfig.gauge,
  })) as bigint;

  const token0 = (await publicClient.readContract({
    address: vaultAddress,
    abi: ichiVaultAbi,
    functionName: 'token0',
    args: [],
  })) as Address;

  const token1 = (await publicClient.readContract({
    address: vaultAddress,
    abi: ichiVaultAbi,
    functionName: 'token1',
    args: [],
  })) as Address;

  const token0Decimals = await getERC20Decimals({
    publicClient,
    tokenAddress: token0,
  });

  const token1Decimals = await getERC20Decimals({
    publicClient,
    tokenAddress: token1,
  });

  const reward = (await publicClient.readContract({
    address: ichiVaultConfig.gauge,
    abi: ichiGaugeAbi,
    functionName: 'rewards',
    args: [userAddress],
  })) as bigint;

  try {
    const { result } = await publicClient.simulateContract({
      address: vaultAddress,
      abi: ichiVaultAbi,
      functionName: 'withdraw',
      args: [userShareBalance, userAddress],
      account: userAddress,
    });

    const [total0, total1] = result;
    console.log('Total 0: ', formatUnits(total0, token0Decimals));
    console.log('Total 1: ', formatUnits(total1, token0Decimals));
    console.log('Ichi reward: ', formatUnits(reward, token0Decimals));
    return {
      total0: formatUnits(total0, token0Decimals),
      total1: formatUnits(total1, token1Decimals),
      swpxReward: formatUnits(reward, 18),
    };
  } catch (error) {
    return {
      total0: 0,
      total1: 0,
      swpxReward: reward,
    };
  }
}
