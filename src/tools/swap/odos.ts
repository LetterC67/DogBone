import { ConnectedWallet } from '@privy-io/react-auth';

interface OdosSwapArgs {
  walletClient: ConnectedWallet;
  chainId: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: bigint;
}

export async function getOdosSwapQuote({
  walletClient,
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
}: OdosSwapArgs) {
  const quoteUrl = 'https://api.odos.xyz/sor/quote/v2';

  const quoteRequestBody = {
    chainId: chainId,
    inputTokens: [
      {
        tokenAddress: tokenIn,
        amount: amountIn.toString(),
      },
    ],
    outputTokens: [
      {
        tokenAddress: tokenOut,
        proportion: 1,
      },
    ],
    userAddr: walletClient.address,
    slippageLimitPercent: 0.5,
    referralCode: 0,
    disableRFQs: true,
    compact: true,
  };

  const response = await fetch(quoteUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteRequestBody),
  });

  if (response.status === 200) {
    const quote = await response.json();
    return quote;
  } else {
    throw new Error(
      'Error in getting Odos Swap Quote to swap ' +
        amountIn +
        ' ' +
        tokenIn +
        ' to ' +
        tokenOut
    );
  }
}

export async function odosAssemble(
  walletClient: ConnectedWallet,
  pathId: string
) {
  const assembleUrl = 'https://api.odos.xyz/sor/assemble';

  console.log('Path ID:', pathId);

  const assembleRequestBody = {
    userAddr: walletClient.address,
    pathId: pathId,
    simulate: false,
  };

  const response = await fetch(assembleUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assembleRequestBody),
  });

  if (response.status === 200) {
    const assembledTransaction = await response.json();
    return assembledTransaction;
  } else {
    throw new Error('Error in assembling Odos Transaction');
  }
}

export async function odosExecute({
  walletClient,
  chainId,
  tokenIn,
  tokenOut,
  amountIn,
}: OdosSwapArgs) {
  const { pathId } = await getOdosSwapQuote({
    walletClient,
    chainId,
    tokenIn,
    tokenOut,
    amountIn,
  });
  const assembledTransaction = await odosAssemble(walletClient, pathId);
  console.log('assembled tx: ', assembledTransaction);
  return assembledTransaction;
}
