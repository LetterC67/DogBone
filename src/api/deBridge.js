const URL = "https://dln.debridge.finance";
async function getTokenList(chainId) {
    const endpoint = `${URL}/v1.0/token-list?chainId=${chainId}`;
    return await fetch(endpoint).then((res) => res.json()).then((data) => data.tokens);
}
async function createTx(srcChainId, srcChainTokenIn, srcChainTokenInAmount, dstChainId, dstChainTokenOut) {
    const endpoint = `${URL}/v1.0/dln/order/create-tx?srcChainId=${srcChainId}&srcChainTokenIn=${srcChainTokenIn}&srcChainTokenInAmount=${srcChainTokenInAmount}&dstChainId=${dstChainId}&dstChainTokenOut=${dstChainTokenOut}&dstChainTokenOutAmount=auto&affiliateFeePercent=0&prependOperatingExpenses=false&skipSolanaRecipientValidation=false`;
    return await fetch(endpoint).then((res) => res.json());
}
export { getTokenList, createTx };
