import {
  Address,
  createPublicClient,
  custom,
  encodeAbiParameters,
  encodeFunctionData,
  parseUnits,
} from 'viem';
import {
  strategyFunctions,
  nameToTypeMapping,
  nameToConfigMapping,
} from './listStrategies';
import { ConnectedWallet } from '@privy-io/react-auth';
import { odosExecute } from './swap/odos';
import { sonic } from 'viem/chains';
import {
  approveERC20,
  checkNeedApproval,
  getERC20Balance,
  getERC20Decimals,
} from './utils/erc20Utils';
import ZapAbi from './zap.abi.json';
import { NATIVE_TOKEN, ZAP_CONTRACT } from './constants';
import { bridge } from './bridge/bridge';

const zapAbi = JSON.parse(JSON.stringify(ZapAbi));

export async function depositVault(
  walletClient: ConnectedWallet,
  strategyName: string,
  amount: string
) {
  const strategy = nameToTypeMapping[strategyName];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault } = nameToConfigMapping[strategyName];

  return strategyFunction.deposit({
    walletClient,
    vaultAddress: vault,
    amount,
  });
}

export async function getVaultAPR(strategyName: string): Promise<number> {
  const strategy = nameToTypeMapping[strategyName];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault } = nameToConfigMapping[strategyName];

  return strategyFunction.viewAPR(vault);
}

export async function getVaultPosition(
  walletClient: ConnectedWallet,
  strategyName: string
) {
  const strategy = nameToTypeMapping[strategyName];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault } = nameToConfigMapping[strategyName];

  return strategyFunction.viewPosition({
    vaultAddress: vault,
    userAddress: walletClient.address as Address,
  });
}

export async function zap(
  walletClient: ConnectedWallet,
  fromToken: Address,
  amount: string,
  toStrategy: string
) {
  const strategy = nameToTypeMapping[toStrategy];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  if (
    walletClient.chainId.slice(7, walletClient.chainId.length) !==
    sonic.id.toString()
  ) {
    await walletClient.switchChain(sonic.id);
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault, token } = nameToConfigMapping[toStrategy];

  if (fromToken === token) {
    throw new Error('Cannot zap to the same token, use depositVault instead');
  }

  const userAddr = walletClient.address as Address;
  const provider = await walletClient.getEthereumProvider();
  const publicClient = createPublicClient({
    chain: sonic,
    transport: custom(provider),
  });

  const parsedAmountIn = parseUnits(
    amount,
    await getERC20Decimals({ publicClient, tokenAddress: fromToken })
  );

  const userBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: fromToken,
  });

  if (userBalance < parsedAmountIn) {
    throw new Error('Insufficient balance');
  }

  if (
    await checkNeedApproval({
      publicClient,
      account: userAddr,
      tokenAddress: fromToken,
      spender: ZAP_CONTRACT,
      amount: parsedAmountIn,
    })
  ) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: fromToken,
        spender: ZAP_CONTRACT,
        amount: parsedAmountIn,
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve transaction: ' + error);
    }
  }

  const { transaction } = await odosExecute({
    receiver: ZAP_CONTRACT,
    chainId: sonic.id,
    tokenIn: fromToken,
    tokenOut: token,
    amountIn: parsedAmountIn,
  });

  console.log('Transaction ODOS:', transaction);

  const args = [
    {
      fromToken: fromToken,
      fromAmount: parsedAmountIn,
      router: transaction.to as Address,
      data: transaction.data,
      value: BigInt(transaction.value),
    },
    {
      vault: vault,
      token: token,
      amount: BigInt(0),
      receiver: userAddr,
      funcSelector: await strategyFunction.funcSelector(vault),
    },
  ];

  console.log('Args:', args);

  const transactionData = encodeFunctionData({
    abi: zapAbi,
    functionName: 'zap',
    args: args,
  });

  const transactionRequest = {
    to: ZAP_CONTRACT,
    data: transactionData,
    value: fromToken === NATIVE_TOKEN ? parsedAmountIn : '0',
  };

  try {
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest],
    });

    return transactionHash;
  } catch (error) {
    throw new Error('Failed to zap: ' + error);
  }
}

export async function bridgeAndZap(
  walletClient: ConnectedWallet,
  fromChain: number,
  fromToken: Address,
  amount: string,
  toStrategy: string
) {
  const strategy = nameToTypeMapping[toStrategy];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault, token } = nameToConfigMapping[toStrategy];

  const userAddr = walletClient.address as Address;
  const depositSelector = await strategyFunction.funcSelector(vault);
  const externalCallData = getExternalCall(
    vault,
    token,
    userAddr,
    depositSelector
  );

  return await bridge({
    walletClient,
    srcChainId: fromChain,
    dstChainId: sonic.id,
    srcChainTokenIn: fromToken,
    srcAmountIn: amount,
    dstChainTokenOut: token,
    externalCall: externalCallData
  });
}

export function getExternalCall(
  vault: Address,
  token: Address,
  userAddr: Address,
  depositSelector: Address
): {target: Address, targetPayload: Address } {
  const callData = encodeFunctionData({
    abi: zapAbi,
    functionName: 'doStrategy',
    args: [
      {
        vault: vault,
        token: token,
        amount: 0n,
        receiver: userAddr,
        funcSelector: depositSelector,
      },
    ],
  });

  const payloadEncoded = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          { name: 'to', type: 'address' },
          { name: 'txGas', type: 'uint256' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
    [
      {
        to: ZAP_CONTRACT,
        txGas: 0n,
        callData: callData,
      },
    ]
  );

  return {
    target: ZAP_CONTRACT,
    targetPayload: payloadEncoded,
  }
}
