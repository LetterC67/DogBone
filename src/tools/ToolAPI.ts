import { Address } from "viem";
import { strategyFunctions, nameToTypeMapping, nameToConfigMapping } from "./listStrategies";
import { ConnectedWallet } from '@privy-io/react-auth';


export async function depositVault(walletClient: ConnectedWallet, strategyName: string, amount: string) {
    const strategy = nameToTypeMapping[strategyName];
    if (!strategy) {
        throw new Error('Strategy not found');
    }

    const strategyFunction = strategyFunctions[strategy as keyof typeof strategyFunctions];
    const { vault } = nameToConfigMapping[strategyName];

    return strategyFunction.deposit({walletClient, vaultAddress: vault, amount});
}

export async function getVaultAPR(strategyName: string): Promise<number> {
    const strategy = nameToTypeMapping[strategyName];
    if (!strategy) {
        throw new Error('Strategy not found');
    }

    const strategyFunction = strategyFunctions[strategy as keyof typeof strategyFunctions];
    const { vault } = nameToConfigMapping[strategyName];

    return strategyFunction.viewAPR(vault);
}

export async function getVaultPosition(walletClient: ConnectedWallet, strategyName: string) {
    const strategy = nameToTypeMapping[strategyName];
    if (!strategy) {
        throw new Error('Strategy not found');
    }

    const strategyFunction = strategyFunctions[strategy as keyof typeof strategyFunctions];
    const { vault } = nameToConfigMapping[strategyName];

    return strategyFunction.viewPosition({vaultAddress: vault, userAddress: walletClient.address as Address});
}