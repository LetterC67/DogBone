import { Address, toFunctionSelector } from "viem";

export async function getIchiFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositIchi(address vault, address token, address receiver, uint256 amount)');
    return selector;
}

export async function getIchiWithdrawFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function withdrawIchi(bytes memory _ichiWithdrawData)');
    return selector;
}