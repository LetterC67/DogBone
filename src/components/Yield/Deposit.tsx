import { useControl } from "../../context/ControlContext";
import TokenModal from "./TokenModal";
import TokenList from "./TokenList";
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import StrategyNavbar from "./StrategyNavbar";
import { depositVault, zap } from "../../tools/ToolAPI";
import {ethers} from "ethers";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import Spinner from '../../components/Common/Spinner';
import { useData } from "../../context/DataContext";
import { getUserBalance } from "../../api/common";
import useFetchBalance  from "../../hooks/useFetchBalance";


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

function Deposit() {
    const { authenticated, login } = usePrivy();

    const {strategyTab,
        setStrategyTab,
        strategyAmount,
        setStrategyAmount,
        strategyToken,
        setStrategyToken,
        strategy,
        setStrategy,
        setIsInStrategyTab
    } = useControl();

    const [activeModal, setActiveModal] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [valueUSD, setValueUSD] = useState<number>(0);
    const { wallets } = useWallets();
    const { tokenPriceSonic } = useData();

    const { userBalance } = useFetchBalance(strategyToken);

    async function execute() {
        console.log(strategyAmount);
        console.log(strategyToken);
        setIsRunning(true);
        try {
            // await deposit();
            if (strategyToken.address.toLowerCase() != strategy.token.address.toLowerCase()) {
                await zap(wallets[0], strategyToken.address, strategyAmount , strategy.name);
            } else {
                await depositVault(wallets[0], strategy.name, strategyAmount);
            }
        } catch(error) {
            console.error(error);
            setIsRunning(false);
        }
        setIsRunning(false);
    }

    return (
        <>
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md pl-16">
                <StrategyNavbar />  
            </div>
            <div className="flex flex-row">
                <div className="mt-4">
                    <div className={`p-2 bg-(--accent) text-(--disabled) rounded-tl-lg rounded-bl-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1 text-lg pb-2`} onClick={() => setIsInStrategyTab(false)}>
                        <div>
                            <FaArrowLeft />
                        </div>
                    </div>
                </div>
                <div
                className="w-full max-w-md p-6 rounded-xl shadow-lg"
                style={{ backgroundColor: 'var(--secondary)' }}
                >
                    <h2 className="text-center text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {strategy.name}
                    </h2>
                    <div className="space-y-4">
                        {/* From Section */}
                        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: 'var(--higherlight)' }}>From</span>
                            <button
                            onClick={() => setActiveModal(true)}
                            className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                            >
                            {strategyToken.icon && (
                                <img src={strategyToken.icon} alt={strategyToken.symbol} className="w-6 h-6" />
                            )}
                            <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                                {strategyToken.symbol}
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
                            value={strategyAmount}
                            onChange={(e) => setStrategyAmount(e.target.value)}
                        />
                            <div className="w-full flex flex-row justify-between items-center content-center">
                                <div className="text-xs mt-2" style={{ color: "var(--less-highlight)" }}>
                                    ~${valueUSD.toFixed(2)}
                                </div>
                                <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                                    Balance: {parseFloat(userBalance).toFixed(4)}
                                </div>
                            </div>           
                        </div>

                    </div>

                    <div className="flex flex-col gap-2 mt-6 p-1">
                        <div className="flex flex-row justify-between">
                            <div className="font-bold">
                                Provider
                            </div>
                            <div className="text-(--higherlight)">
                                {strategy.provider.full_name}
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="font-bold">
                                Underlying token
                            </div>
                            <div className="text-(--higherlight)">
                                {strategy.token.symbol}
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="font-bold">
                                APR
                            </div>
                            <div className="text-(--higherlight)">
                                {strategy.apr.toFixed(2)}%
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="font-bold">
                                Deposited
                            </div>
                            <div className="text-(--higherlight)">
                                {parseFloat(strategy.position).toFixed(4)}
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={authenticated ? execute : login}
                        className={`mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                        ${isRunning ? 'disabled:opacity-50' : 'opacity-100'}
                        `}
                        disabled={isRunning || !strategyAmount}
                    >
                        {authenticated ? isRunning ? <Spinner/> : <>{strategyTab}</> : 
                        <span className="flex flex-row gap-2 w-full justify-center items-center">
                            <FaWallet size={16}/>
                            <span>Please Log In</span>
                        </span>}
                    </button>
                    
                    {activeModal && (
                        <TokenModal
                        tokens={tokens}
                        onSelect={(token) => {
                            setStrategyToken(token);
                            setActiveModal(null);
                        }}
                        onClose={() => setActiveModal(null)}
                        title="Select a token"
                        />
                    )}
                </div>
            </div>
        </div>
        </>
    )
}

export default Deposit;