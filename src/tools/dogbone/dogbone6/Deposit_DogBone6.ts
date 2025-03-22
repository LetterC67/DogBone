import { ConnectedWallet } from '@privy-io/react-auth';
import {
  Address,
  createPublicClient,
  custom,
  encodeFunctionData,
  formatUnits,
  parseEther,
  parseUnits,
} from 'viem';
import { sonic } from 'viem/chains';
import { ZAP_CONTRACT } from '../../constants';
import {
  approveERC20,
  checkNeedApproval,
  getERC20Balance,
  getERC20Decimals,
} from '../../utils/erc20Utils';
import ZapAbi from '../../zap.abi.json';
import { getTokenPriceByAddresses } from '../../coingecko/getTokenPriceByAddresses';
import { odosExecute } from '../../swap/odos';
import { getTokenPriceByAddress } from '../../utils/getTokenPrice';
import { getPendleRoute, getPricePendle } from '../../pendle/depositPendle';

const zapAbi = JSON.parse(JSON.stringify(ZapAbi));

// Market id 41
console.log('Zap abi is: ', zapAbi);

const LEVERAGE: number = 10;
const PT_VAULT: Address = '0x4e82347bc41cfd5d62cef483c7f0a739a8158963';
const SILO_VAULT: Address = '0x7dB82f430f333Ac5D93963e0a93FAfEF7061F998';
// const SILO_CONFIG: Address = "0x78C246f67c8A6cE03a1d894d4Cf68004Bd55Deea";
const TOKEN: Address = '0x46eb02b9F47634c4fab3110CC7ADc1C6311DfAC1';
const BORROW_TOKEN: Address = '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38';
const SHARE_DEBT_TOKEN: Address = '0xC9d073568f905f3ca957Cc5560F022D4d6802799';

interface DepositDogBone {
  walletClient: ConnectedWallet;
  vault?: Address;
  amount: string;
  leverage: number;
}

export async function depositDogBone_Bone6({
  walletClient,
  amount,
  leverage
}: DepositDogBone) {
  console.log(walletClient);
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

  const tDecimal = await getERC20Decimals({ publicClient, tokenAddress: TOKEN });

  const parsedAmountIn = parseUnits(
    amount,
    tDecimal
  );


  const BORROW_TOKEN_PRICE = Number(await getTokenPriceByAddress(BORROW_TOKEN, sonic.id));
  const TOKEN_PRICE = formatUnits(await getPricePendle(PT_VAULT, parseUnits('1', tDecimal)), 6);

  console.log('TOKEN_PRICE', TOKEN_PRICE);
    console.log('BORROW_TOKEN_PRICE', BORROW_TOKEN_PRICE);

  const flashAmount =
    (Number(amount) * (leverage - 1) * TOKEN_PRICE) / BORROW_TOKEN_PRICE;

  const parsedFlashAmount = parseUnits(
    flashAmount.toString(),
    await getERC20Decimals({ publicClient, tokenAddress: BORROW_TOKEN })
  );


    let transaction = await getPendleRoute(
        PT_VAULT,
        BORROW_TOKEN,
        parsedFlashAmount,
        ZAP_CONTRACT
    );

    transaction = {...transaction, value: 0}

  const userBalance = await getERC20Balance({
    publicClient,
    account: userAddr,
    tokenAddress: TOKEN,
  });

  if (userBalance < parsedAmountIn) {
    console.log('userBalance', userBalance);
    console.log('parsedAmountIn', parsedAmountIn);
    console.log('tokenAddress', TOKEN);
    throw new Error('Insufficient balance');
  }

  if (
    await checkNeedApproval({
      publicClient,
      account: userAddr,
      tokenAddress: TOKEN,
      spender: ZAP_CONTRACT,
      amount: parsedAmountIn,
    })
  ) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: TOKEN,
        spender: ZAP_CONTRACT,
        amount: parsedAmountIn,
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve token: ' + error);
    }
  }

  if (
    await checkNeedApproval({
      publicClient,
      account: userAddr,
      tokenAddress: SHARE_DEBT_TOKEN,
      spender: ZAP_CONTRACT,
      amount: parsedFlashAmount * BigInt(2),
    })
  ) {
    try {
      const approveTx = await approveERC20({
        provider,
        tokenAddress: SHARE_DEBT_TOKEN,
        spender: ZAP_CONTRACT,
        amount: parsedFlashAmount * BigInt(2),
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });
    } catch (error) {
      throw new Error('Failed to approve token: ' + error);
    }
  }

  const transactionData = encodeFunctionData({
    abi: zapAbi,
    functionName: 'doStrategy',
    args: [
      {
        vault: SILO_VAULT,
        token: TOKEN,
        amount: parsedAmountIn,
        receiver: userAddr,
        funcSelector: '0xa7377f92',
        leverage: LEVERAGE,
        flashAmount: parsedFlashAmount,
        isProtected: true,
        swapFlashloan: {
          fromToken: BORROW_TOKEN,
          fromAmount: parsedFlashAmount,
          router: transaction.to as Address,
          data: transaction.data as Address,
          value: BigInt(transaction.value),
        },
      },
    ],
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
    throw new Error('Failed to deposit token into Bone1: ' + error);
  }
}
