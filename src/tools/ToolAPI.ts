import {
  Address,
  createPublicClient,
  custom,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  parseAbiParameters,
  parseEventLogs,
  parseUnits,
  PublicClient,
} from 'viem';
import {
  strategyFunctions,
  nameToTypeMapping,
  nameToConfigMapping,
  notLeveraged,
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
import { DOGBONE_VAULT, NATIVE_TOKEN, SONIC_POINTS_APR, ZAP_CONTRACT, ZAP_OUT_CONTRACT } from './constants';
import { bridge } from './bridge/bridge';
import { getPendleRoute } from './pendle/depositPendle';
import { KyberData, V1GetData, V1GetQuote } from './swap/kyber/Kyber';
import ZapOutAbi from './zapOut.abi.json';
import { getWithdrawPendleSwapData } from './pendle/withdrawPendle';
const zapAbi = JSON.parse(JSON.stringify(ZapAbi));
const zapOutAbi = JSON.parse(JSON.stringify(ZapOutAbi));

export async function depositVault(
  walletClient: ConnectedWallet,
  strategyName: string,
  amount: string,
  leverage: number
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
    leverage
  });
}

export async function withdrawVault(
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

  return strategyFunction.withdraw({
    walletClient,
    vaultAddress: vault,
    amount,
  });
}

export interface GetWithdrawAmountParams {
  shares?: bigint;
  vaultAddress: Address;
  percent?: bigint;
  userAddr?: Address;
  lpTokens?: Address[];
}

