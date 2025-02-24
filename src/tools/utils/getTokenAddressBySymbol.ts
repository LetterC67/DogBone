import { Address } from 'viem';
import TokenList from '../tokenList.json';

const tokenList = JSON.parse(JSON.stringify(TokenList));

interface TokenConfig {
  name: string;
  symbol: string;
  address: Address;
  chainId: number;
}

export function getTokenAddressBySymbol(tokenName: string, chainId: number) {
  const token = tokenList.tokens.find(
    (token: TokenConfig) =>
      token.symbol === tokenName && token.chainId === chainId
  );

  if (token) {
    return token.address;
  }
  return null;
}
