import { Address, toFunctionSelector } from "viem";

export async function getAaveFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositAave(address vault, address token, address receiver, uint256 amount)');
    return selector;
}

export async function getAaveWithdrawFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function withdrawAave(bytes memory _aaveWithdrawData)');
    return selector;
}