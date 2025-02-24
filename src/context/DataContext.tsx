import React, { createContext, useContext, useEffect, useState } from "react";
import {getTokenList} from "../api/deBridge";
import { getVaultAPR, getVaultPosition, getVaultPointsAPR, getVaultTotalAPR } from "../tools/ToolAPI";
import Strategies from "../tools/strategies.json"
import Providers from "../data/provider.json";
import { sampleToTokens } from "../data/sonicTokens";
import { useWallets } from "@privy-io/react-auth";
// import {sonicTokens as sampleToTokens} from "../data/sonicTokens.tsx";
import { getTokenPriceByAddresses } from "../tools/coingecko/getTokenPriceByAddresses";
import tokenList from "../tools/tokenList.json";
// Create a context
const DataContext = createContext({ tokenLists: [], loading: true, aprList: {}, strategyList: [], tokenPriceSonic: {}, getTokenListByChainId: (chainId: string) => {} });


export const DataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [tokenLists, setTokenLists] = useState<{ [chainId: string]: Token[] }>({});
    const [aprList, setAprList] = useState({});
    const [strategyList, setStrategyList] = useState<any[]>([]);
    const [tokenPriceSonic, setTokenPriceSonic] = useState<any>({});
    
    function getTokenListByChainId(chainId: number) {
        return tokenList.tokens.filter((token) => token.chainId === chainId);
    }

    function changeForm(data: { [chainId: string]: { [address: string]: Token } }) {
        const result: { [chainId: string]: Token[] } = {};

        for (const chainId in data) {
            result[chainId] = Object.keys(data[chainId]).map(
                (address) => data[chainId][address]
            );
        }            
        
        return result;
    }

    useEffect(() => {
        async function fetch() {
            // Get token list from deBridge API for chainId 1, 137, 8453, 42161
            const tokenData: { [key: string]: { [address: string]: Token; }} = {};

            // Get token list from deBridge API for chainId 1, 137, 8453, 42161 save into tokenData

            await getTokenList("1").then((data) => tokenData["eth"] = data);
            await getTokenList("137").then((data) => tokenData["polygon"] = data);
            await getTokenList("8453").then((data) => tokenData["base"] = data);
            await getTokenList("42161").then((data) => tokenData["arb"] = data);

            setTokenLists(changeForm(tokenData));

            // await getTokenList("1").then((data) => setTokenLists((prev) => ({ ...prev, "eth": data })));
            // await getTokenList("137").then((data) => setTokenLists((prev) => ({ ...prev, "polygon": data })));
            // await getTokenList("8453").then((data) => setTokenLists((prev) => ({ ...prev, "base": data })));
            // await getTokenList("42161").then((data) => setTokenLists((prev) => ({ ...prev, "arbitrum": data })));
        }

        fetch();
    }, []);

    const { wallets } = useWallets();

    useEffect(() => {
        let valid = true;
        let cnt = 0;

        async function fetchApr(type: string, address: string, name: string, provider: any, strategy: any) {
            let apr = 0, point_apr = 0;
            try {
                apr = await getVaultAPR(name);
                point_apr = getVaultPointsAPR(name);
            } catch (error) {
                console.log("error", error);
            }
            let position = 0;
            console.log("fetching apr", name);
            if (wallets.length > 0) {
                try {
                    position = await getVaultPosition(wallets[0], name);
                } catch {
                    position = 0;
                }
            }
            cnt += 1;
            console.log("position", position,  typeof position, wallets.length, cnt);
            return {
                type: provider.type,
                name: strategy.name,
                vault: strategy.vault,
                token: sampleToTokens.find(
                    (token) => token.address.toLowerCase() === address.toLowerCase()
                ),
                apr: apr,
                point_apr: point_apr,
                "provider": Providers.filter((p) => p.name === provider.type)[0],
                position: position
            };
        }
        
        async function fetch() {
            const promises: Promise<any>[] = [];
            for (const provider of Strategies) {
                for (const strategy of provider.lists) {
                    promises.push(
                        fetchApr(provider.type, strategy.token, strategy.name, provider, strategy)
                    );
                }
            }
            console.log("fethed");
            // Wait for all fetchApr promises to resolve
            const finalizedData = await Promise.all(promises);
            console.log("DONE NOW ", valid);
            // Save the finalized data into strategyList
            if (valid)
                setStrategyList(finalizedData);
            console.log("finalizedData", finalizedData);
        }
        
        console.log("RUN NOW", wallets.length);
        fetch();

        const interval = setInterval(() => {
            fetch();
        }, 360000);

        // return () => ;
        return () => {
            valid = false;
            clearInterval(interval);
        };
    }, [wallets.length]);

    useEffect(() => {
        async function fetch() {
            const tokenAddressList = [];
            for (const token of sampleToTokens) {
                tokenAddressList.push(token.address);
            }

            const price = await getTokenPriceByAddresses(tokenAddressList);

            const result: { [address: string]: any } = {};
            for (let i = 0; i < tokenAddressList.length; i++) {
                result[tokenAddressList[i]] = price[i];
            }
            
            console.log("token price", result);
            setTokenPriceSonic(result);
        }

        // fetch every 1 minute
        fetch();

        const interval = setInterval(() => {
            fetch();
        }, 360000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (Object.keys(tokenLists).length === 4) {
            setLoading(false);
        }
    }, [tokenLists]);

    return (
        <DataContext.Provider value={{ tokenLists, loading, aprList, strategyList, tokenPriceSonic, getTokenListByChainId }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the token context
export const useData = () => useContext(DataContext);
