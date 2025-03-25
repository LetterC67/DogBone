import { Address, createPublicClient, http } from "viem";
import { GetWithdrawAmountParams } from "../ToolAPI";
import { sonic } from "viem/chains";
import AaveList from './VicunaList.json';
import AaveAbi from './aave.abi.json';

const aaveVaultList = JSON.parse(JSON.stringify(AaveList));
const aaveAbi = JSON.parse(JSON.stringify(AaveAbi));
const AAVE: Address = '0xaa1C02a83362BcE106dFf6eB65282fE8B97A1665';
const MAX_UINT256 = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

interface AaveVaultConfig {
    name: string;
    vault: Address;
    token: Address;
}

export async function getVicunaSwapAmountAfterWithdraw({
    vaultAddress,
    percent,
    userAddr
}: GetWithdrawAmountParams) {
    const vaultConfig = aaveVaultList.find(
        (vault: AaveVaultConfig) => vault.vault === vaultAddress
      );
      if (!vaultConfig) {
        throw new Error('Aave vault either not found or not supported');
      }


    const amount = await getVicunaWithdrawAmount({
        vaultAddress,
        percent,
        userAddr
    });
    const amounts = [
        {
            amountIn: amount,
            tokenIn: vaultConfig.token
        }
    ];
    return amounts;
}


export async function getVicunaWithdrawAmount({
    vaultAddress,
    percent,
    userAddr
}: GetWithdrawAmountParams) {
    const vaultConfig = aaveVaultList.find(
        (vault: AaveVaultConfig) => vault.vault === vaultAddress
      );
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
            args: [vaultConfig.token, MAX_UINT256, userAddr],
            account: userAddr,
        });
        const amount = BigInt(result as any);
        
        const withdrawAmount = amount * percent / BigInt(10000);
        console.log('Aave Position: ', withdrawAmount);
        return withdrawAmount;
    } catch (error) {
        console.log('Error: ', error);
        return 0;
    }
}