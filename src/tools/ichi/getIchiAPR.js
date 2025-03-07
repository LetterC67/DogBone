import { createPublicClient, formatEther, formatUnits, http, } from 'viem';
import IchiVaultList from './ichiVaultList.json';
import IchiVaultAbi from './ichiVault.abi.json';
import IchiGaugeAbi from './ichiGauge.abi.json';
import { sonic } from 'viem/chains';
import { getERC20Decimals } from '../utils/erc20Utils';
import { getTokenPriceByAddress, getTokenPriceByAddresses } from '../utils/getTokenPrice';
const ichiVaultList = JSON.parse(JSON.stringify(IchiVaultList));
const ichiVaultAbi = JSON.parse(JSON.stringify(IchiVaultAbi));
const ichiGaugeAbi = JSON.parse(JSON.stringify(IchiGaugeAbi));
const SWPX_TOKEN = '0xA04BC7140c26fc9BB1F36B1A604C7A5a88fb0E70';
const DAYS_PER_YEAR = 31536000;
export async function getIchiAPR(vaultAddress) {
    const ichiVaultConfig = ichiVaultList.find((vault) => vault.vault === vaultAddress);
    if (!ichiVaultConfig) {
        throw new Error('Ichi vault either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http(),
    });
    const { gauge } = ichiVaultConfig;
    const txMulticall = await publicClient.multicall({
        contracts: [
            {
                address: gauge,
                abi: ichiGaugeAbi,
                functionName: 'rewardRate',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'balanceOf',
                args: [gauge],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'totalSupply',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'token0',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'token1',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'getTotalAmounts',
                args: [],
            },
        ],
    });
    const rewardRate = txMulticall[0].result;
    const ichiGaugeBalance = txMulticall[1].result;
    const ichiTotalSupply = txMulticall[2].result;
    const token0 = txMulticall[3].result;
    const token1 = txMulticall[4].result;
    const [total0, total1] = txMulticall[5].result;
    const [SwpxPrice, token0Price, token1Price] = await getTokenPriceByAddresses([
        SWPX_TOKEN,
        token0,
        token1,
    ], sonic.id);
    const token0Decimal = await getERC20Decimals({
        publicClient,
        tokenAddress: token0,
    });
    const token1Decimal = await getERC20Decimals({
        publicClient,
        tokenAddress: token1,
    });
    const token0Value = Number(token0Price) * Number(formatUnits(total0, token0Decimal));
    const token1Value = Number(token1Price) * Number(formatUnits(total1, token1Decimal));
    const TVL = ((token0Value + token1Value) * Number(formatEther(ichiGaugeBalance))) /
        Number(formatEther(ichiTotalSupply));
    const ichiAPR = ((Number(formatEther(rewardRate)) * SwpxPrice * DAYS_PER_YEAR) / TVL) * 100;
    console.log('Ichi APR: ', ichiAPR);
    return ichiAPR;
}
export async function getIchiTVL(vaultAddress) {
    const ichiVaultConfig = ichiVaultList.find((vault) => vault.vault === vaultAddress);
    if (!ichiVaultConfig) {
        throw new Error('Ichi vault either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http(),
    });
    const { gauge } = ichiVaultConfig;
    const txMulticall = await publicClient.multicall({
        contracts: [
            {
                address: gauge,
                abi: ichiGaugeAbi,
                functionName: 'rewardRate',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'balanceOf',
                args: [gauge],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'totalSupply',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'token0',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'token1',
                args: [],
            },
            {
                address: vaultAddress,
                abi: ichiVaultAbi,
                functionName: 'getTotalAmounts',
                args: [],
            },
        ],
    });
    const token0 = txMulticall[3].result;
    const token1 = txMulticall[4].result;
    const [total0, total1] = txMulticall[5].result;
    const token0Price = await getTokenPriceByAddress(token0, 146);
    const token1Price = await getTokenPriceByAddress(token1, 146);
    const token0Decimal = await getERC20Decimals({
        publicClient,
        tokenAddress: token0,
    });
    const token1Decimal = await getERC20Decimals({
        publicClient,
        tokenAddress: token1,
    });
    const token0Value = Number(token0Price) * Number(formatUnits(total0, token0Decimal));
    const token1Value = Number(token1Price) * Number(formatUnits(total1, token1Decimal));
    const TVL = token0Value + token1Value;
    return TVL;
}
