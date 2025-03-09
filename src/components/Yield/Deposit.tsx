import { useControl } from "../../context/ControlContext";
import TokenModal from "./TokenModal";
import { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import StrategyNavbar from "./StrategyNavbar";
import { depositVault, zap, bridgeAndZap, withdrawVault } from "../../tools/ToolAPI";
import {ethers} from "ethers";
import { FaArrowLeft, FaWallet } from "react-icons/fa";
import Spinner from '../../components/Common/Spinner';
import { useData } from "../../context/DataContext";
import { useAgent } from "../../context/AgentContext";
import useFetchBalance  from "../../hooks/useFetchBalance";
import { toast } from "react-toastify";
import { getTokenPriceBySymbol } from "../../tools/utils/getTokenPrice";

function Deposit() {
    const { authenticated, login } = usePrivy();

 

    const [activeModal, setActiveModal] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [valueUSD, setValueUSD] = useState<number>(0);
    const { wallets } = useWallets();
    const { tokenPriceSonic, getTokenListByChainId, depositedSonic, refetchPosition, refetchBalance} = useData();
    const [tokens, setTokens] = useState<any[]>([]);

    
    const {strategyTab,
        setStrategyTab,
        strategyAmount,
        setStrategyAmount,
        strategyToken,
        setStrategyToken,
        strategy,
        setStrategy,
        setIsInStrategyTab,
        strategyChain,
        setStrategyChain
    } = useControl();
    
    const { userBalance } = useFetchBalance(strategyToken, strategyChain == 146 ? "sonic" : strategyChain == 137 ? "polygon" : strategyChain == 8453 ? "base" : strategyChain == 42161 ? "arb" : "eth");
    useEffect(() => {
        if (!activeModal && strategyToken.chainId != strategyChain) {
            setStrategyChain(strategyToken.chainId);
        }
    }, [strategyToken, strategyChain, activeModal]);

    const {
        currentAction,
        reject,
        resolve
    } = useAgent();

    useEffect(() => {
        if (strategyChain) {
            setTokens(getTokenListByChainId(strategyChain));
        }
    }, [strategyChain]);

    useEffect(() => {
        let valid = true;

        if (strategyToken && strategyAmount) {
            getTokenPriceBySymbol(strategyToken.symbol).then((price) => {
                if (!valid) return;
                setValueUSD(parseFloat(price) * parseFloat(strategyAmount));
            });
        } else {
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
        // console.log(strategyTab, currentAction, strategyTab == currentAction);
        if (currentAction && currentAction != strategyTab) return;

        
        setIsRunning(true);
        
        if (strategyTab == "Deposit") {
            if (strategy.provider.name == "Bone1" || strategy.provider.name == "Bone2") {
                if (strategy.token.symbol != strategyToken.symbol || strategyChain != 146) {
                    toast.error("DogBone strategies currently support depositing strategy underlying token only!",
                        {
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            draggable: true,
                            progress: undefined,
                        }
                    );
                    setIsRunning(false);
                    return;
                }
            }
            try {
                // await deposit();
                // console.log(strategyToken);
                if (strategyToken.chainId == 146) {
                    if (strategyToken.address.toLowerCase() != strategy.token.address.toLowerCase()) {
                        await zap(wallets[0], strategyToken.address, strategyAmount , strategy.name);
                    } else {
                        await depositVault(wallets[0], strategy.name, strategyAmount);
                    }
                } else {
                    // console.log(strategyToken.chainId);
                    // console.log(strategyToken.address);
                    // console.log(strategy.name);
                    await bridgeAndZap(wallets[0], strategyToken.chainId, strategyToken.address, strategyAmount, strategy.name);
                }

                if (resolve) {
                    resolve();
                }
                toast.success(`Deposited ${strategyAmount} ${strategy.token.symbol} successfully`,
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                refetchPosition(strategy);
                if (strategyToken.chainId == 146) {
                    refetchBalance(strategyToken);
                }
            } catch(error) {
                console.error(error);
                if (reject) {
                    reject();
                }
                toast.error("Failed to deposit",
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                setIsRunning(false);
            }
            setIsRunning(false);
        } else if (strategyTab == "Withdraw") {
            try {
                await withdrawVault(wallets[0], strategy.name, strategyAmount);

                if (resolve) {
                    resolve();
                }
                toast.success(`Withdrawn ${strategyAmount} ${strategy.token.symbol} successfully`,
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                refetchPosition(strategy);
                refetchBalance(strategy.token);
            } catch(error) {
                console.error(error);
                if (reject) {
                    reject();
                }
                toast.error("Withdrawal for this strategy is coming soon!",
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                setIsRunning(false);
            }
            setIsRunning(false);
        }
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
                            <span className="text-sm" style={{ color: 'var(--higherlight)' }}>{strategyTab} ({strategyChain == 1 ? "Ethereum" : strategyChain == 146 ? "Sonic" : strategyChain == 137 ? "Polygon" : strategyChain == 8453 ? "Base" : "Arbitrum"})</span>
                            {strategyTab == "Deposit" &&
                            <button
                            onClick={() => setActiveModal(true)}
                            className="flex items-center space-x-2 transition-colors duration-200 hover:bg-[var(--accent-2)] focus:outline-none p-1 rounded-lg"
                            >
                                {strategyToken?.logoURI && (
                                    <img src={strategyToken.logoURI} alt={strategyToken.symbol} className="rounded-full w-6 h-6" />
                                )}
                                <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                                    {strategyToken?.symbol}
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
                            }

                            {strategyTab == "Withdraw" &&
                            <div className="flex items-center space-x-2 focus:outline-none p-1 rounded-lg">
                                {strategy.token.logoURI && (
                                    <img src={strategy.token.logoURI} alt={strategy.token.symbol} className="rounded-full w-6 h-6" />
                                )}
                                <span className="text-lg font-medium" style={{ color: 'var(--primary)' }}>
                                    {strategy.token?.symbol}
                                </span>
                            </div>
                            }
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
                                {strategyTab == 'Deposit' && 
                                <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                                    Balance: {userBalance ? parseFloat(userBalance).toFixed(4) : '-'}
                                </div>
                                }

                                {strategyTab == 'Withdraw' &&
                                <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                                    Deposited: {depositedSonic[strategy.name] ? parseFloat(depositedSonic[strategy.name]).toFixed(4) : '-'}
                                </div>
                                }
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
                                {strategy.apr.toFixed(2)}% + {strategy.point_apr.toFixed(2)}%
                            </div>
                        </div>

                        <div className="flex flex-row justify-between">
                            <div className="font-bold">
                                Deposited
                            </div>
                            <div className="text-(--higherlight)">
                                {depositedSonic[strategy.name] ? parseFloat(depositedSonic[strategy.name]).toFixed(4) : '-'}
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={authenticated ? execute : login}
                        className={`mt-6 w-full py-3 rounded-lg font-bold transition-colors duration-200 bg-(--accent-2) hover:bg-(--focus) focus:outline-none hover:cursor-pointer 
                        ${isRunning ? 'disabled:opacity-50' : 'opacity-100'}
                        `}
                        disabled={(isRunning || !strategyAmount) && authenticated}
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
                        strategyChain={strategyChain}
                        setStrategyChain={setStrategyChain}
                        onClose={() => setActiveModal(null)}
                        title="Select a token"
                        />
                    )}
                </div>
            </div>
                {(strategyToken.chainId != 146 && strategyTab == "Deposit") && <div className="mt-6 text-[var(--less-highlight)] text-lg flex flex-row gap-2 items-center hover:cursor-pointer" onClick={() => window.open('https://debridge.finance')}>
                    Powered by <span className='bg-[var(--accent-2)] rounded-lg py-2 px-2 text-white flex flex-row gap-1 font-semibold'> 
                        <img src="/deBridge.png" className='h-6'></img>
                            deBridge
                        </span>
                </div>
                }
        </div>
        </>
    )
}

export default Deposit;