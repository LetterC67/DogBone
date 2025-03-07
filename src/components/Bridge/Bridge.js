import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/Bridge.tsx
import { useEffect, useState } from "react";
import FromTokenModal from "./FromTokenModal";
import TokenModal from "./TokenModal";
import { sampleToTokens } from "./sampleToTokens";
import { availableChains } from "./availableChains";
import { useData } from "../../context/DataContext";
import { createTx } from "../../api/deBridge";
import { ethers } from "ethers";
import { bridge } from "../../tools/bridge/bridge";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Spinner from "../Common/Spinner";
import { FaWallet } from "react-icons/fa";
import { useControl } from "../../context/ControlContext";
import useFetchTwoBalance from "../../hooks/useFetchTwoBalance";
import Navigator from "../Navigator";
import { useAgent } from "../../context/AgentContext";
import { toast } from "react-toastify";
const Bridge = () => {
    // // "From" side state: default to Ethereum tokens
    // const [fromChain, setFromChain] = useState<string>("eth");
    // const [fromToken, setFromToken] = useState<Token>(sampleFromTokens["eth"][0]);
    // const [fromAmount, setFromAmount] = useState<string>("");
    // // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    // const [toToken, setToToken] = useState<Token>(sampleToTokens[0]);
    // const [toAmount, setToAmount] = useState<string>("");
    const { fromChainBridge, setFromChainBridge, fromTokenBridge, setFromTokenBridge, fromAmountBridge, setFromAmountBridge, toTokenBridge, setToTokenBridge, toAmountBridge, setToAmountBridge } = useControl();
    const [isFetchingBridge, setIsFetchingBridge] = useState(false);
    const [fromUsdValue, setFromUsdValue] = useState(0);
    const [toUsdValue, setToUsdValue] = useState(0);
    const { wallets } = useWallets();
    const { tokenLists, refetchBalance } = useData();
    // Modal states
    const [isFromModalOpen, setIsFromModalOpen] = useState(false);
    const [isToModalOpen, setIsToModalOpen] = useState(false);
    const { authenticated, login } = usePrivy();
    const [isBridging, setIsBridging] = useState(false);
    const { currentAction, resolve, reject, } = useAgent();
    const handleFromTokenSelect = (token, chainId) => {
        setFromChainBridge(chainId);
        setFromTokenBridge(token);
        setIsFromModalOpen(false);
    };
    const handleToTokenSelect = (token) => {
        setToTokenBridge(token);
        setIsToModalOpen(false);
    };
    const [fromError, setFromError] = useState(null);
    const { userBalance: fromBalance, userBalance2: toBalance } = useFetchTwoBalance(fromTokenBridge, fromChainBridge, toTokenBridge, "146");
    const handleBridge = async () => {
        const fromChainName = availableChains.find((c) => c.id === fromChainBridge)?.name;
        // alert(
        //     `Bridging ${fromAmount} ${fromToken.symbol} from ${fromChainName} to ${toAmount} ${toToken.symbol} on Sonic chain`
        // );
        if (currentAction && currentAction != 'bridge')
            return;
        setIsBridging(true);
        try {
            const result = await bridge({
                walletClient: wallets[0],
                srcChainId: idMap[fromChainBridge],
                dstChainId: 146,
                srcChainTokenIn: fromTokenBridge.address,
                srcAmountIn: fromAmountBridge,
                dstChainTokenOut: toTokenBridge.address,
            });
            setIsBridging(false);
            if (resolve)
                resolve(result.amountOut);
            toast.success("Bridge successful", {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
            refetchBalance(toTokenBridge);
        }
        catch (err) {
            console.error(err);
            if (reject)
                reject();
            toast.error("Bridge failed", {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
            setIsBridging(false);
        }
    };
    const idMap = {
        "eth": 1,
        "base": 8453,
        "polygon": 137,
        "arb": 42161,
    };
    useEffect(() => {
        let valid = true;
        const fetch = async () => {
            const changeToAmount = async () => {
                if (!valid)
                    return;
                setIsFetchingBridge(true);
                const tokenAmount = ethers.parseUnits(fromAmountBridge, fromTokenBridge.decimals);
                const quote = await createTx(idMap[fromChainBridge], fromTokenBridge["address"], tokenAmount, 100000014, toTokenBridge.address);
                if (quote?.errorCode) {
                    setFromError(null);
                    if (quote.errorCode === 12) {
                        setFromError("Amount too low!");
                    }
                    setToAmountBridge("");
                    setToUsdValue(0);
                    setFromUsdValue(0);
                    setIsFetchingBridge(false);
                    return;
                }
                setFromError(null);
                const outputAmount = ethers.formatUnits(quote?.estimation?.dstChainTokenOut.amount, toTokenBridge.decimals);
                if (!valid)
                    return;
                setToAmountBridge(parseFloat(outputAmount).toFixed(4));
                setFromUsdValue(quote?.estimation?.srcChainTokenIn.approximateUsdValue);
                setToUsdValue(quote?.estimation?.dstChainTokenOut.approximateUsdValue);
                setIsFetchingBridge(false);
            };
            if (fromAmountBridge && fromTokenBridge && toTokenBridge && fromChainBridge) {
                changeToAmount();
            }
            if (!fromAmountBridge) {
                setToAmountBridge('');
            }
        };
        fetch();
        // fetch every 30s
        const interval = setInterval(() => {
            fetch();
        }, 30000);
        return () => {
            valid = false;
            clearInterval(interval);
        };
    }, [fromAmountBridge, fromTokenBridge, fromChainBridge, toTokenBridge]);
    return (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [_jsx(Navigator, {}), _jsxs("div", { className: "w-full max-w-md p-6 rounded-xl shadow-lg", style: { backgroundColor: "var(--secondary)" }, children: [_jsx("h2", { className: "text-center text-2xl font-bold mb-4", style: { color: "var(--primary)" }, children: "Bridge to Sonic" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: "var(--accent)" }, children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsxs("span", { className: "text-sm", style: { color: "var(--higherlight)" }, children: ["From ", fromChainBridge && _jsxs(_Fragment, { children: ["(", availableChains.find((c) => c.id === fromChainBridge)?.name, ")"] })] }), _jsxs("button", { onClick: () => setIsFromModalOpen(true), className: "flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-md", children: [fromTokenBridge?.logoURI && (_jsx("img", { src: fromTokenBridge?.logoURI, alt: fromTokenBridge?.symbol, className: "w-6 h-6" })), _jsxs("span", { className: "text-lg font-medium", style: { color: "var(--primary)" }, children: [fromTokenBridge?.symbol, fromTokenBridge == null ? 'Select a token' : ''] }), _jsx("svg", { className: "w-4 h-4 transition-colors duration-200", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: "var(--primary)" }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })] })] }), _jsx("input", { type: "number", placeholder: "0.0", className: "w-full bg-transparent text-2xl font-bold outline-none", style: { color: "var(--primary)" }, value: fromAmountBridge, onChange: (e) => setFromAmountBridge(e.target.value) }), _jsxs("div", { className: "w-full flex flex-row justify-between items-center content-center", children: [_jsxs("div", { className: "text-xs mt-2", style: { color: "var(--less-highlight)" }, children: [!fromError && _jsxs(_Fragment, { children: ["~$", fromUsdValue.toFixed(2)] }), fromError &&
                                                        _jsx("div", { className: 'text-red-500', children: fromError })] }), _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Balance: ", fromBalance != null ? parseFloat(fromBalance).toFixed(4) : '-'] })] })] }), _jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: "var(--accent)" }, children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm", style: { color: "var(--higherlight)" }, children: "To (Sonic)" }), _jsxs("button", { onClick: () => setIsToModalOpen(true), className: "flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-md", children: [toTokenBridge?.logoURI && (_jsx("img", { src: toTokenBridge?.logoURI, alt: toTokenBridge?.symbol, className: "w-6 h-6" })), _jsxs("span", { className: "text-lg font-medium", style: { color: "var(--primary)" }, children: [toTokenBridge?.symbol, toTokenBridge == null ? 'Select a token' : ''] }), _jsx("svg", { className: "w-4 h-4 transition-colors duration-200", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: "var(--primary)" }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })] })] }), _jsx("input", { type: "number", placeholder: "0.0", className: `w-full bg-transparent text-2xl font-bold outline-none hover:cursor-not-allowed transition duration-300 ${isFetchingBridge ? 'text-(--disabled)' : 'text-(--primary)'}`, value: toAmountBridge, onChange: (e) => setToAmountBridge(e.target.value), disabled: true }), _jsxs("div", { className: "w-full flex flex-row justify-between items-center content-center", children: [_jsxs("div", { className: "text-xs mt-2", style: { color: "var(--less-highlight)" }, children: ["~$", toUsdValue.toFixed(2)] }), _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Balance: ", toBalance != null ? parseFloat(toBalance).toFixed(4) : '-'] })] })] })] }), _jsx("button", { onClick: authenticated ? handleBridge : login, className: `mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                    ${isBridging ? 'disabled:opacity-50' : 'opacity-100'}
                    `, children: authenticated ? isBridging ? _jsx(Spinner, {}) : 'Bridge' :
                            _jsxs("span", { className: "flex flex-row gap-2 w-full justify-center items-center", children: [_jsx(FaWallet, { size: 16 }), _jsx("span", { children: "Please Log In" })] }) }), isFromModalOpen && (_jsx(FromTokenModal, { currentChain: fromChainBridge, availableChains: availableChains, sampleTokens: tokenLists, onSelect: handleFromTokenSelect, onClose: () => setIsFromModalOpen(false), title: "Select a token" })), isToModalOpen && (_jsx(TokenModal, { tokens: sampleToTokens, onSelect: handleToTokenSelect, onClose: () => setIsToModalOpen(false), title: "Select a token" }))] })] }));
};
export default Bridge;
