import { Address } from "viem";

export async function getTokenPrice(token: string) {
    if (token.startsWith("0x")) {
        return getTokenPriceByAddress(token as Address);
    }

    return getTokenPriceBySymbol(token);


}

export async function getTokenPriceBySymbol(tokenSymbol: string) {
    
}

export async function getTokenPriceByAddress(token: Address) {

}
