import { Address, toFunctionSelector } from "viem";

export async function getPendleFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositPendle(address vault, address token, address receiver, uint256 amount)');
    return selector;
}