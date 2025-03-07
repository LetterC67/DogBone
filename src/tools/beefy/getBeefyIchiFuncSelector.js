import { toFunctionSelector } from "viem";
export async function getBeefyIchiFuncSelector(vaultAddress) {
    const selector = toFunctionSelector('function depositBeefy(address vault, address token, address receiver, uint256 amount)');
    return selector;
}
