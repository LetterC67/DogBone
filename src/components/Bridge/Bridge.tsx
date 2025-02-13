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

const Bridge: React.FC = () => {
    // "From" side state: default to Ethereum tokens
    const [fromChain, setFromChain] = useState<string>("eth");
    const [fromToken, setFromToken] = useState<Token>(sampleFromTokens["eth"][0]);
    const [fromAmount, setFromAmount] = useState<string>("");
    // "To" side state: chain is fixed to Sonic; user may select any Sonic token
    const [toToken, setToToken] = useState<Token>(sampleToTokens[0]);
    const [toAmount, setToAmount] = useState<string>("");
    const [isFetchingBridge, setIsFetchingBridge] = useState<boolean>(false);
    
    
	const { tokenLists } = useData();
    // Modal states
    const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
    const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);
    
    const handleFromTokenSelect = (token: Token, chainId: string) => {
        setFromChain(chainId);
        setFromToken(token);
        setIsFromModalOpen(false);
    };
    
    const handleToTokenSelect = (token: Token) => {
        setToToken(token);
        setIsToModalOpen(false);
    };
    
    const handleBridge = () => {
        const fromChainName = availableChains.find((c) => c.id === fromChain)?.name;
        alert(
            `Bridging ${fromAmount} ${fromToken.symbol} from ${fromChainName} to ${toAmount} ${toToken.symbol} on Sonic chain`
        );
    };
    
    const idMap = {
        "eth": 1,
        "base": 137,
        "polygon": 8453,
        "arb": 42161,
    }
    useEffect(() => {
        let valid = true;

        const changeToAmount = async () => {
            if (!valid) return;
            setIsFetchingBridge(true);
            const tokenAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
            const quote = await createTx(idMap[fromChain], fromToken["address"], tokenAmount, 100000014, toToken.address);

            const outputAmount = ethers.formatUnits(quote?.estimation?.dstChainTokenOut.amount, toToken.decimals);
            
            if (!valid) return;
            setToAmount(parseFloat(outputAmount).toFixed(4));
            setIsFetchingBridge(false);
        }
        
        if (fromAmount && fromToken && toToken && fromChain) {
            changeToAmount();
        }

        if (!fromAmount) {
            setToAmount('');
        }

        return () => {
            valid = false;
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
                    <div className="text-right text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                        Balance: {fromToken.balance}
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
                <div className="text-right text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                    Balance: {toToken.balance}
                </div>
                </div>
            </div>

            <button
                onClick={handleBridge}
                className="mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 hover:bg-[var(--highlight)] focus:outline-none"
                style={{ backgroundColor: "var(--focus)", color: "var(--primary)" }}
            >
                Bridge
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
