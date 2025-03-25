import { GetWithdrawAmountParams } from '../ToolAPI';
import LTokenList from './LTokenList.json';
import LTokenAbi from './LToken.abi.json';
import { Address, createPublicClient, http } from 'viem';
import { sonic } from 'viem/chains';
import { getERC20Balance } from '../utils/erc20Utils';

interface LTokenConfig {
  name: string;
  vault: Address;
  token: Address;
}

const lTokenList = JSON.parse(JSON.stringify(LTokenList));
const lTokenAbi = JSON.parse(JSON.stringify(LTokenAbi));
const FIXED_POINT_Q96 = BigInt('79228162514264337593543950336');
const DEN = BigInt(10000);

export async function getYelSwapAmountAfterWithdraw({
  vaultAddress,
  shares,
  userAddr,
}: GetWithdrawAmountParams) {
  const lConfig = lTokenList.find(
    (l: LTokenConfig) => l.vault === vaultAddress
  );
  if (!lConfig) {
    throw new Error('LToken either not found or not supported');
  }

  const publicClient = createPublicClient({
    chain: sonic,
    transport: http(),
  });

  const lTokenContract = {
    address: vaultAddress,
    abi: lTokenAbi,
  } as const;

  const results = await publicClient.multicall({
    contracts: [
      {
        ...lTokenContract,
        functionName: 'totalSupply',
        args: [],
      },
      {
        ...lTokenContract,
        functionName: 'DEBOND_FEE',
        args: [],
      },
    ],
  });

  const vaultSupply = results[0].result as bigint;
  const debondFee = results[1].result as bigint;
  const vaultBalance = (await getERC20Balance({
    publicClient,
    account: vaultAddress,
    tokenAddress: lConfig.token,
  })) as bigint;

  const amountAfter =
    shares >= (vaultSupply * BigInt(98)) / BigInt(100)
      ? shares
      : (shares * (DEN - debondFee)) / DEN;
  const perc = (amountAfter * FIXED_POINT_Q96) / vaultSupply;
  const amount = (vaultBalance * perc) / FIXED_POINT_Q96;
  console.log('Yel Position: ', amount);
  return [amount];
}
