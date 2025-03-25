import { createContext, useContext, useState } from "react";
import { sampleToTokens } from "../components/Bridge/sampleToTokens";
import { sampleFromTokens } from "../components/Bridge/sampleFromTokens";
import TokenList from "../components/Swap/TokenList"
import { strategyFunctions } from "../tools/listStrategies";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const tokens: Token[] = Object.entries(TokenList).map(([address, tokenData]) => ({
    address,
    name: tokenData.name,
    symbol: tokenData.symbol,
    decimals: tokenData.decimals,
    assetId: tokenData.assetId,
    assetType: tokenData.assetType,
    protocolId: tokenData.protocolId,
    isRebasing: tokenData.isRebasing,
    icon: tokenData.img,
    balance: 1000, // Dummy balance for demonstration
  }));

const ControlContext = createContext({
    stategyTab: "",
    setStrategyTab: (tab: string) => {},
    strategyAmount: "",
    setStrategyAmount: (amount: string) => {},
    strategyToken: null,
    setStrategyToken: (token: any) => {},
    strategy: {},
    setStrategy: (strategy: any) => {},
    isInStrategyTab: false,
    setIsInStrategyTab: (isIn: boolean) => {},
    showOnlyDeposited: false,
    setShowOnlyDeposited: (show: boolean) => {},
    fromChainBridge: "",
    setFromChainBridge: (chain: string) => {},
    fromTokenBridge: {},
    setFromTokenBridge: (token: any) => {},
    fromAmountBridge: "",
    setFromAmountBridge: (amount: string) => {},
    toTokenBridge: {},
    setToTokenBridge: (token: any) => {},
    toAmountBridge: "",
    setToAmountBridge: (amount: string) => {},
    fromTokenSwap: {},
    setFromTokenSwap: (token: any) => {},
    toTokenSwap: {},
    setToTokenSwap: (token: any) => {},
    fromAmountSwap: "",
    setFromAmountSwap: (amount: string) => {},
    toAmountSwap: "",
    setToAmountSwap: (amount: string) => {},
    strategyChain: 146,
    setStrategyChain: (chain: number) => {},
    filteredStrategies: [],
    setFilteredStrategies: (strategies: any[]) => {},
    selectedTokens: [],
    setSelectedTokens: (tokens: string[]) => {},
    allTokens: [],
    setAllTokens: (tokens: any[]) => {},
    agentFilteredStrategies: [],
    setAgentFilteredStrategies: (strategies: any[]) => {},
    lang: {lang: 'en', name: 'English'},
    setLang: (lang: {lang: string, name: string}) => {},
    leverage: 1,
    setLeverage: (leverage: Number) => {},
    slippage: 1,
    setSlippage: (slippage: Number) => {}
})

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [strategyTab, setStrategyTab] = useState<string>("Deposit");
    const [strategyAmount, setStrategyAmount] = useState<string>("");
    const [filteredStrategies, setFilteredStrategies] = useState<any[]>([]);
    const [strategyToken, setStrategyToken] = useState<any>({
        "address": "0x0000000000000000000000000000000000000000",
        "name": "Sonic",
        "symbol": "S",
        "decimals": 18,
        "assetId": "sonic",
        "assetType": "sonic",
        "protocolId": "native",
        "isRebasing": false,
        "chainId": 146,
        "logoURI": "https://sonicscan.org/assets/sonic/images/svg/logos/token-light.svg?v=25.2.1.0"
    });
    const [strategy, setStrategy] = useState<any>(
        {
            "type": "rings",
            "name": "Rings stkscUSD Vault",
            "vault": "0x5e39021Ae7D3f6267dc7995BB5Dd15669060DAe0",
            "token": {
              "symbol": "scUSD",
              "name": "Sonic USD",
              "decimals": 6,
              "address": "0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae",
              "logoURI": "https://tokens.debridge.finance/Logo/100000014/0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae/small/token-logo.png",
              "tags": [],
              "eip2612": false
            },
            "apr": 5
        }
    );
    const [isInStrategyTab, setIsInStrategyTab] = useState<boolean>(false);
    const [showOnlyDeposited, setShowOnlyDeposited] = useState<boolean>(false);

    const [fromChainBridge, setFromChainBridge] = useState<string | null>(null);
    const [fromTokenBridge, setFromTokenBridge] = useState<Token | null>(null);
    const [fromAmountBridge, setFromAmountBridge] = useState<string>("");
    // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    const [toTokenBridge, setToTokenBridge] = useState<Token | null>(null);
    const [toAmountBridge, setToAmountBridge] = useState<string>("");

    const [fromTokenSwap, setFromTokenSwap] = useState<Token | null>(null);
    const [toTokenSwap, setToTokenSwap] = useState<Token | null>(null);
    const [fromAmountSwap, setFromAmountSwap] = useState<string>('');
    const [toAmountSwap, setToAmountSwap] = useState<string>('');

    const [strategyChain, setStrategyChain] = useState<number>(146);
    
    const [allTokens, setAllTokens] = useState<any[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

    const [agentFilteredStrategies, setAgentFilteredStrategies] = useState<any[]>([]);

    const [leverage, setLeverage] = useState<number>(1);
    const [slippage, setSlippage] = useState<number>(1);


    const [lang, setLang] = useState(() => {
        const storedLang = localStorage.getItem('language');
        console.log("stored ", storedLang);
        return storedLang ? JSON.parse(storedLang) : { lang: 'en', name: 'English' };
    });
    
    const { t, i18n } = useTranslation();
    
    useEffect(() => {
        console.log("new lang ", lang);
        i18n.changeLanguage(lang.lang); // Use only the language code
        localStorage.setItem('language', JSON.stringify(lang)); // Store language preference as a string
    }, [lang]);
    

    return (
        <ControlContext.Provider value={{
            strategyTab,
            setStrategyTab,
            strategyAmount,
            setStrategyAmount,
            strategyToken,
            setStrategyToken,
            strategy,
            setStrategy,
            isInStrategyTab,
            setIsInStrategyTab,
            showOnlyDeposited,
            setShowOnlyDeposited,
            fromChainBridge,
            setFromChainBridge,
            fromTokenBridge,
            setFromTokenBridge,
            fromAmountBridge,
            setFromAmountBridge,
            toTokenBridge,
            setToTokenBridge,
            toAmountBridge,
            setToAmountBridge,
            fromTokenSwap,
            setFromTokenSwap,
            toTokenSwap,
            setToTokenSwap,
            fromAmountSwap,
            setFromAmountSwap,
            toAmountSwap,
            setToAmountSwap,
            strategyChain,
            setStrategyChain,
            filteredStrategies,
            setFilteredStrategies,
            selectedTokens,
            setSelectedTokens,
            allTokens,
            setAllTokens,
            agentFilteredStrategies,
            setAgentFilteredStrategies,
            lang,
            setLang,
            leverage,
            setLeverage,
            slippage,
            setSlippage
        }}>
            {children}
        </ControlContext.Provider>
    )
}

export const useControl = () => useContext(ControlContext);