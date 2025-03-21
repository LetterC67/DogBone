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
import { useTranslation } from "react-i18next";
import { getBone1LeverageAPY } from "../../tools/dogbone/dogbone_silo_st_s_st_looping/getBone1APY";
import { getBone2LeverageAPY } from "../../tools/dogbone/dogbone_silo_wos_s_wos_looping/getBone2APY";
import { getBone3LeverageAPY } from "../../tools/dogbone/dogbone_silo_ptwstkscUSD_fraxUSD_looping/getBone3APY";
import { getBone4LeverageAPY } from "../../tools/dogbone/dogbone4/getBone4APY";
import tokenList from "../../tools/tokenList.json";
function Deposit() {
    const { authenticated, login } = usePrivy();
    const { t } = useTranslation();
 

    const [activeModal, setActiveModal] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [valueUSD, setValueUSD] = useState<number>(0);
    const { wallets } = useWallets();
    const { tokenPriceSonic, getTokenListByChainId, depositedSonic, refetchPosition, refetchBalance} = useData();
    const [tokens, setTokens] = useState<any[]>([]);
    const [strategyAPR, setStrategyAPR] = useState<number>(0);
    const [pointsAPR, setPointsAPR] = useState<number>(0);
    
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
        setStrategyChain,
        leverage,
        setLeverage
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
    
    useEffect(() => {
        if (strategy.defaultLeverage > 0) {
            setLeverage(strategy.defaultLeverage);
        }
        setStrategyAPR(strategy.apr);
        setPointsAPR(strategy.point_apr);
        if (strategy.provider.name.startsWith("Bone")) {
            setStrategyToken(tokenList.tokens.find((token) => token.symbol == strategy.token.symbol && token.chainId == 146));
            setStrategyChain(146);
        }
    }, [strategy]);

    useEffect(() => {
        if (strategy.provider.name.startsWith("Bone")) {
            if (strategy.provider.name == "Bone1") {
                getBone1LeverageAPY({depositAPR: strategy.depositAPR, borrowAPR: strategy.borrowAPR, leverage: leverage}).then((apy) => {
                    setStrategyAPR(apy);
                });
                setPointsAPR(strategy.point_apr / strategy.maxLeverage * leverage);
            } else if (strategy.provider.name == "Bone2") {
                getBone2LeverageAPY({depositAPR: strategy.depositAPR, borrowAPR: strategy.borrowAPR, leverage: leverage}).then((apy) => {
                    setStrategyAPR(apy);
                });
                setPointsAPR(strategy.point_apr / strategy.maxLeverage * leverage);
            } else if (strategy.provider.name == "Bone3") {
                getBone3LeverageAPY({depositAPR: strategy.depositAPR, borrowAPR: strategy.borrowAPR, leverage: leverage}).then((apy) => {
                    setStrategyAPR(apy);
                });
                setPointsAPR(strategy.point_apr / strategy.maxLeverage * leverage);
            } else if (strategy.provider.name == "Bone4") {
                getBone4LeverageAPY({depositAPR: strategy.depositAPR, borrowAPR: strategy.borrowAPR, leverage: leverage}).then((apy) => {
                    setStrategyAPR(apy);
                });
                setPointsAPR(strategy.point_apr / strategy.maxLeverage * leverage);
            }
        }
    }, [leverage]);

    // useEffect(() => {
    //     console.log(tokens);
    //     if(tokens)
    //     setStrategyToken(tokens[0]);
    // }, [tokens]);


    async function execute() {
        // console.log(strategyTab, currentAction, strategyTab == currentAction);
        if (currentAction && currentAction != strategyTab) return;

        
        setIsRunning(true);
        console.log(wallets[0]);
        console.log(wallets[0].address);
        
        if (strategyTab == "Deposit") {
            if (strategy.provider.name.startsWith("Bone")) {
                if (strategy.token.symbol != strategyToken.symbol || strategyChain != 146) {
                    toast.error(t("dogbone_strategies"),
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
                        await depositVault(wallets[0], strategy.name, strategyAmount, leverage);
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
                toast.success(`${t('deposited')} ${strategyAmount} ${strategyToken.symbol} ${t('successfully')}`,
                    {
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                    }
                );
                refetchPosition(strategy);
                console.log(strategyToken);
                if (strategyToken.chainId == 146) {
                    refetchBalance(strategyToken);
                }
            } catch(error) {
                console.error(error);
                if (reject) {
                    reject();
                }
                toast.error(t("failed_to_deposit"),
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
                toast.success(`${t('withdrawn')} ${strategyAmount} ${strategy.token.symbol} ${t('successfully')}`,
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
                toast.error(t("withdrawal_coming_soon"),
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
                                <span className="text-sm" style={{ color: 'var(--higherlight)' }}>{t(strategyTab.toLowerCase())} ({strategyChain == 1 ? "Ethereum" : strategyChain == 146 ? "Sonic" : strategyChain == 137 ? "Polygon" : strategyChain == 8453 ? "Base" : "Arbitrum"})</span>
                                {(strategyTab == "Deposit" && !strategy.provider.name.startsWith("Bone"))&&
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

                                {(strategyTab == "Withdraw" ||strategy.provider.name.startsWith("Bone")) &&
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
                                        {t('balance')}: {userBalance ? parseFloat(userBalance).toFixed(4) : '-'}
                                    </div>
                                    }

                                    {strategyTab == 'Withdraw' &&
                                    <div className="text-xs mt-1" style={{ color: "var(--less-highlight)" }}>
                                        {t('Deposited')}: {depositedSonic[strategy.name] ? parseFloat(depositedSonic[strategy.name]).toFixed(4) : '-'}
                                    </div>
                                    }
                                </div>           
                            </div>

                            {/* Leverage Slider */}
                            {(strategy.defaultLeverage > 0&& strategyTab != "Withdraw") && <div className="mt-6">
                                <label
                                    htmlFor="leverage"
                                    className="block text-md font-medium"
                                    style={{ color: 'var(--primary)' }}
                                >
                                    {t('leverage')}: ✕<span id="leverage-value text-lg!">{leverage}</span>
                                </label>
                                {/* The container holds our custom track and the range input */}
                                <div className="relative w-full h-2 rounded-lg mt-2" style={{ backgroundColor: 'var(--accent)' }}>
                                    {/* Fill: left side color */}
                                    <div
                                    className="absolute top-0 left-0 h-full rounded-lg"
                                    style={{
                                        backgroundColor: 'var(--highlight)',
                                        width: `${((leverage - 1) / (strategy.maxLeverage - 1)) * 100}%`,
                                    }}
                                    />
                                    <input
                                    type="range"
                                    id="leverage"
                                    name="leverage"
                                    min="1"
                                    max={strategy.maxLeverage}
                                    value={leverage}
                                    onChange={(e) => setLeverage(e.target.value)}
                                    className="absolute top-0 left-0 w-full h-2 appearance-none cursor-pointer"
                                    style={{ backgroundColor: 'transparent', outline: 'none' }}
                                    />
                                </div>
                                {/* Custom CSS for the slider thumb */}
                                <style jsx>{`
                                    input[type='range']::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    width: 20px;
                                    height: 20px;
                                    background: #D2ADB8;
                                    border: 2px solid var(--divider);
                                    border-radius: 50%;
                                    cursor: pointer;
                                    margin-top: -9px; /* Adjust to center the thumb on the track */
                                    }
                                    input[type='range']::-moz-range-thumb {
                                    width: 20px;
                                    height: 20px;
                                    background: #D2ADB8;
                                    border: 2px solid #000;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    }
                                `}</style>
                            </div>
                            }

                        <div className="flex flex-col gap-2 mt-6 p-1">
                            <div className="flex flex-row justify-between">
                                <div className="font-bold">
                                    {t('provider')}
                                </div>
                                <div className="text-(--higherlight)">
                                    {strategy.provider.full_name}
                                </div>
                            </div>

                            <div className="flex flex-row justify-between">
                                <div className="font-bold">
                                    {t('underlying_token')}
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
                                    {strategyAPR.toFixed(2)}% + {pointsAPR.toFixed(2)}%
                                </div>
                            </div>

                            <div className="flex flex-row justify-between">
                                <div className="font-bold">
                                    {t('deposited')}
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
                            {authenticated ? isRunning ? <Spinner/> : <>{t(strategyTab.toLowerCase())}</> : 
                            <span className="flex flex-row gap-2 w-full justify-center items-center">
                                <FaWallet size={16}/>
                                <span>{t('please_login')}</span>
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
                            title={t('select_a_token')}
                            />
                        )}
                    </div>
                </div>

            </div>
                {(strategyToken.chainId != 146 && strategyTab == "Deposit") && <div className="mt-6 text-[var(--less-highlight)] text-lg flex flex-row gap-2 items-center hover:cursor-pointer" onClick={() => window.open('https://debridge.finance')}>
                    {t('powered_by')} <span className='bg-[var(--accent-2)] rounded-lg py-2 px-2 text-white flex flex-row gap-1 font-semibold'> 
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