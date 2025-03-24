import { Address, toFunctionSelector } from "viem";

export function getDogBoneWithdrawFuncSelector(vaultAddress: Address) {
    const selector = toFunctionSelector('function withdrawSiloLooping(bytes memory _loopingWithdrawData)');
    return selector;
}