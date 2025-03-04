import { ConnectedWallet } from '@privy-io/react-auth';
import { ZAP_CONTRACT } from '../constants';

import {
  getERC20Balance,
  approveERC20,
  checkNeedApproval,
  getERC20Decimals,
} from '../utils/erc20Utils';

import {
  createPublicClient,
  custom,
  Address,
  encodeFunctionData,
  parseUnits,
} from 'viem';
import { sonic } from 'viem/chains';
import BeefyIchiLPList from './beefyIchiLPList.json';
import ZapAbi from '../zap.abi.json';
import { getBeefyIchiFuncSelector } from './getBeefyIchiFuncSelector';
import { notLeveraged } from '../listStrategies';

const beefyIchiLPList = JSON.parse(JSON.stringify(BeefyIchiLPList));
const zapAbi = JSON.parse(JSON.stringify(ZapAbi));

interface BeefyIchiLPConfig {
  name: string;
  vault: Address;
  lpToken: Address;
  token: Address;
}

interface DepositLPIchiBeefy {
  walletClient: ConnectedWallet;
  vaultAddress: Address;
  amount: string;
  isCollateral?: boolean;
}

export async function depositIchiLPBeefy({
  walletClient,
  vaultAddress,
  amount,
}: DepositLPIchiBeefy): Promise<void> {
  if (
    walletClient.chainId.slice(7, walletClient.chainId.length) !==
    sonic.id.toString()
  ) {
    await walletClient.switchChain(sonic.id);
  }

  const beefyLPConfig = beefyIchiLPList.find(
    (lst: BeefyIchiLPConfig) => lst.vault === vaultAddress
  );
  if (!beefyLPConfig) {
    throw new Error('Ichi LP either not found or not supported');
  }

  const userAddr = walletClient.address as Address;
  const provider = await walletClient.getEthereumProvider();
  const publicClient = createPublicClient({
    transport: custom(provider),
  });

  const parsedAmountIn = parseUnits(
    amount,
    await getERC20Decimals({ publicClient, tokenAddress: beefyLPConfig.token })
  );

  const userBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: beefyLPConfig.token,
  });

  if (userBalance < parsedAmountIn) {
    throw new Error('Insufficient balance');
  }

  const needApproval = await checkNeedApproval({
    publicClient,
    account: userAddr,
    tokenAddress: beefyLPConfig.token,
    spender: ZAP_CONTRACT,
    amount: parsedAmountIn,
  });

  if (needApproval) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: beefyLPConfig.token,
        spender: ZAP_CONTRACT,
        amount: parsedAmountIn,
      });

      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve token: ' + error);
    }
  }

  const args = [
    {
      vault: vaultAddress,
      token: beefyLPConfig.token,
      amount: parsedAmountIn,
      receiver: userAddr,
      funcSelector: await getBeefyIchiFuncSelector(vaultAddress),
      ...notLeveraged('', ''),
    },
  ];

  const transactionData = encodeFunctionData({
    abi: zapAbi,
    functionName: 'doStrategy',
    args: args,
  });

  const transactionRequest = {
    to: ZAP_CONTRACT,
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
    throw new Error('Failed to deposit token into Beefy: ' + error);
  }
}
