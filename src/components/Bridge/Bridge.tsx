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

const Bridge: React.FC = () => {
    // "From" side state: default to Ethereum tokens
    const [fromChain, setFromChain] = useState<string>("eth");
    const [fromToken, setFromToken] = useState<Token>(sampleFromTokens["eth"][0]);
    const [fromAmount, setFromAmount] = useState<string>("");
    // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    const [toToken, setToToken] = useState<Token>(sampleToTokens[0]);
    const [toAmount, setToAmount] = useState<string>("");
    const [isFetchingBridge, setIsFetchingBridge] = useState<boolean>(false);

    const [fromUsdValue, setFromUsdValue] = useState<number>(0);
    const [toUsdValue, setToUsdValue] = useState<number>(0);

    const { wallets } = useWallets();
    
	const { tokenLists } = useData();
    // Modal states
    const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
    const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);

    const { authenticated} = usePrivy();

    const [isBridging, setIsBridging] = useState<boolean>(false);
    
    const handleFromTokenSelect = (token: Token, chainId: string) => {
        setFromChain(chainId);
        setFromToken(token);
        setIsFromModalOpen(false);
    };
    
    const handleToTokenSelect = (token: Token) => {
        setToToken(token);
        setIsToModalOpen(false);
    };
    
    const handleBridge = async () => {
        const fromChainName = availableChains.find((c) => c.id === fromChain)?.name;
        // alert(
        //     `Bridging ${fromAmount} ${fromToken.symbol} from ${fromChainName} to ${toAmount} ${toToken.symbol} on Sonic chain`
        // );

        setIsBridging(true);
        
        try {
            await bridge({
                walletClient: wallets[0],
                srcChainId: idMap[fromChain],
                dstChainId: 146,
                srcChainTokenIn: fromToken.address,
                srcAmountIn: fromAmount,
                dstChainTokenOut: toToken.address,
            });
        } catch(err) {
            console.error(err);
        }

        setIsBridging(false);
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
                const tokenAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
                const quote = await createTx(idMap[fromChain], fromToken["address"], tokenAmount, 100000014, toToken.address);
              
                if (quote?.errorCode) {
                    setToAmount("");
                    setToUsdValue(0);
                    setIsFetchingBridge(false);
                    return;
                }

                const outputAmount = ethers.formatUnits(quote?.estimation?.dstChainTokenOut.amount, toToken.decimals);
                
                if (!valid) return;
                setToAmount(parseFloat(outputAmount).toFixed(4));
                setFromUsdValue(quote?.estimation?.srcChainTokenIn.approximateUsdValue);
                setToUsdValue(quote?.estimation?.dstChainTokenOut.approximateUsdValue);

                setIsFetchingBridge(false);
            }
            
            if (fromAmount && fromToken && toToken && fromChain) {
                changeToAmount();
            }

            if (!fromAmount) {
                setToAmount('');
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
    }, [fromAmount, fromToken, fromChain, toToken]);
   

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
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
                        From ({availableChains.find((c) => c.id === fromChain)?.name})
                        </span>
                        <button
                        onClick={() => setIsFromModalOpen(true)}
                        className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-md"
                        >
                        {fromToken.logoURI && (
                            <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-6 h-6" />
                        )}
                        <span className="text-lg font-medium" style={{ color: "var(--primary)" }}>
                            {fromToken.symbol}
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
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                    />
                    <div className="w-full flex flex-row justify-between items-center content-center">

                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            ~${fromUsdValue.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            Balance: 382.228
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
                    {toToken.logoURI && (
                        <img src={toToken.logoURI} alt={toToken.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: "var(--primary)" }}>
                        {toToken.symbol}
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
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    disabled={true}
                />
                    <div className="w-full flex flex-row justify-between items-center content-center">
                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            ~${toUsdValue.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            Balance: 382.228
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleBridge}
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
                currentChain={fromChain}
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
        </div>
    );
};

export default Bridge;