export async function zapOut(
  walletClient: ConnectedWallet,
  strategyName: string,
  percent: bigint,
  tokenOut: Address,
  slippage: number
) {
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
  

  const strategy = nameToTypeMapping[strategyName];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault, lpTokens, token } = nameToConfigMapping[strategyName];

  const funcSelector = await strategyFunction.withdrawFuncSelector(vault);
  console.log('FuncSelector:', funcSelector);

  /////// BUILD LP HERE ///////
  const lpBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: lpTokens[0],
  });

  console.log("LP Balance: ", lpBalance);

  const lpWithdraw = BigInt((lpBalance * percent) / 10000n);
  
  const ERC20InputStruct = parseAbiParameters([
    'ERC20Input erc20Input',
    'struct ERC20Input { address[]; uint256[]; }'
  ])
  console.log(ERC20InputStruct);
  const erc20InputData = encodeAbiParameters(ERC20InputStruct, [
    [
      [lpTokens[0]],
      [lpWithdraw]
    ]
  ]);

  console.log('lpWithdraw:', lpWithdraw);
  console.log('ERC20 Input Data:', erc20InputData);
  //////////////////////////////


  let withdrawData = '';
  if (funcSelector !== '') {
    const amountToWithdraw = await strategyFunction.withdrawAmount({
      shares: lpWithdraw,
      vaultAddress: vault,
      percent: percent,
      userAddr: userAddr,
      lpTokens: lpTokens
    }) as bigint;

    console.log("Amount to WITHDRAW: ", amountToWithdraw);
    //////// BUILD WITHDRAW HERE ////////
    const StrategyWithdrawStruct = parseAbiParameters([
      'AaveWithdrawData withdrawData',
      'struct AaveWithdrawData { address; address; uint256; }'
    ]);
    const WithdrawStruct = parseAbiParameters([
      'WithdrawData withdrawData',
      'struct WithdrawData { bytes4; bytes; }'
    ]);

    console.log('vault', vault);
    console.log('token', token);
    console.log('amountToWithdraw', amountToWithdraw);
    const strategyWithdrawData = encodeAbiParameters(StrategyWithdrawStruct, [[
      vault,
      token,
      amountToWithdraw
    ]]);

    withdrawData = encodeAbiParameters(WithdrawStruct, [[
      funcSelector as Address, 
      strategyWithdrawData
    ]]);

    console.log("withdrawData: ", withdrawData);
  }

  const amountsToSwap = await strategyFunction.swapWithdrawAmount({
    shares: lpWithdraw,
    vaultAddress: vault,
    percent: percent,
    userAddr: userAddr,
    lpTokens: lpTokens
  });

  console.log('Amounts to Swap:', amountsToSwap);

  // // BUILD SWAP DATA HERE
  const SwapDataStruct = parseAbiParameters([
    'SwapData swapData',
    'struct SwapData { address; address; uint256; uint8; bytes; }'
  ]);

  const FEE_ZAP = 5; // 0.05
  const quotes = [];
  const swapDatas = [];
  const scaleFlag = strategyFunction.scaleFlag;
  let totalAmountOut: bigint = BigInt(0);
  for (let i = 0; i < amountsToSwap.length; i++) {
    if (amountsToSwap[i].tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
      totalAmountOut += amountsToSwap[i].amountIn as any as bigint;
      continue;
    }
    console.log("amount to swap: ", amountsToSwap[i]);

    if (strategy === "pendle") {
      const quote = await getWithdrawPendleSwapData({
        vaultAddress: vault,
        amount: amountsToSwap[i].amountIn as any as bigint,
        tokenOut: tokenOut,
        receiver: ZAP_OUT_CONTRACT,
        slippage: slippage / 10000
      })
      const swapData = encodeAbiParameters(SwapDataStruct, [[
        quote.tx.to, amountsToSwap[i].tokenIn, amountsToSwap[i].amountIn as any as bigint, scaleFlag, quote.tx.data
      ]]);
      swapDatas.push(swapData);
      quotes.push(quote);

      console.log('Quote:', quote);
      continue;
    }
    const getData: V1GetData = {
      tokenIn: amountsToSwap[i].tokenIn,
      amountIn: amountsToSwap[i].amountIn as any as bigint,
      tokenOut: tokenOut,
      feeAmount: FEE_ZAP,
      chargeFeeBy: "currency_out",
      feeReceiver: DOGBONE_VAULT
    };

    const kyberData: KyberData = {
      getData: getData,
      slippage: slippage,
      sender: ZAP_OUT_CONTRACT,
      recipient: ZAP_OUT_CONTRACT
    };
    
    const quote = await V1GetQuote(kyberData);
    const swapData = encodeAbiParameters(SwapDataStruct, [[
      quote.data.routerAddress, amountsToSwap[i].tokenIn, amountsToSwap[i].amountIn as any as bigint, scaleFlag, quote.data.data
    ]]);
    quotes.push(quote);
    swapDatas.push(swapData);
    console.log('Quote:', quote);
  }

  // BUILD VALIDATION
  for (let i = 0; i < quotes.length; i++) {
    totalAmountOut += BigInt(quotes[i].data.amountOut);
  }

  const BPS = BigInt(10000);
  const minimumAmountOut = BigInt((BPS - BigInt(slippage)) * totalAmountOut / BPS);

  
  const ZapOutValidationStruct = parseAbiParameters([
    'ZapOutValidation zapOutValidation',
    'struct ZapOutValidation { address; uint256; }'
  ]);
  const zapOutValidationData = encodeAbiParameters(ZapOutValidationStruct, [[tokenOut, minimumAmountOut]]);

  console.log('Total Amount:', totalAmountOut);
  console.log('Minimum Amount:', minimumAmountOut);


  const ZapOutStruct = parseAbiParameters([
    'ZapOutData zapOutData',
    'struct ZapOutData { address; bytes; bytes; bytes[]; bytes; }'
  ])

  const zapOutData = encodeAbiParameters(ZapOutStruct, [[userAddr, erc20InputData, withdrawData as Address, swapDatas, zapOutValidationData]]);

  console.log('Zap Out Data:', zapOutData);

  if (await checkNeedApproval({
    publicClient,
    account: userAddr,
    tokenAddress: lpTokens[0],
    spender: ZAP_OUT_CONTRACT,
    amount: lpWithdraw
  })) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: lpTokens[0],
        spender: ZAP_OUT_CONTRACT,
        amount: lpWithdraw
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve transaction: ' + error);
    }
  }

  const transactionData = encodeFunctionData({
    abi: zapOutAbi,
    functionName: 'zapOut',
    args: [zapOutData]
  });

  const transactionRequest = {
    to: ZAP_OUT_CONTRACT,
    data: transactionData,
    value: 0n
  };

  try {
    const transactionHash = await provider.request({
      method: 'eth_sendTransaction',
      params: [transactionRequest]
    });

    await publicClient.waitForTransactionReceipt({ hash: transactionHash });

    const receipt = await publicClient.getTransactionReceipt({
      hash: transactionHash,
    });

    const DexAbi = {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "srcToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "dstToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "dstReceiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "spentAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "returnAmount",
          "type": "uint256"
        }
      ],
      "name": "Swapped",
      "type": "event"
    };
    

    const decodedLogs = parseEventLogs({
      abi: [DexAbi],
      logs: receipt.logs,
    });


    let returnedAmount = 0n;
    decodedLogs.forEach((log) => {
        returnedAmount += BigInt(log.args.returnAmount);
    });

    const decimal = await getERC20Decimals({ publicClient, tokenAddress: tokenOut });
    const parsedReturnedAmount = formatUnits(returnedAmount, decimal);

    console.log('Returned Amount:', parsedReturnedAmount);
    
    return {
      "transactionHash": transactionHash,
      "returnedAmount": parsedReturnedAmount
    };
  } catch (error) {
    throw new Error('Failed to zap out: ' + error);
  }
}

