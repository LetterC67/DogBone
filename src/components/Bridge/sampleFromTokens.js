// Sample data for tokens from various chains (all tokens use the same format)
const sampleFromTokensData = {
    eth: {
        "0x0000000000000000000000000000000000000000": {
            "symbol": "ETH",
            "name": "Ethereum",
            "decimals": 18,
            "address": "0x0000000000000000000000000000000000000000",
            "logoURI": "https://tokens.debridge.finance/Logo/1/0x0000000000000000000000000000000000000000/small/token-logo.svg",
            "tags": [],
            "eip2612": false
        },
    },
    polygon: {
        "0x3333333333333333333333333333333333333333": {
            symbol: "PTK1",
            name: "Polygon Token 1",
            decimals: 18,
            address: "0x3333333333333333333333333333333333333333",
            logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=014",
            tags: [],
            eip2612: false,
            balance: 300,
        },
        "0x4444444444444444444444444444444444444444": {
            symbol: "PTK2",
            name: "Polygon Token 2",
            decimals: 18,
            address: "0x4444444444444444444444444444444444444444",
            logoURI: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=014",
            tags: [],
            eip2612: false,
            balance: 400,
        },
    },
    base: {
        "0x5555555555555555555555555555555555555555": {
            symbol: "BTK1",
            name: "Base Token 1",
            decimals: 18,
            address: "0x5555555555555555555555555555555555555555",
            logoURI: "https://via.placeholder.com/32?text=BT1",
            tags: [],
            eip2612: false,
            balance: 500,
        },
    },
    arb: {
        "0x6666666666666666666666666666666666666666": {
            symbol: "ATK1",
            name: "Arbitrum Token 1",
            decimals: 18,
            address: "0x6666666666666666666666666666666666666666",
            logoURI: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=014",
            tags: [],
            eip2612: false,
            balance: 600,
        },
    },
};
export const sampleFromTokens = {};
for (const chainId in sampleFromTokensData) {
    sampleFromTokens[chainId] = Object.keys(sampleFromTokensData[chainId]).map((address) => sampleFromTokensData[chainId][address]);
}
