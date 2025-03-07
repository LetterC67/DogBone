import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/Swap.tsx
import { useEffect, useState } from 'react';
import TokenModal from './TokenModal';
import { IoSwapVertical } from "react-icons/io5";
import TokenList from './TokenList';
import { getQuote } from '../../api/Odos';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';
import { swap } from '../../tools/swap/swap';
import useFetchBalance from '../../hooks/useFetchBalance';
import Spinner from '../../components/Common/Spinner';
import { useControl } from '../../context/ControlContext';
import { useAgent } from '../../context/AgentContext';
import Navigator from '../Navigator';
import { toast } from 'react-toastify';
import { useData } from '../../context/DataContext';
// Convert the TokenList object into an array of tokens
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
const Swap = () => {
    // const [fromToken, setFromToken] = useState<Token>(tokens[0]);
    // const [toToken, setToToken] = useState<Token>(tokens[1]);
    // const [fromAmount, setFromAmount] = useState<string>('');
    // const [toAmount, setToAmount] = useState<string>('');
    const { fromTokenSwap, setFromTokenSwap, toTokenSwap, setToTokenSwap, fromAmountSwap, setFromAmountSwap, toAmountSwap, setToAmountSwap } = useControl();
    const [activeModal, setActiveModal] = useState(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const { authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const [isSwapping, setIsSwapping] = useState(false);
    const [fromUsdValue, setFromUsdValue] = useState(0);
    const [toUsdValue, setToUsdValue] = useState(0);
    const { userBalance: fromBalance } = useFetchBalance(fromTokenSwap);
    const { userBalance: toBalance } = useFetchBalance(toTokenSwap);
    const { refetchBalance } = useData();
    const { messages, reject, currentAction, code, resolve } = useAgent();
    // Swap the token selections (and corresponding amounts)
    const swapTokens = () => {
        setFromTokenSwap(toTokenSwap);
        setToTokenSwap(fromTokenSwap);
        // setFromAmount(toAmount);
        // setToAmount(fromAmount);
    };
    useEffect(() => {
        let valid = true;
        const fetch = async () => {
            const fetchQuote = async () => {
                setIsFetchingPrice(true);
                const inputAmount = ethers.parseUnits((Number(fromAmountSwap).toFixed(6)).toString(), fromTokenSwap.decimals);
                const response = await getQuote({
                    inputToken: fromTokenSwap.address,
                    outputToken: toTokenSwap.address,
                    inputAmount: inputAmount.toString(),
                });
                if (!valid)
                    return;
                const outputAmount = ethers.formatUnits(response?.outAmounts[0], toTokenSwap.decimals);
                setToAmountSwap(parseFloat(outputAmount).toFixed(6));
                setToUsdValue(response?.outValues[0]);
                setFromUsdValue(response?.inValues[0]);
                setIsFetchingPrice(false);
            };
            if (fromAmountSwap && fromTokenSwap && toTokenSwap) {
                fetchQuote();
            }
            if (!fromAmountSwap) {
                setToAmountSwap('');
            }
        };
        fetch();
        const interval = setInterval(fetch, 30000);
        return () => {
            valid = false;
            clearInterval(interval);
        };
    }, [fromTokenSwap, toTokenSwap, fromAmountSwap]);
    // Simulate a swap action (replace with your real logic)
    const handleSwap = async () => {
        // alert(`Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
        // const inputAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
        // console.log(wallets[0].address);
        if (currentAction && currentAction != 'swap')
            return;
        setIsSwapping(true);
        try {
            const result = await swap({
                walletClient: wallets[0],
                chainId: 146,
                tokenIn: fromTokenSwap.address,
                tokenOut: toTokenSwap.address,
                amountIn: fromAmountSwap.toString()
            });
            setIsSwapping(false);
            if (resolve) {
                resolve(result.amountOut);
            }
            toast.success("Swap successful", {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
            refetchBalance(fromTokenSwap);
            refetchBalance(toTokenSwap);
        }
        catch (error) {
            console.error('Error swapping tokens:', error.message);
            if (reject) {
                reject();
            }
            toast.error("Swap failed", {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
            });
            setIsSwapping(false);
        }
        // resolve();
    };
    return (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [_jsx(Navigator, {}), _jsxs("div", { className: "w-full max-w-md p-6 rounded-xl shadow-lg", style: { backgroundColor: 'var(--secondary)' }, children: [_jsx("h2", { className: "text-center text-2xl font-bold mb-4", style: { color: 'var(--primary)' }, children: "Token Swap" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: 'var(--accent)' }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", style: { color: 'var(--higherlight)' }, children: "From" }), _jsxs("button", { onClick: () => setActiveModal('from'), className: "flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg", children: [fromTokenSwap?.icon && (_jsx("img", { src: fromTokenSwap?.icon, alt: fromTokenSwap?.symbol, className: "w-6 h-6" })), _jsxs("span", { className: "text-lg font-medium", style: { color: 'var(--primary)' }, children: [fromTokenSwap?.symbol, fromTokenSwap == null && 'Select a token'] }), _jsx("svg", { className: "w-4 h-4 transition-colors duration-200", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: 'var(--primary)' }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })] })] }), _jsx("input", { type: "number", placeholder: "0.0", className: "w-full bg-transparent text-2xl font-bold outline-none", style: { color: 'var(--primary)' }, value: fromAmountSwap, onChange: (e) => setFromAmountSwap(e.target.value) }), _jsxs("div", { className: "w-full flex flex-row justify-between items-center content-center", children: [_jsxs("div", { className: "text-xs mt-2", style: { color: "var(--less-highlight)" }, children: ["~$", fromUsdValue.toFixed(2)] }), _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Balance: ", fromBalance != null ? parseFloat(fromBalance).toFixed(6) : '-'] })] }), "                "] }), _jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: swapTokens, className: "p-2 rounded-full shadow-lg transition duration-300 hover:bg-(--focus) bg-(--accent) focus:outline-none hover:cursor-pointer", children: _jsx(IoSwapVertical, { size: 24 }) }) }), _jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: 'var(--accent)' }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", style: { color: 'var(--higherlight)' }, children: "To" }), _jsxs("button", { onClick: () => setActiveModal('to'), className: "flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg", children: [toTokenSwap?.icon && (_jsx("img", { src: toTokenSwap?.icon, alt: toTokenSwap?.symbol, className: "w-6 h-6" })), _jsxs("span", { className: "text-lg font-medium", style: { color: 'var(--primary)' }, children: [toTokenSwap?.symbol, toTokenSwap == null && 'Select a token'] }), _jsx("svg", { className: "w-4 h-4 transition-colors duration-200", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: 'var(--primary)' }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })] })] }), _jsx("input", { type: "number", placeholder: "0.0", className: `hover:cursor-not-allowed w-full bg-transparent text-2xl font-bold outline-none transition duration-200 ${isFetchingPrice ? 'text-(--disabled)' : 'text-(--primary)'}`, value: toAmountSwap, disabled: true }), _jsxs("div", { className: "w-full flex flex-row justify-between items-center content-center", children: [_jsxs("div", { className: "text-xs mt-2", style: { color: "var(--less-highlight)" }, children: ["~$", toUsdValue.toFixed(2)] }), _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Balance: ", toBalance != null ? parseFloat(toBalance).toFixed(6) : '-'] })] })] })] }), _jsx("button", { onClick: authenticated ? handleSwap : login, className: `mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                ${isSwapping ? 'disabled:opacity-50' : 'opacity-100'}
                `, children: authenticated ? isSwapping ? _jsx(Spinner, {}) : 'Swap' :
                            _jsxs("span", { className: "flex flex-row gap-2 w-full justify-center items-center", children: [_jsx(FaWallet, { size: 16 }), _jsx("span", { children: "Please Log In" })] }) }), activeModal && (_jsx(TokenModal, { tokens: tokens, onSelect: (token) => {
                            if (activeModal === 'from') {
                                setFromTokenSwap(token);
                            }
                            else {
                                setToTokenSwap(token);
                            }
                            setActiveModal(null);
                        }, onClose: () => setActiveModal(null), title: "Select a token" }))] })] }));
};
export default Swap;
