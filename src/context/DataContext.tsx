import React, { createContext, useContext, useEffect, useState } from "react";
import {getTokenList} from "../api/deBridge";

// Create a context
const DataContext = createContext({ tokenLists: [], loading: true });

export const DataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [tokenLists, setTokenLists] = useState<{ [chainId: string]: Token[] }>({});

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

    return (
        <DataContext.Provider value={{ tokenLists, loading }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the token context
export const useData = () => useContext(DataContext);