export async function getQuoteZapOut(
  walletClient: ConnectedWallet,
  strategyName: string,
  percent: bigint,
  tokenOut: Address,
  slippage: number
) {
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
  

  const strategy = nameToTypeMapping[strategyName];
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const strategyFunction =
    strategyFunctions[strategy as keyof typeof strategyFunctions];
  const { vault, lpTokens, token } = nameToConfigMapping[strategyName];

  const lpBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: lpTokens[0],
  });

  const lpWithdraw = BigInt((lpBalance * percent) / 10000n);


  const amountsToSwap = await strategyFunction.swapWithdrawAmount({
    shares: lpWithdraw,
    vaultAddress: vault,
    percent: percent,
    userAddr: userAddr,
    lpTokens: lpTokens
  });

  const FEE_ZAP = 5; // 0.05
  const quotes = [];
  const scaleFlag = strategyFunction.scaleFlag;
  let totalAmountOut: bigint = BigInt(0);
  for (let i = 0; i < amountsToSwap.length; i++) {
    if (amountsToSwap[i].tokenIn.toLowerCase() === tokenOut.toLowerCase()) {
      totalAmountOut += amountsToSwap[i].amountIn as any as bigint;
      continue;
    }

    if (strategy === "pendle") {
      const quote = await getWithdrawPendleSwapData({
        vaultAddress: vault,
        amount: amountsToSwap[i].amountIn as any as bigint,
        tokenOut: tokenOut,
        receiver: ZAP_OUT_CONTRACT,
        slippage: slippage / 10000
      })
      quotes.push(quote);
      continue;
    }
    const getData: V1GetData = {
      tokenIn: amountsToSwap[i].tokenIn,
      amountIn: amountsToSwap[i].amountIn as any as bigint,
      tokenOut: tokenOut,
      feeAmount: FEE_ZAP,
      chargeFeeBy: "currency_out",
      feeReceiver: DOGBONE_VAULT
    };

    const kyberData: KyberData = {
      getData: getData,
      slippage: slippage,
      sender: ZAP_OUT_CONTRACT,
      recipient: ZAP_OUT_CONTRACT
    };
    
    const quote = await V1GetQuote(kyberData);
    quotes.push(quote);
  }

  for (let i = 0; i < quotes.length; i++) {
    totalAmountOut += BigInt(quotes[i].data.amountOut);
  }

  const decimal = await getERC20Decimals({ publicClient, tokenAddress: tokenOut });
  console.log("TOTAL AMOUNT OUT: ", formatUnits(totalAmountOut, decimal));
  return formatUnits(totalAmountOut, decimal);
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

export function getVaultPointsAPR(strategyName: string) {
  const { points } = nameToConfigMapping[strategyName];
  return points * SONIC_POINTS_APR;
}

export async function getVaultTotalAPR(strategyName: string) {
  return (await getVaultAPR(strategyName)) + getVaultPointsAPR(strategyName);
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

  let transaction;

  if (strategy === 'pendle') {
    transaction = await getPendleRoute(
      vault,
      fromToken,
      parsedAmountIn,
      userAddr
    )
    transaction = {...transaction, value: fromToken === NATIVE_TOKEN ? parsedAmountIn : 0n}
  } else {
    ({ transaction } = await odosExecute({
      receiver: ZAP_CONTRACT,
      chainId: sonic.id,
      tokenIn: fromToken,
      tokenOut: token,
      amountIn: parsedAmountIn,
    }));
  }

  console.log('Trấnction: ', transaction);

  console.log('Transaction ODOS:', transaction);

  const leverage = strategyFunction.leverage(toStrategy, amount);
  console.log('Leverage:', leverage);
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
      ...leverage,
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
    value: fromToken === NATIVE_TOKEN ? parsedAmountIn : BigInt(0),
  };

  console.log('Transaction Request:', transactionRequest);

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
        ...notLeveraged("", "")
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
