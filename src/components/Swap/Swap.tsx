// src/Swap.tsx
import React, { useEffect, useState } from 'react';
import TokenModal from './TokenModal';
import { Token } from './types';
import { IoSwapVertical } from "react-icons/io5";
import TokenList from './TokenList';
import { getQuote } from '../../api/Odos';
import { ethers } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';



// Convert the TokenList object into an array of tokens
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

const Swap: React.FC = () => {
    const [fromToken, setFromToken] = useState<Token>(tokens[0]);
    const [toToken, setToToken] = useState<Token>(tokens[1]);
    const [fromAmount, setFromAmount] = useState<string>('');
    const [toAmount, setToAmount] = useState<string>('');
    const [activeModal, setActiveModal] = useState<'from' | 'to' | null>(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);
    const { authenticated, login } = usePrivy();

    // Swap the token selections (and corresponding amounts)
    const swapTokens = () => {
        setFromToken(toToken);
        setToToken(fromToken);
        // setFromAmount(toAmount);
        // setToAmount(fromAmount);
    };

    useEffect(() => {
        let valid = true;
    
        const fetchQuote = async () => {
            setIsFetchingPrice(true);
            const inputAmount = ethers.parseUnits(fromAmount, fromToken.decimals);
            const response = await getQuote({
                inputToken: fromToken.address,
                outputToken: toToken.address,
                inputAmount: inputAmount.toString(),
            });
            if (!valid) return;
            const outputAmount = ethers.formatUnits(response?.outAmounts[0], toToken.decimals);
            setToAmount(parseFloat(outputAmount).toFixed(4));
            setIsFetchingPrice(false);
        };
    
        if (fromAmount && fromToken && toToken) {
            fetchQuote();
        }

        if (!fromAmount) {
            setToAmount('');
        }
    
        return () => {
          valid = false;
        };
    }, [fromToken, toToken, fromAmount]);
    // Simulate a swap action (replace with your real logic)
    const handleSwap = () => {
        alert(`Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div
            className="w-full max-w-md p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: 'var(--secondary)' }}
            >
            <h2 className="text-center text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                Token Swap
            </h2>
            <div className="space-y-4">
                {/* From Section */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--higherlight)' }}>From</span>
                    <button
                    onClick={() => setActiveModal('from')}
                    className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                    >
                    {fromToken.icon && (
                        <img src={fromToken.icon} alt={fromToken.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                        {fromToken.symbol}
                    </span>
                    <svg
                        className="w-4 h-4 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--primary)' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                </div>
                <input
                    type="number"
                    placeholder="0.0"
                    className="w-full bg-transparent text-2xl font-bold outline-none"
                    style={{ color: 'var(--primary)' }}
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                />
                <div className="text-right text-xs mt-1" style={{ color: 'var(--less-highlight)' }}>
                    Balance: {fromToken.balance}
                </div>
                </div>

                {/* Swap Arrow/Button */}
                <div className="flex justify-center">
                    <button
                        onClick={swapTokens}
                        className="p-2 rounded-full shadow-lg transition duration-300 hover:bg-(--focus) bg-(--accent) focus:outline-none hover:cursor-pointer"
                    >
                        <IoSwapVertical size={24}/>
                    </button>
                </div>

                {/* To Section */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--higherlight)' }}>To</span>
                    <button
                    onClick={() => setActiveModal('to')}
                    className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                    >
                    {toToken.icon && (
                        <img src={toToken.icon} alt={toToken.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                        {toToken.symbol}
                    </span>
                    <svg
                        className="w-4 h-4 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--primary)' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    </button>
                </div>
                <input
                    type="number"
                    placeholder="0.0"
                    className={`hover:cursor-not-allowed w-full bg-transparent text-2xl font-bold outline-none transition duration-200 ${isFetchingPrice ? 'text-(--disabled)' : 'text-(--primary)'}`}
                    value={toAmount}
                    disabled={true}
                />
                <div className="text-right text-xs mt-1" style={{ color: 'var(--less-highlight)' }}>
                    Balance: {toToken.balance}
                </div>
                </div>
            </div>

            <button
                onClick={authenticated ? handleSwap : login}
                className="mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer"
            >
                {authenticated ? 'Swap' : 
                <span className="flex flex-row gap-2 w-full justify-center items-center">
                    <FaWallet size={16}/>
                    <span>Please Log In</span>
                </span>}
            </button>

            {/* Token Selection Modal */}
            {activeModal && (
                <TokenModal
                tokens={tokens}
                onSelect={(token) => {
                    if (activeModal === 'from') {
                    setFromToken(token);
                    } else {
                    setToToken(token);
                    }
                    setActiveModal(null);
                }}
                onClose={() => setActiveModal(null)}
                title="Select a token"
                />
            )}
            </div>
        </div>
    );
};

export default Swap;
