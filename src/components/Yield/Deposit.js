import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useControl } from "../../context/ControlContext";
import TokenModal from "./TokenModal";
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import StrategyNavbar from "./StrategyNavbar";
import { depositVault, zap, bridgeAndZap, withdrawVault } from "../../tools/ToolAPI";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import Spinner from '../../components/Common/Spinner';
import { useData } from "../../context/DataContext";
import { useAgent } from "../../context/AgentContext";
import useFetchBalance from "../../hooks/useFetchBalance";
import { toast } from "react-toastify";
import { getTokenPriceBySymbol } from "../../tools/utils/getTokenPrice";
function Deposit() {
    const { authenticated, login } = usePrivy();
    const { strategyTab, setStrategyTab, strategyAmount, setStrategyAmount, strategyToken, setStrategyToken, strategy, setStrategy, setIsInStrategyTab, strategyChain, setStrategyChain } = useControl();
    const [activeModal, setActiveModal] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [valueUSD, setValueUSD] = useState(0);
    const { wallets } = useWallets();
    const { tokenPriceSonic, getTokenListByChainId, depositedSonic, refetchPosition } = useData();
    const [tokens, setTokens] = useState([]);
    const { userBalance } = useFetchBalance(strategyToken, strategyChain == 146 ? "sonic" : strategyChain == 137 ? "polygon" : strategyChain == 8453 ? "base" : strategyChain == 42161 ? "arb" : "eth");
    const { currentAction, reject, resolve } = useAgent();
    useEffect(() => {
        if (strategyChain) {
            setTokens(getTokenListByChainId(strategyChain));
        }
    }, [strategyChain]);
    useEffect(() => {
        let valid = true;
        if (strategyToken && strategyAmount) {
            getTokenPriceBySymbol(strategyToken.symbol).then((price) => {
                if (!valid)
                    return;
                setValueUSD(parseFloat(price) * parseFloat(strategyAmount));
            });
        }
        else {
            setValueUSD(0);
        }
        return () => {
            valid = false;
        };
    }, [strategyToken, strategyAmount]);
    // useEffect(() => {
    //     console.log(tokens);
    //     if(tokens)
    //     setStrategyToken(tokens[0]);
    // }, [tokens]);
    async function execute() {
        console.log(strategyTab, currentAction, strategyTab == currentAction);
        if (currentAction && currentAction != strategyTab)
            return;
        setIsRunning(true);
        if (strategyTab == "Deposit") {
            try {
                // await deposit();
                console.log(strategyToken);
                if (strategyToken.chainId == 146) {
                    if (strategyToken.address.toLowerCase() != strategy.token.address.toLowerCase()) {
                        await zap(wallets[0], strategyToken.address, strategyAmount, strategy.name);
                    }
                    else {
                        await depositVault(wallets[0], strategy.name, strategyAmount);
                    }
                }
                else {
                    console.log(strategyToken.chainId);
                    console.log(strategyToken.address);
                    console.log(strategy.name);
                    await bridgeAndZap(wallets[0], strategyToken.chainId, strategyToken.address, strategyAmount, strategy.name);
                }
                if (resolve) {
                    resolve();
                }
                toast.success(`Deposited ${strategyAmount} ${strategy.token.symbol} successfully`, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
                refetchPosition(strategy);
            }
            catch (error) {
                console.error(error);
                if (reject) {
                    reject();
                }
                toast.error("Failed to deposit", {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsRunning(false);
            }
            setIsRunning(false);
        }
        else if (strategyTab == "Withdraw") {
            try {
                await withdrawVault(wallets[0], strategy.name, strategyAmount);
                if (resolve) {
                    resolve();
                }
                toast.success(`Withdrawn ${strategyAmount} ${strategy.token.symbol} successfully`, {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
                refetchPosition(strategy);
            }
            catch (error) {
                console.error(error);
                if (reject) {
                    reject();
                }
                toast.error("This strategy is currently not available for withdrawal", {
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                });
                setIsRunning(false);
            }
            setIsRunning(false);
        }
    }
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [_jsx("div", { className: "w-full max-w-md pl-16", children: _jsx(StrategyNavbar, {}) }), _jsxs("div", { className: "flex flex-row", children: [_jsx("div", { className: "mt-4", children: _jsx("div", { className: `p-2 bg-(--accent) text-(--disabled) rounded-tl-lg rounded-bl-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1 text-lg pb-2`, onClick: () => setIsInStrategyTab(false), children: _jsx("div", { children: _jsx(FaArrowLeft, {}) }) }) }), _jsxs("div", { className: "w-full max-w-md p-6 rounded-xl shadow-lg", style: { backgroundColor: 'var(--secondary)' }, children: [_jsx("h2", { className: "text-center text-2xl font-bold mb-4", style: { color: 'var(--primary)' }, children: strategy.name }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: 'var(--accent)' }, children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm", style: { color: 'var(--higherlight)' }, children: [strategyTab, " (", strategyChain == 1 ? "Ethereum" : strategyChain == 146 ? "Sonic" : strategyChain == 137 ? "Polygon" : strategyChain == 8453 ? "Base" : "Arbitrum", ")"] }), strategyTab == "Deposit" &&
                                                        _jsxs("button", { onClick: () => setActiveModal(true), className: "flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg", children: [strategyToken?.logoURI && (_jsx("img", { src: strategyToken.logoURI, alt: strategyToken.symbol, className: "rounded-full w-6 h-6" })), _jsx("span", { className: "text-lg font-medium", style: { color: 'var(--primary)' }, children: strategyToken?.symbol }), _jsx("svg", { className: "w-4 h-4 transition-colors duration-200", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: 'var(--primary)' }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })] }), strategyTab == "Withdraw" &&
                                                        _jsxs("div", { className: "flex items-center space-x-2 focus:outline-none p-1 rounded-lg", children: [strategy.token.logoURI && (_jsx("img", { src: strategy.token.logoURI, alt: strategy.token.symbol, className: "rounded-full w-6 h-6" })), _jsx("span", { className: "text-lg font-medium", style: { color: 'var(--primary)' }, children: strategy.token?.symbol })] })] }), _jsx("input", { type: "number", placeholder: "0.0", className: "w-full bg-transparent text-2xl font-bold outline-none", style: { color: 'var(--primary)' }, value: strategyAmount, onChange: (e) => setStrategyAmount(e.target.value) }), _jsxs("div", { className: "w-full flex flex-row justify-between items-center content-center", children: [_jsxs("div", { className: "text-xs mt-2", style: { color: "var(--less-highlight)" }, children: ["~$", valueUSD.toFixed(2)] }), strategyTab == 'Deposit' &&
                                                        _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Balance: ", userBalance ? parseFloat(userBalance).toFixed(4) : '-'] }), strategyTab == 'Withdraw' &&
                                                        _jsxs("div", { className: "text-xs mt-1", style: { color: "var(--less-highlight)" }, children: ["Deposited: ", depositedSonic[strategy.name] ? parseFloat(depositedSonic[strategy.name]).toFixed(4) : '-'] })] })] }) }), _jsxs("div", { className: "flex flex-col gap-2 mt-6 p-1", children: [_jsxs("div", { className: "flex flex-row justify-between", children: [_jsx("div", { className: "font-bold", children: "Provider" }), _jsx("div", { className: "text-(--higherlight)", children: strategy.provider.full_name })] }), _jsxs("div", { className: "flex flex-row justify-between", children: [_jsx("div", { className: "font-bold", children: "Underlying token" }), _jsx("div", { className: "text-(--higherlight)", children: strategy.token.symbol })] }), _jsxs("div", { className: "flex flex-row justify-between", children: [_jsx("div", { className: "font-bold", children: "APR" }), _jsxs("div", { className: "text-(--higherlight)", children: [strategy.apr.toFixed(2), "% + ", strategy.point_apr.toFixed(2), "%"] })] }), _jsxs("div", { className: "flex flex-row justify-between", children: [_jsx("div", { className: "font-bold", children: "Deposited" }), _jsx("div", { className: "text-(--higherlight)", children: depositedSonic[strategy.name] ? parseFloat(depositedSonic[strategy.name]).toFixed(4) : '-' })] })] }), _jsx("button", { onClick: authenticated ? execute : login, className: `mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                        ${isRunning ? 'disabled:opacity-50' : 'opacity-100'}
                        `, disabled: (isRunning || !strategyAmount) && authenticated, children: authenticated ? isRunning ? _jsx(Spinner, {}) : _jsx(_Fragment, { children: strategyTab }) :
                                        _jsxs("span", { className: "flex flex-row gap-2 w-full justify-center items-center", children: [_jsx(FaWallet, { size: 16 }), _jsx("span", { children: "Please Log In" })] }) }), activeModal && (_jsx(TokenModal, { tokens: tokens, onSelect: (token) => {
                                        setStrategyToken(token);
                                        setActiveModal(null);
                                    }, strategyChain: strategyChain, setStrategyChain: setStrategyChain, onClose: () => setActiveModal(null), title: "Select a token" }))] })] })] }) }));
}
export default Deposit;
