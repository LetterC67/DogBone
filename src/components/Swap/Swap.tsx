// src/Swap.tsx
import React, { useEffect, useState } from 'react';
import TokenModal from './TokenModal';
import { Token } from './types';
import { IoSwapVertical } from "react-icons/io5";
import TokenList from './TokenList';
import { getQuote } from '../../api/Odos';
import { ethers, resolveProperties } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';
import { swap } from '../../tools/swap/swap'
import useFetchBalance from '../../hooks/useFetchBalance'
import Spinner from '../../components/Common/Spinner';
import { useControl } from '../../context/ControlContext';
import MiniChat from '../Chat/MiniChat';
import { useAgent } from '../../context/AgentContext';
import Navigator from '../Navigator';
import { toast } from 'react-toastify';
import { useData } from '../../context/DataContext';
import { useTranslation } from 'react-i18next';

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
    // const [fromToken, setFromToken] = useState<Token>(tokens[0]);
    // const [toToken, setToToken] = useState<Token>(tokens[1]);
    // const [fromAmount, setFromAmount] = useState<string>('');
    // const [toAmount, setToAmount] = useState<string>('');

    const {
        fromTokenSwap,
        setFromTokenSwap,
        toTokenSwap,
        setToTokenSwap,
        fromAmountSwap,
        setFromAmountSwap,
        toAmountSwap,
        setToAmountSwap
    } = useControl();
    const [activeModal, setActiveModal] = useState<'from' | 'to' | null>(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState<boolean>(false);
    const { authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const [isSwapping, setIsSwapping] = useState<boolean>(false);
    const [fromUsdValue, setFromUsdValue] = useState<number>(0);
    const [toUsdValue, setToUsdValue] = useState<number>(0);

    const { userBalance: fromBalance } = useFetchBalance(fromTokenSwap);
    const { userBalance: toBalance } = useFetchBalance(toTokenSwap);

    const { refetchBalance } = useData();
    const { t } = useTranslation();

    const {
        messages,
        reject,
        currentAction,
        code,
        resolve
    } = useAgent();

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
                if (!valid) return;
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
        }

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
        if (currentAction && currentAction != 'swap') return;
        
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
            toast.success(t('swap_success'),
                {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                }
            );

            refetchBalance(fromTokenSwap);
            refetchBalance(toTokenSwap);
        } catch (error) {
            console.error('Error swapping tokens:', error.message);
            if (reject) {
                reject();
            }
            toast.error(t('swap_failed'),
                {
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                }
            );
            setIsSwapping(false);
        }
        // resolve();
    };
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Navigator></Navigator>
            <div
            className="w-full max-w-md p-6 rounded-xl shadow-lg"
            style={{ backgroundColor: 'var(--secondary)' }}
            >
            <h2 className="text-center text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                {t('token_swap')}
            </h2>
            <div className="space-y-4">
                {/* From Section */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                <div className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: 'var(--higherlight)' }}>{t('from')}</span>
                    <button
                    onClick={() => setActiveModal('from')}
                    className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                    >
                    {fromTokenSwap?.icon && (
                        <img src={fromTokenSwap?.icon} alt={fromTokenSwap?.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                        {fromTokenSwap?.symbol}
                        {fromTokenSwap == null && t('select_a_token')}
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
                    value={fromAmountSwap}
                    onChange={(e) => setFromAmountSwap(e.target.value)}
                />
                    <div className="w-full flex flex-row justify-between items-center content-center">
                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            ~${fromUsdValue.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            {t('balance')}: {fromBalance != null ? parseFloat(fromBalance).toFixed(6) : '-'}
                        </div>
                    </div>                </div>

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
                    <span className="text-sm" style={{ color: 'var(--higherlight)' }}>{t('to')}</span>
                    <button
                    onClick={() => setActiveModal('to')}
                    className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                    >
                    {toTokenSwap?.icon && (
                        <img src={toTokenSwap?.icon} alt={toTokenSwap?.symbol} className="w-6 h-6" />
                    )}
                    <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                        {toTokenSwap?.symbol}
                        {toTokenSwap == null && t('select_a_token')}
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
                    value={toAmountSwap}
                    disabled={true}
                />
                    <div className="w-full flex flex-row justify-between items-center content-center">
                        <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                            ~${toUsdValue.toFixed(2)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                            {t('balance')}: {toBalance != null ? parseFloat(toBalance).toFixed(6) : '-'}
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={authenticated ? handleSwap : login}
                className={`mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                ${isSwapping ? 'disabled:opacity-50' : 'opacity-100'}
                `}
            >
                {authenticated ? isSwapping ? <Spinner/> : t('swap') :  
                <span className="flex flex-row gap-2 w-full justify-center items-center">
                    <FaWallet size={16}/>
                    <span>{t('please_login')}</span>
                </span>}
            </button>

            {/* Token Selection Modal */}
            {activeModal && (
                <TokenModal
                tokens={tokens}
                onSelect={(token) => {
                    if (activeModal === 'from') {
                    setFromTokenSwap(token);
                    } else {
                    setToTokenSwap(token);
                    }
                    setActiveModal(null);
                }}
                onClose={() => setActiveModal(null)}
                title={t('select_a_token')}
                />
            )}
            </div>
        </div>
    );
};

export default Swap;
