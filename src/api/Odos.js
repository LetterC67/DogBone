const URL = "https://api.odos.xyz";
async function getQuote({ inputToken, outputToken, inputAmount }) {
    const quote_url = `${URL}/sor/quote/v2`;
    // console.log(inputToken, outputToken, inputAmount);
    const body = {
        "chainId": 146,
        "inputTokens": [
            {
                "tokenAddress": inputToken,
                "amount": inputAmount
            }
        ],
        "outputTokens": [
            {
                "tokenAddress": outputToken,
                "proportion": 1
            }
        ]
    };
    try {
        const response = await fetch(quote_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching quote:', error);
    }
}
async function getPrice() {
    const price_url = `${URL}/pricing/token/146`;
    const response = await fetch(price_url);
    const data = await response.json();
    console.log(data);
    return data.tokenPrices;
}
export { getQuote, getPrice };
