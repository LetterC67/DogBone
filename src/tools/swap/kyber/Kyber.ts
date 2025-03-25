import { Address } from "viem";
import { NATIVE_TOKEN } from "../../constants";


export interface V1GetData {
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint,
    feeAmount: number,
    chargeFeeBy: "currency_in" | "currency_out",
    feeReceiver: Address
}

export async function V1Get(data: V1GetData) {
    const API_URL = "https://aggregator-api.kyberswap.com/sonic/api/v1/routes/";
    if (data.tokenIn === NATIVE_TOKEN) {
        data.tokenIn = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    }
    if (data.tokenOut === NATIVE_TOKEN) {
        data.tokenOut = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    }
    
    const query = {
        tokenIn: data.tokenIn,
        tokenOut: data.tokenOut,
        amountIn: data.amountIn.toString(),
        feeAmount: data.feeAmount.toString(),
        chargeFeeBy: data.chargeFeeBy,
        feeReceiver: data.feeReceiver,
        isInBps: "true"
    }

    const fetchOptions = {
        headers: {
            "x-client-id": "dogbone"
        }
    };

    const url = new URL(API_URL);
    url.search = new URLSearchParams(query).toString();

    const response = await fetch(url.toString(), fetchOptions);
    const result = await response.json();
    console.log(JSON.stringify(result));
    return result;
}

interface V1PostData {
    routeSummary: any,
    sender: Address,
    recipient: Address,
    source: string,
    slippageTolerance: number,
}

export async function V1Post(data: V1PostData) {
    const API_URL = "https://aggregator-api.kyberswap.com/sonic/api/v1/route/build/";

    const fetchOptions = {
        headers: {
            "x-client-id": "dogbone",
            "Content-Type": "application/json"
        }
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: fetchOptions.headers,
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(JSON.stringify(result));

    return result;
}

export interface KyberData {
    getData: V1GetData,
    sender: Address,
    recipient: Address,
    slippage: number
}

export async function V1GetQuote(data: KyberData) {
    const getRoute = await V1Get(data.getData);
    const finalData = await V1Post({
        routeSummary: getRoute.data.routeSummary,
        sender: data.sender,
        recipient: data.recipient,
        source: "dogbone",
        slippageTolerance: data.slippage
    });

    return finalData;
}