// src/Bridge.tsx
import React, { useEffect, useState } from "react";
import FromTokenModal from "./FromTokenModal";
import TokenModal from "./TokenModal";
import { Token } from "./types";
import { sampleFromTokens } from "./sampleFromTokens";
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

const Bridge: React.FC = () => {
    // // "From" side state: default to Ethereum tokens
    // const [fromChain, setFromChain] = useState<string>("eth");
    // const [fromToken, setFromToken] = useState<Token>(sampleFromTokens["eth"][0]);
    // const [fromAmount, setFromAmount] = useState<string>("");
    // // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    // const [toToken, setToToken] = useState<Token>(sampleToTokens[0]);
    // const [toAmount, setToAmount] = useState<string>("");

    const {
        fromChainBridge,
        setFromChainBridge,
        fromTokenBridge,
        setFromTokenBridge,
        fromAmountBridge,
        setFromAmountBridge,
        toTokenBridge,
        setToTokenBridge,
        toAmountBridge,
        setToAmountBridge
    } = useControl();

    const [isFetchingBridge, setIsFetchingBridge] = useState<boolean>(false);

    const [fromUsdValue, setFromUsdValue] = useState<number>(0);
    const [toUsdValue, setToUsdValue] = useState<number>(0);

    const { wallets } = useWallets();
    
	const { tokenLists, refetchBalance } = useData();
    // Modal states
    const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
    const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);

    const { authenticated, login } = usePrivy();

    const [isBridging, setIsBridging] = useState<boolean>(false);

    const {
        currentAction,
        resolve,
        reject,
    } = useAgent();

    const handleFromTokenSelect = (token: Token, chainId: string) => {
        setFromChainBridge(chainId);
        setFromTokenBridge(token);
        setIsFromModalOpen(false);
    };
    
    const handleToTokenSelect = (token: Token) => {
        setToTokenBridge(token);
        setIsToModalOpen(false);
    };

    const [fromError, setFromError] = useState<string | null>(null);
    
    const { userBalance:fromBalance, userBalance2:toBalance } = useFetchTwoBalance(fromTokenBridge, fromChainBridge, toTokenBridge, "146");
    const handleBridge = async () => {
        const fromChainName = availableChains.find((c) => c.id === fromChainBridge)?.name;
        // alert(
        //     `Bridging ${fromAmount} ${fromToken.symbol} from ${fromChainName} to ${toAmount} ${toToken.symbol} on Sonic chain`
        // );

        if (currentAction && currentAction != 'bridge') return;

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
                if(resolve)
                resolve(result.amountOut);
                
                toast.success("Bridge successful",
                    {
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );

                refetchBalance(toTokenBridge);
        } catch(err) {
            console.error(err);
            if (reject)
            reject();
            toast.error("Bridge failed",
                {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                }
            );
            
            setIsBridging(false);
        }
    };
    
    const idMap = {
        "eth": 1,
        "base": 8453,
        "polygon": 137,
        "arb": 42161,
    }
    useEffect(() => {
        let valid = true;

        const fetch = async () => {
            const changeToAmount = async () => {
                if (!valid) return;
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
                
                if (!valid) return;
                setToAmountBridge(parseFloat(outputAmount).toFixed(4));
                setFromUsdValue(quote?.estimation?.srcChainTokenIn.approximateUsdValue);
                setToUsdValue(quote?.estimation?.dstChainTokenOut.approximateUsdValue);

                setIsFetchingBridge(false);
            }
            
            if (fromAmountBridge && fromTokenBridge && toTokenBridge && fromChainBridge) {
                changeToAmount();
            }

            if (!fromAmountBridge) {
                setToAmountBridge('');
            }
        }

        fetch();

        // fetch every 30s
        const interval = setInterval(() => {
            fetch();
        }, 30000);

        return () => {
            valid = false;
            clearInterval(interval);
        }
    }, [fromAmountBridge, fromTokenBridge, fromChainBridge, toTokenBridge]);
   

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Navigator></Navigator>
            <div    
            className="w-full max-w-md p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: "var(--secondary)" }}
            >
            <h2 className="text-center text-2xl font-bold mb-4" style={{ color: "var(--primary)" }}>
                Bridge to Sonic
            </h2>
            <div className="space-y-4">
                {/* From Section */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: "var(--higherlight)" }}>
                        From {fromChainBridge && <>({availableChains.find((c) => c.id === fromChainBridge)?.name})</>}
                        </span>
                        <button
                        onClick={() => setIsFromModalOpen(true)}
                        className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-md"
                        >
                        {fromTokenBridge?.logoURI && (
                            <img src={fromTokenBridge?.logoURI} alt={fromTokenBridge?.symbol} className="w-6 h-6" />
                        )}
                        <span className="text-lg font-medium" style={{ color: "var(--primary)" }}>
                            {fromTokenBridge?.symbol}
                            {fromTokenBridge == null ? 'Select a token' : ''}
                        </span>
                        <svg
                            className="w-4 h-4 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: "var(--primary)" }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        </button>
                    </div>
                    <input
                        type="number"
                        placeholder="0.0"
                        className="w-full bg-transparent text-2xl font-bold outline-none"
                        style={{ color: "var(--primary)" }}
                        value={fromAmountBridge}
                        onChange={(e) => setFromAmountBridge(e.target.value)}
                    />
                    <div className="w-full flex flex-row justify-between items-center content-center">

                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            {!fromError && <>~${fromUsdValue.toFixed(2)}</>}
                            {fromError && 
                            <div className='text-red-500'>
                                {fromError}
                            </div>    
                            }
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            Balance: {fromBalance != null ? parseFloat(fromBalance).toFixed(4) : '-'}
                        </div>
                    </div>
                </div>

                {/* To Section */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--accent)" }}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: "var(--higherlight)" }}>
                    To (Sonic)
                    </span>
                    <button
                    onClick={() => setIsToModalOpen(true)}
                    className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-md"
                    >
                    {toTokenBridge?.logoURI && (
                        <img src={toTokenBridge?.logoURI} alt={toTokenBridge?.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: "var(--primary)" }}>
                        {toTokenBridge?.symbol}
                        {toTokenBridge == null ? 'Select a token' : ''}
                    </span>
                    <svg
                        className="w-4 h-4 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: "var(--primary)" }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                </div>
                <input
                    type="number"
                    placeholder="0.0"
                    className={`w-full bg-transparent text-2xl font-bold outline-none hover:cursor-not-allowed transition duration-300 ${isFetchingBridge ? 'text-(--disabled)' : 'text-(--primary)'}`}
                    value={toAmountBridge}
                    onChange={(e) => setToAmountBridge(e.target.value)}
                    disabled={true}
                />
                    <div className="w-full flex flex-row justify-between items-center content-center">
                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            ~${toUsdValue.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            Balance: {toBalance != null ? parseFloat(toBalance).toFixed(4) : '-'}
                        </div>
                    </div>
                </div>
            </div>


            <button
                onClick={authenticated ? handleBridge : login}
                className={`mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                    ${isBridging ? 'disabled:opacity-50' : 'opacity-100'}
                    `}
                    
                    >
                {authenticated ? isBridging ? <Spinner/> : 'Bridge' : 
                <span className="flex flex-row gap-2 w-full justify-center items-center">
                    <FaWallet size={16}/>
                    <span>Please Log In</span>
                </span>}
            </button>

            {/* From Token Modal */}
            {isFromModalOpen && (
                <FromTokenModal
                currentChain={fromChainBridge}
                availableChains={availableChains}
                sampleTokens={tokenLists}
                onSelect={handleFromTokenSelect}
                onClose={() => setIsFromModalOpen(false)}
                title="Select a token"
                />
            )}

            {/* To Token Modal */}
            {isToModalOpen && (
                <TokenModal
                tokens={sampleToTokens}
                onSelect={handleToTokenSelect}
                onClose={() => setIsToModalOpen(false)}
                title="Select a token"
                />
            )}
            </div>
                <div className="mt-6 text-[var(--less-highlight)] text-lg flex flex-row gap-2 items-center hover:cursor-pointer" onClick={() => window.open('https://debridge.finance')}>
                    Built using <span className='bg-[var(--accent-2)] rounded-lg py-2 px-2 text-white flex flex-row gap-1 font-semibold'> 
                        <img src="/deBridge.png" className='h-6'></img>
                            deBridge
                        </span>
                </div>
        </div>
    );
};

export default Bridge;
