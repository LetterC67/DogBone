import { Address, toFunctionSelector } from "viem";

export async function getAaveFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositAave(address vault, address token, address receiver, uint256 amount)');
    return selector;
}