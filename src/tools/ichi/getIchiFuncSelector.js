import { toFunctionSelector } from "viem";
export async function getIchiFuncSelector(vaultAddress) {
    const selector = toFunctionSelector('function depositIchi(address vault, address token, address receiver, uint256 amount)');
    return selector;
}
