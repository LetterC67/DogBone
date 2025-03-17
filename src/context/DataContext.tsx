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
import { useControl } from "./ControlContext";
import { getTokenPriceBySymbol, getTokenPriceByAddress } from "../tools/utils/getTokenPrice";
import { getTokenBalance } from "../tools/utils/getTokenBalance";
import { getSonicPoints } from "../tools/utils/getSonicPoints";
import { getRingsPoints } from "../tools/utils/getRingsPoints";
import { getPrice } from "../api/Odos";
import { getAutomatedTasks } from "../api/agent";

// Create a context
const DataContext = createContext({ tokenLists: [], loading: true, aprList: {}, strategyList: [], tokenPriceSonic: {}, getTokenListByChainId: (chainId: string) => {}, sonicPoint: 0, ringsPoint: 0, threadID: "", depositedSonic: {}, tokenBalanceSonic: {}, refetchBalance: (token) => {}, refetchPosition: (strategy) => {} , automatedTasks: [], fetchAutomatedTasks: () => {}, setAutomatedTasks: (tasks: any[]) => {} });


export const DataProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [tokenLists, setTokenLists] = useState<{ [chainId: string]: Token[] }>({});
    const [aprList, setAprList] = useState({});
    const [strategyList, setStrategyList] = useState<any[]>([]);
    const [tokenPriceSonic, setTokenPriceSonic] = useState<any>({});
    const [tokenBalanceSonic, setTokenBalanceSonic] = useState<any>({});
    const [depositedSonic, setDepositedSonic] = useState<any>({});
    const [automatedTasks, setAutomatedTasks] = useState<any[]>([]);
    const {strategy, setStrategy, setFilteredStrategies, selectedTokens, setSelectedTokens, showOnlyDeposited, allTokens, setAllTokens, agentFilteredStrategies, setAgentFilteredStrategies} = useControl();
    const [sonicPoint, setSonicPoint] = useState(0);
    const [ringsPoint, setRingsPoint] = useState(0);
    const [threadID, setThreadID] = useState("");
    const { wallets } = useWallets();

    const sonicTokens = tokenList.tokens.filter((token) => token.chainId === 146);
    
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
        // Get URL from environment variable
        const AGENT_URL = import.meta.env.VITE_APP_AGENT_URL;
        
        async function getThreadID() {
            // Get Thread ID from Agent
            const response = await fetch(`${AGENT_URL}/thread/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "user_address": wallets.length > 0 ? wallets[0].address : "0xANONYMOUS",
                }),
            }
            );
            const data = await response.json();
            console.log("thread_id", data.thread_id);
            return data.thread_id;
        }

        async function _fetch() {
            setThreadID(await getThreadID());
        }

        _fetch();
    }, [wallets.length]);

    async function fetchAutomatedTasks() {
        if (wallets.length === 0) return;
        const tasks = await getAutomatedTasks(wallets[0].address);
        // console.log("tasks ", tasks);
        setAutomatedTasks(tasks);
    }
    useEffect(() => {

        fetchAutomatedTasks();
    }, [wallets.length]);

    useEffect(() => {
        async function fetch() {
            if (wallets.length === 0) return;

            const sonic = await getSonicPoints(wallets[0].address);
            const rings = await getRingsPoints(wallets[0].address);

            setSonicPoint(sonic);
            setRingsPoint(rings);
        }

        fetch();

        const interval = setInterval(() => {
            fetch();
        }, 360000);

        return () => clearInterval(interval);
    }, [wallets.length]);

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


    // useEffect(() => {
    //     setFilteredStrategies(strategyList);
    //     const _tokens = [];

    //     if (showOnlyDeposited) {
    //         setFilteredStrategies((prev) => prev.filter((strategy) => strategy.position != 0));
    //     }

    //     for (const strategy of strategyList) {
    //         _tokens.push(strategy.token);
    //     }

    //     setAllTokens([...new Set(_tokens)]);
    // }, [strategyList]);

    const removeDuplicates = (items) => {
        const uniqueItems = items.filter(
          (item, index, self) =>
            index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(item))
        );
        return uniqueItems;
      };

    useEffect(() => {
        const _tokens = [];
        for (const strategy of strategyList) {
            _tokens.push(strategy.token);
        }

        // console.log("tokens ", _tokens);
        // Unique values
        setAllTokens(removeDuplicates(_tokens));
    }, [strategyList]);

    useEffect(() => {
        setAgentFilteredStrategies([]);
    }, [selectedTokens, showOnlyDeposited]);

    useEffect(() => {
        if (selectedTokens.length != 0) {
            setFilteredStrategies(strategyList.filter((strategy) => selectedTokens.includes(strategy.token.symbol)));
        } else {
            setFilteredStrategies(strategyList);
        }
        
        if (agentFilteredStrategies.length != 0) {
            const newList = [];

            for(const strategy of agentFilteredStrategies) {
                newList.push(strategyList.find((s) => s.name === strategy.name));
            }
            
            setFilteredStrategies(newList);
        }

        if (showOnlyDeposited) {
            setFilteredStrategies((prev) => prev.filter((strategy) => depositedSonic[strategy.name] != 0));
        }
    }, [selectedTokens, showOnlyDeposited, strategyList, agentFilteredStrategies]);

    useEffect(() => {
        async function _fetch() {
            const URL = import.meta.env.VITE_APP_BACKEND_URL;
            const response = await fetch(`${URL}/apr`);
            setStrategyList((await response.json()).data);
        }

        _fetch();
    }, []);

    
    // fetch position for a single strategy
    async function refetchPosition(strategy) {
        try {
            const position = await getVaultPosition(wallets[0], strategy.name);
            // set the position in the state
            setDepositedSonic((prev) => ({ ...prev, [strategy.name]: position }));
            refetchBalance(strategy.token);
        } catch(error) {
            console.log("Error fetching vault position ", error);
            setDepositedSonic((prev) => ({ ...prev, [strategy.name]: "0" }));
        }
    }

    // fetch balance for a single token
    async function refetchBalance(token) {
        if (!wallets.length) return null;

            const balance = await getTokenBalance(146, token.address, wallets[0].address);
            setTokenBalanceSonic((prev) => ({ ...prev, [token.symbol]: balance }));
        

        const sonicBalance = await getTokenBalance(146, "0x0000000000000000000000000000000000000000", wallets[0].address);
        setTokenBalanceSonic((prev) => ({ ...prev, ["S"]: sonicBalance }));
    }

    useEffect(() => {
        if (wallets.length === 0) return;
        if (strategyList.length === 0) return;
      
        async function fetchAllPositions() {
          try {
            const positionPromises = strategyList.map(async (strategy) => {
                // console.log(strategy.name);
                try {
                    const position = await getVaultPosition(wallets[0], strategy.name);
                    return { name: strategy.name, position: position.toString() };
                } catch(error) {
                    // console.log(strategy.name);
                    // console.log("Error fetching vault position ", error);
                    return { name: strategy.name, position: "0" };
                }
            });
      
            const results = await Promise.all(positionPromises);
            // console.log("done fetching");
      
            setDepositedSonic((prev) => {
              const updated = { ...prev };
              for (const { name, position } of results) {
                updated[name] = position;
              }
              return updated;
            });
          } catch (err) {
            console.error("Error fetching vault positions:", err);
          }
        }
      
        fetchAllPositions();
    }, [strategyList, wallets.length]);

    useEffect(() => {
        async function fetchAllPrices() {
            const prices = await getPrice();
            // console.log(prices);
            // convert key tolower

            let prices_ = Object.fromEntries(
                Object.entries(prices).map(([key, value]) => [key.toLowerCase(), value])
            );

            prices_["0x9fb76f7ce5fceaa2c42887ff441d46095e494206" ] = 1;
            prices_["0xe8a41c62bb4d5863c6eadc96792cfe90a1f37c47"] = prices_["0x50c42deacd8fc9773493ed674b675be577f2634b"];
            const btcPrice = await getTokenPriceByAddress("0x541FD749419CA806a8bc7da8ac23D346f2dF8B77", 146);
            prices_["0xCC0966D8418d412c599A6421b760a847eB169A8c"] = btcPrice;
            prices_["0x541FD749419CA806a8bc7da8ac23D346f2dF8B77"] = btcPrice;

            const result = Object.fromEntries(
                Object.entries(prices_).map(([address, price]) => {
                  const token = tokenList.tokens.find((token) => token.address.toLowerCase() === address.toLowerCase() && token.chainId === 146);
                  const symbol = token ? token.symbol : address; // fallback to address if no symbol found
                  return [symbol, price];
                })
              );

            for (const token of sonicTokens) {
                if (!result[token.symbol]) {
                    result[token.symbol] = await getTokenPriceByAddress(token.address, 146);
                }
            }
            setTokenPriceSonic(result);

        }

    
        fetchAllPrices();
    
        const interval = setInterval(() => {
          fetchAllPrices();
        }, 360000);
    
        // Clean up
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        // Only fetch if there's at least one wallet
        if (!wallets.length) return;
    
        async function fetchAllBalances() {
          try {
            // Map each token to a Promise that retrieves its balance
            const balancePromises = tokenList.tokens.filter((token) => token.chainId === 146).map(async (token) => {
                try {
                    const balance = await getTokenBalance(146, token.address, wallets[0].address);
                    return { symbol: token.symbol, balance };
                } catch (err) {
                    console.error("Error fetching balance:", err);
                    return { address: token.symbol, balance: "0" };
                }
            });
    
            // Wait until all balances have been fetched
            const balances = await Promise.all(balancePromises);
    
            console.log("balances ", balances);

            // Build up a new balance map and update state once
            setTokenBalanceSonic((prev) => {
              const updated = { ...prev };
              for (const { symbol, balance } of balances) {
                updated[symbol] = balance;
              }
              return updated;
            });
          } catch (err) {
            console.error("Error fetching balances:", err);
          }
        }
    
        fetchAllBalances();
    }, [wallets.length]);

    useEffect(() => {
        if (Object.keys(tokenLists).length === 4) {
            setLoading(false);
        }
    }, [tokenLists]);

    return (
        <DataContext.Provider value={{ tokenLists, loading, aprList, strategyList, tokenPriceSonic, getTokenListByChainId, tokenBalanceSonic, sonicPoint, ringsPoint, threadID, depositedSonic, refetchBalance, refetchPosition, automatedTasks, fetchAutomatedTasks, setAutomatedTasks }}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook to use the token context
export const useData = () => useContext(DataContext);
