import { Address, toFunctionSelector } from "viem";

export async function getBeefyIchiFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function depositBeefy(address vault, address token, address receiver, uint256 amount)');
    return selector;
}

export async function getBeefyIchiWithdrawFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function withdrawBeefyIchi(bytes memory _beefyIchiWithdrawData)');
    return selector;
}