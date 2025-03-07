import { toFunctionSelector } from "viem";
export async function getVicunaFuncSelector(vaultAddress) {
    const selector = toFunctionSelector('function depositVicuna(address vault, address token, address receiver, uint256 amount)');
    return selector;
}
