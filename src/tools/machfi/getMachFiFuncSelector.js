import { toFunctionSelector } from "viem";
export async function getMachFiFuncSelector(vaultAddress) {
    const selector = toFunctionSelector('function depositMachFi(address vault, address token, address receiver, uint256 amount)');
    return selector;
}
