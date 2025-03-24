import { Address, toFunctionSelector } from "viem";

export async function getVicunaFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositVicuna(address vault, address token, address receiver, uint256 amount)');
    return selector;
}

export async function getVicunaWithdrawFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function withdrawVicuna(bytes memory _vicunaWithdrawData)');
    return selector;
}