import {
  Address,
  createPublicClient,
  custom,
  encodeFunctionData,
  parseUnits,
  PublicClient,
} from 'viem';
import { ConnectedWallet } from '@privy-io/react-auth';
import { sonic } from 'viem/chains';
import SiloAbi from './abi/Silo.abi.json';
import {
  getERC20Balance,
  getERC20Decimals,
  checkNeedApproval,
  approveERC20,
} from '../utils/erc20Utils';

const siloAbi = JSON.parse(JSON.stringify(SiloAbi));

interface DepositArgs {
  walletClient: ConnectedWallet;
  vaultAddress: Address;
  amount: string;
  isCollateral: boolean;
}

export async function depositSilo({
  walletClient,
  vaultAddress,
  amount,
  isCollateral,
}: DepositArgs): Promise<void> {
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

  const underlyingToken = await getUnderlyingToken(publicClient, vaultAddress);

  const parsedAmount = parseUnits(
    amount,
    await getERC20Decimals({ publicClient, tokenAddress: underlyingToken })
  );

  const userBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: underlyingToken,
  });

  if (userBalance < parsedAmount) {
    throw new Error('Insufficient balance');
  }

  if (
    await checkNeedApproval({
      publicClient,
      account: userAddr,
      tokenAddress: underlyingToken,
      spender: vaultAddress,
      amount: parsedAmount,
    })
  ) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: underlyingToken,
        spender: vaultAddress,
        amount: parsedAmount,
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve token: ' + error);
    }
  }

  const transactionData = encodeFunctionData({
    abi: siloAbi,
    functionName: 'deposit',
    args: [parsedAmount, userAddr, isCollateral ? 1 : 0],
  });

  const transactionRequest = {
    to: vaultAddress,
    data: transactionData,
    value: '0',
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

async function getUnderlyingToken(
  publicClient: PublicClient,
  vaultAddress: Address
): Promise<Address> {
  try {
    const underlyingToken = (await publicClient.readContract({
      address: vaultAddress,
      abi: siloAbi,
      functionName: 'asset',
      args: [],
    })) as Address;
    return underlyingToken;
  } catch (error) {
    throw new Error('Invalid vault address: ' + error);
  }
}
