import { ConnectedWallet } from '@privy-io/react-auth';
import {
  Address,
  createPublicClient,
  custom,
  encodeFunctionData,
  parseUnits,
} from 'viem';
import { sonic } from 'viem/chains';
import MachFiERC20Abi from './machFiERC20.abi.json';
import MachFiVaultList from './machFiVaultList.json';
import { getERC20Decimals } from '../utils/erc20Utils';

const machFiERC20Abi = JSON.parse(JSON.stringify(MachFiERC20Abi));
const machFiVaultList = JSON.parse(JSON.stringify(MachFiVaultList));

interface VaultConfig {
  name: string;
  vault: Address;
  token: Address;
}

interface WithdrawMachFiArgs {
  walletClient: ConnectedWallet;
  vaultAddress: Address;
  amount: string;
  isCollateral?: boolean;
}

export async function withdrawMachFi({
  walletClient,
  vaultAddress,
  amount,
}: WithdrawMachFiArgs) {
  const vaultConfig = machFiVaultList.find(
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

  const provider = await walletClient.getEthereumProvider();
  const publicClient = createPublicClient({
    transport: custom(provider),
  });

  const token = vaultConfig.token;
  const parsedAmount = parseUnits(
    amount,
    await getERC20Decimals({ publicClient, tokenAddress: token })
  );

  const transactionData = encodeFunctionData({
    abi: machFiERC20Abi,
    functionName: 'redeemUnderlying',
    args: [parsedAmount],
  });

  const transactionRequest = {
    to: vaultAddress,
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
    throw new Error('Failed to deposit token into Silo: ' + error);
  }
}
