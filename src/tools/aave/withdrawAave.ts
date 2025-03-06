import { ConnectedWallet } from '@privy-io/react-auth';
import { Address, createPublicClient, custom, encodeFunctionData } from 'viem';
import AaveList from './AaveList.json';
import AaveAbi from './aave.abi.json';
import { sonic } from 'viem/chains';
import { getERC20Decimals } from '../utils/erc20Utils';
import { parseUnits } from 'ethers';

const aaveVaultList = JSON.parse(JSON.stringify(AaveList));
const aaveAbi = JSON.parse(JSON.stringify(AaveAbi));
const AAVE: Address = '0x5362dBb1e601abF3a4c14c22ffEdA64042E5eAA3';

interface AaveVaultConfig {
  name: string;
  vault: Address;
  token: Address;
}

interface WithdrawArgs {
  walletClient: ConnectedWallet;
  vaultAddress: Address;
  amount: string;
}

export async function withdrawAave({
  walletClient,
  vaultAddress,
  amount,
}: WithdrawArgs) {
  const vaultConfig = aaveVaultList.find(
    (vault: AaveVaultConfig) => vault.vault === vaultAddress
  );
  if (!vaultConfig) {
    throw new Error('Aave vault either not found or not supported');
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
    chain: sonic,
    transport: custom(provider),
  });

  const parsedAmount = parseUnits(
    amount,
    await getERC20Decimals({ publicClient, tokenAddress: vaultConfig.token })
  );

  const transactionData = encodeFunctionData({
    abi: aaveAbi,
    functionName: 'withdraw',
    args: [vaultConfig.token, parsedAmount, userAddr],
  });

  const transactionRequest = {
    to: AAVE,
    data: transactionData,
    value: BigInt(0),
  };

  try {
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });

    return transactionHash;
  } catch (error) {
    throw new Error('Failed to deposit Aave: ' + error);
  }
}
