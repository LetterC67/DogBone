import {
    getERC20Balance,
    getERC20Decimals,
} from '../tools/utils/erc20Utils';
import { sonic, polygon, base, arbitrum, mainnet } from 'viem/chains';

import {
    createPublicClient,
    custom,
  } from 'viem';
import { ethers } from 'ethers';

async function getUserBalance(client: any, userAddress: string, tokenAddress: string, chainName: string, lastId = null) {
    const chain = chainName === "eth" ? mainnet : chainName === "polygon" ? polygon : chainName === "base" ? base : chainName === "arb" ? arbitrum : sonic;
    console.log("Get ", client.chainId, chain.id, lastId );
    if (
        (lastId == null && client.chainId.slice(7, client.chainId.length) !== chain.id.toString()) || 
            (lastId != null && lastId !== chain.id.toString())
        
    ) {
        await client.switchChain(chain.id);
    }

    const provider = await client.getEthereumProvider();
    // console.log(client.chainId.slice(7, client.chainId.length));

    console.log(chainName);

    console.log(chain);

    const publicClient = createPublicClient({
        chain: chain,
        transport: custom(provider),
    });

    const balance = await getERC20Balance({
        publicClient: publicClient,
        account: userAddress,
        tokenAddress: tokenAddress,
    });

    const decimals = await getERC20Decimals({
        publicClient: publicClient,
        tokenAddress: tokenAddress,
    });

    return ethers.formatUnits(balance, decimals);
}

export {
    getUserBalance
}