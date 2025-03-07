import { createPublicClient, custom, encodeFunctionData, parseUnits, } from 'viem';
import { sonic } from 'viem/chains';
import LSTList from './lstList.json';
import { getERC20Balance } from '../utils/erc20Utils';
import { NATIVE_TOKEN } from '../constants';
const lstList = JSON.parse(JSON.stringify(LSTList));
const wrappedAbi = [
    {
        name: 'deposit',
        type: 'function',
        stateMutability: 'payable',
        payable: true,
        inputs: [],
        outputs: [],
    },
];
export async function depositLST({ walletClient, vaultAddress, amount, }) {
    if (walletClient.chainId.slice(7, walletClient.chainId.length) !==
        sonic.id.toString()) {
        await walletClient.switchChain(sonic.id);
    }
    if (!lstList.find((lst) => lst.vault === vaultAddress)) {
        throw new Error('LST either not found or not supported');
    }
    const userAddr = walletClient.address;
    const provider = await walletClient.getEthereumProvider();
    const publicClient = createPublicClient({
        transport: custom(provider),
    });
    const parsedAmountIn = parseUnits(amount, 18);
    const userBalance = await getERC20Balance({
        publicClient,
        account: userAddr,
        tokenAddress: NATIVE_TOKEN,
    });
    if (userBalance < parsedAmountIn) {
        throw new Error('Insufficient balance');
    }
    const transactionData = encodeFunctionData({
        abi: wrappedAbi,
        functionName: 'deposit',
        args: [],
    });
    const transactionRequest = {
        to: vaultAddress,
        data: transactionData,
        value: parsedAmountIn,
    };
    try {
        const transactionHash = await provider.request({
            method: 'eth_sendTransaction',
            params: [transactionRequest],
        });
        return transactionHash;
    }
    catch (error) {
        throw new Error('Failed to wrap native token: ' + error);
    }
}
