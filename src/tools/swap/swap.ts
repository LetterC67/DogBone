import { ConnectedWallet } from '@privy-io/react-auth';
import {
  getERC20Balance,
  getERC20Allowance,
  getERC20Decimals,
  approveERC20,
} from '../utils/erc20Utils';
import { createPublicClient, custom, parseUnits, Address } from 'viem';
import { odosExecute } from './odos';
import { NATIVE_TOKEN } from '../constants.ts';

export interface SwapArgs {
  walletClient: ConnectedWallet;
  chainId: string;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: string;
}

export async function swap({
  walletClient,
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
}: SwapArgs): Promise<void> {
  if (walletClient.chainId.slice(7, walletClient.chainId.length) !== chainId) {
    await walletClient.switchChain(Number(chainId));
  }

  const userAddr = walletClient.address as Address;
  const provider = await walletClient.getEthereumProvider();
  const publicClient = createPublicClient({
    transport: custom(provider),
  });

  const parsedAmountIn = parseUnits(
    amountIn,
    await getERC20Decimals({ publicClient, tokenAddress: tokenIn })
  );
  const { transaction } = await odosExecute({
    walletClient,
    chainId,
    tokenIn,
    tokenOut,
    amountIn: parsedAmountIn,
  });

  const userBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: tokenIn,
  });

  if (userBalance < parsedAmountIn) {
    throw new Error('Insufficient balance');
  }

  if (tokenIn !== NATIVE_TOKEN) {
    const allowance = await getERC20Allowance({
      publicClient,
      account: userAddr,
      tokenAddress: tokenIn,
      spender: transaction.to,
    });

    if (allowance < parsedAmountIn) {
      // Approve
      try {
        const approveTx = await approveERC20({
          provider,
          tokenAddress: tokenIn,
          spender: transaction.to,
          amount: parsedAmountIn,
        });
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
      } catch (error) {
        throw new Error('Failed to approve transaction: ' + error);
      }
    }
  }

  const transactionRequest = {
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,
  };

  try {
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });

    return transactionHash;
  } catch (error) {
    throw new Error(`Failed to send transaction: ${error}`);
  }
}
