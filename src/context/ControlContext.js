import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import TokenList from "../components/Swap/TokenList";
const tokens = Object.entries(TokenList).map(([address, tokenData]) => ({
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
    setStrategyTab: (tab) => { },
    strategyAmount: "",
    setStrategyAmount: (amount) => { },
    strategyToken: null,
    setStrategyToken: (token) => { },
    strategy: {},
    setStrategy: (strategy) => { },
    isInStrategyTab: false,
    setIsInStrategyTab: (isIn) => { },
    showOnlyDeposited: false,
    setShowOnlyDeposited: (show) => { },
    fromChainBridge: "",
    setFromChainBridge: (chain) => { },
    fromTokenBridge: {},
    setFromTokenBridge: (token) => { },
    fromAmountBridge: "",
    setFromAmountBridge: (amount) => { },
    toTokenBridge: {},
    setToTokenBridge: (token) => { },
    toAmountBridge: "",
    setToAmountBridge: (amount) => { },
    fromTokenSwap: {},
    setFromTokenSwap: (token) => { },
    toTokenSwap: {},
    setToTokenSwap: (token) => { },
    fromAmountSwap: "",
    setFromAmountSwap: (amount) => { },
    toAmountSwap: "",
    setToAmountSwap: (amount) => { },
    strategyChain: 146,
    setStrategyChain: (chain) => { },
    filteredStrategies: [],
    setFilteredStrategies: (strategies) => { },
    selectedTokens: [],
    setSelectedTokens: (tokens) => { },
    allTokens: [],
    setAllTokens: (tokens) => { },
    agentFilteredStrategies: [],
    setAgentFilteredStrategies: (strategies) => { },
});
export const ControlProvider = ({ children }) => {
    const [strategyTab, setStrategyTab] = useState("Deposit");
    const [strategyAmount, setStrategyAmount] = useState("");
    const [filteredStrategies, setFilteredStrategies] = useState([]);
    const [strategyToken, setStrategyToken] = useState({
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
    const [strategy, setStrategy] = useState({
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
    });
    const [isInStrategyTab, setIsInStrategyTab] = useState(false);
    const [showOnlyDeposited, setShowOnlyDeposited] = useState(false);
    const [fromChainBridge, setFromChainBridge] = useState(null);
    const [fromTokenBridge, setFromTokenBridge] = useState(null);
    const [fromAmountBridge, setFromAmountBridge] = useState("");
    // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    const [toTokenBridge, setToTokenBridge] = useState(null);
    const [toAmountBridge, setToAmountBridge] = useState("");
    const [fromTokenSwap, setFromTokenSwap] = useState(null);
    const [toTokenSwap, setToTokenSwap] = useState(null);
    const [fromAmountSwap, setFromAmountSwap] = useState('');
    const [toAmountSwap, setToAmountSwap] = useState('');
    const [strategyChain, setStrategyChain] = useState(146);
    const [allTokens, setAllTokens] = useState([]);
    const [selectedTokens, setSelectedTokens] = useState([]);
    const [agentFilteredStrategies, setAgentFilteredStrategies] = useState([]);
    return (_jsx(ControlContext.Provider, { value: {
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
            setAgentFilteredStrategies
        }, children: children }));
};
export const useControl = () => useContext(ControlContext);
