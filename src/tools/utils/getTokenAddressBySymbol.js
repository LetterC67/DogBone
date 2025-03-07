import TokenList from '../tokenList.json';
const tokenList = JSON.parse(JSON.stringify(TokenList));
const t = TokenList.tokens.filter((token) => (token.chainId == 146));
let p = "";
for (const x of t) {
    p += x.name + " " + x.symbol + "\n";
}
console.log(p);
export function getTokenAddressBySymbol(tokenName, chainId) {
    const token = tokenList.tokens.find((token) => ((token.symbol === tokenName || token.address === tokenName || token.name === tokenName) && token.chainId === chainId));
    if (!token) {
        return null;
    }
    return token.address;
}
