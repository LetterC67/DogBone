import { ConnectedWallet } from '@privy-io/react-auth';
import { Address, createPublicClient, custom, parseUnits } from 'viem';
import VaultList from './pendleVaultList.json';
import { sonic } from 'viem/chains';
import {
  approveERC20,
  checkNeedApproval,
  getERC20Decimals,
} from '../utils/erc20Utils';

const vaultList = JSON.parse(JSON.stringify(VaultList));

interface VaultConfig {
  name: string;
  vault: Address;
  expiry: string;
  pt: Address;
  yt: Address;
  sy: Address;
  token: Address;
}

interface WithdrawArgs {
  walletClient: ConnectedWallet;
  vaultAddress: Address;
  amount: string;
}

export async function withdrawPendle({
  walletClient,
  vaultAddress,
  amount,
}: WithdrawArgs) {
  // Check if vault address is in vault list
  const vaultConfig = vaultList.find(
    (vault: VaultConfig) => vault.vault === vaultAddress
  );
  if (!vaultConfig) {
    throw new Error('Vault either not found or not supported');
  }

  if (
    walletClient.chainId.slice(7, walletClient.chainId.length) !==
    sonic.id.toString()
  ) {
    await walletClient.switchChain(sonic.id);
  }

  const userAddr = walletClient.address as Address;
  const provider = await walletClient.getEthereumProvider();
  const publicClient = createPublicClient({
    transport: custom(provider),
  });

  const underlyingToken = vaultConfig.token;

  const PENDLE_API_URL = 'https://api-v2.pendle.finance/core';

  // get swap rate
  const swapRateRepsonse = await fetch(
    `${PENDLE_API_URL}/v1/sdk/146/markets/${vaultAddress}/swapping-prices`
  );

  if (!swapRateRepsonse.ok) {
    throw new Error('Failed to fetch Pendle data');
  }
  let data = await swapRateRepsonse.json();
  const { ptToUnderlyingTokenRate } = data;

  const ptToWithdraw = Number(amount) / ptToUnderlyingTokenRate;
  const ptDecimal = await getERC20Decimals({
    publicClient,
    tokenAddress: vaultConfig.pt,
  });
  const parsedPtToWithdraw = parseUnits(ptToWithdraw.toString(), ptDecimal);

  const swapResponse = await fetch(
    `${PENDLE_API_URL}/v1/sdk/${sonic.id}/markets/${vaultConfig.name}/swap?receiver=${userAddr}&slippage=0.01&enableAggregator=false&tokenIn=${vaultConfig.pt}&tokenOut=${underlyingToken}&amountIn=${parsedPtToWithdraw}`
  );
  if (!swapResponse.ok) {
    throw new Error('Failed to swap');
  }

  data = await swapResponse.json();
  const { tx } = data;

  if (
    await checkNeedApproval({
      publicClient,
      account: userAddr,
      tokenAddress: vaultConfig.pt,
      spender: tx.to,
      amount: parsedPtToWithdraw,
    })
  ) {
    await approveERC20({
      provider,
      tokenAddress: vaultConfig.pt,
      spender: tx.to,
      amount: parsedPtToWithdraw,
    });
  }

  const transactionRequest = {
    to: tx.to,
    data: tx.data,
    value: BigInt(0),
  };

  try {
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });

    return transactionHash;
  } catch (error) {
    throw new Error('Failed to deposit token into Silo: ' + error);
  }
}

export async function getWithdrawPendleSwapData({
  vaultAddress,
  amount,
  tokenOut,
  receiver,
  slippage,
}: {
  vaultAddress: Address,
  amount: bigint,
  tokenOut: Address;
  
  receiver: Address;
  slippage: number
}) {
  // Check if vault address is in vault list
  const vaultConfig = vaultList.find(
    (vault: VaultConfig) => vault.vault === vaultAddress
  );
  if (!vaultConfig) {
    throw new Error('Vault either not found or not supported');
  }

  const PT = vaultConfig.pt;

  const PENDLE_API_URL = 'https://api-v2.pendle.finance/core';

  const swapResponse = await fetch(
    `${PENDLE_API_URL}/v1/sdk/${sonic.id}/markets/${vaultConfig.name}/swap?receiver=${receiver}&slippage=${slippage}&enableAggregator=true&tokenIn=${PT}&tokenOut=${tokenOut}&amountIn=${amount}`
  );
  if (!swapResponse.ok) {
    throw new Error('Failed to swap');
  }

  const data = await swapResponse.json();
  return data;
}
