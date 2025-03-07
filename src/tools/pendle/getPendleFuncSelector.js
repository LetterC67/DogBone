import { toFunctionSelector } from "viem";
export async function getPendleFuncSelector(vaultAddress) {
    const selector = toFunctionSelector('function depositPendle(address vault, address token, address receiver, uint256 amount)');
    return selector;
}
