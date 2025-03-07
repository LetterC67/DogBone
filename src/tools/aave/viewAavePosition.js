import { createPublicClient, formatUnits, http } from 'viem';
import AaveList from './AaveList.json';
import AaveAbi from './aave.abi.json';
import { sonic } from 'viem/chains';
import { getERC20Decimals } from '../utils/erc20Utils';
const aaveVaultList = JSON.parse(JSON.stringify(AaveList));
const aaveAbi = JSON.parse(JSON.stringify(AaveAbi));
const AAVE = '0x5362dBb1e601abF3a4c14c22ffEdA64042E5eAA3';
const MAX_UINT256 = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");
export async function viewAavePosition({ vaultAddress, userAddress, }) {
    const vaultConfig = aaveVaultList.find((vault) => vault.vault === vaultAddress);
    if (!vaultConfig) {
        throw new Error('Aave vault either not found or not supported');
    }
    const publicClient = createPublicClient({
        chain: sonic,
        transport: http()
    });
    try {
        const { result } = await publicClient.simulateContract({
            address: AAVE,
            abi: aaveAbi,
            functionName: 'withdraw',
            args: [vaultConfig.token, MAX_UINT256, userAddress],
            account: userAddress,
        });
        const amount = result;
        const decimal = await getERC20Decimals({
            publicClient,
            tokenAddress: vaultConfig.token
        });
        return formatUnits(amount, decimal);
    }
    catch (error) {
        return 0;
    }
}
