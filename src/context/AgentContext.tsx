import { createContext, useContext, useState, useEffect} from "react";
import { getReply, createAutomatedTask, saveAutomatedTask } from "../api/agent";
import { useControl } from "./ControlContext";
import { getTokenAddressBySymbol } from "../tools/utils/getTokenAddressBySymbol";
import TokenList from "../tools/tokenList.json"
import { toast } from "react-toastify";
import { useData } from "./DataContext";
import { getTokenBalance } from "../tools/utils/getTokenBalance";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { useTranslation } from "react-i18next";
import usePortfolio from "../hooks/usePortfolio";

const tokenList = JSON.parse(JSON.stringify(TokenList))


const AgentContext = createContext({
    messages: [],
    userMessage: [],
    agentMessage: [],
    sendMessage: (message: string) => {},
    isAnswering: false,
    reject: () => {},
    resolve: () => () => {},
    currentAction: '',
    code: '',
    currentNavigation: '',
    sendAutomationMessage: (message: string) => {},
    setCurrentNavigation: (t: any) => {},
    __DEPOSIT__: (inputToken: string, inputChain: number, amount: number, strategyName: string, message: string) => {},
    __WITHDRAW__: (strategyName: string, amount: number, message: string) => {},
    __SWAP__: (inputToken: string, outputToken: string, amount: number, message: string) => {},
    __BRIDGE__: (inputToken: string, inputChain: number, outputToken: string, amount: number, message: string) => {},
    __CANCEL__: () => {},
    __MESSAGE__: (message: string) => {},
    __SET_STRATEGIES__: (strategies: any) => {},
    __GET_ADDRESS__: () => {},
    __GET_BALANCE__: (token: string, chainId: number) => {},
    tokenBalance: {},
    tokenPrice: {},
    depositedAmount: {},
    totalBalance: 0
});

async function getTokenByAddress(address: string, chainId: number) {
    const token = tokenList.tokens.find((token: any) => token.address === address && token.chainId === chainId);

    if (token) {
        return token;
    }

    return null;
}

async function getTokenBySymbol(symbol: string, chainId: number) {
    const address = await getTokenAddressBySymbol(symbol, chainId);
    if (!address) return null;

    const token = getTokenByAddress(address, chainId);
    if (token) {
        return token;
    }
    return null;
}

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [userMessages, setUserMessages] = useState<string[]>([]);
    const [agentMessages, setAgentMessages] = useState<string[]>([]);
    const [code, setCode] = useState<string>('');
    const [currentAction, setCurrentAction] = useState<any>(null);
    const [resolve, setResolve] = useState<any>(null);
    const [reject, setReject] = useState<any>(null);
    const [currentNavigation, setCurrentNavigation] = useState<string>('');
    const [isAnswering, setIsAnswering] = useState<boolean>(false);
    const {
        setFromTokenSwap,
        setToTokenSwap,
        setFromAmountSwap,
        setFromAmountBridge,
        setFromTokenBridge,
        setToTokenBridge,
        setFromChainBridge,
        setIsInStrategyTab,
        setStrategyAmount,
        setStrategyToken,
        setStrategy,
        setFilteredStrategies,
        setShowOnlyDeposited,
        setAgentFilteredStrategies,
        setStrategyChain,
        setStrategyTab
    } = useControl();
    const {t } = useTranslation();

    const { authenticated } = usePrivy();

    const { portfolio, totalBalance, tokenPriceSonic: tokenPrice, tokenBalanceSonic: tokenBalance, depositedSonic: depositedAmount } = usePortfolio();

    const {
        strategyList,
        threadID,
        fetchAutomatedTasks
    } = useData();

    const { wallets } = useWallets();

    function isActionCode(code: string) {
        const actionMethod = ['__SWAP__', '__DEPOSIT__', '__BRIDGE__', '__WITHDRAW__'];

        for (const action of actionMethod) {
            if (code.includes(action)) {
                return true;
            }
        }

        return false;
    }

    function containsFunction(code: string) {
        const actionMethod = ['__SWAP__', '__DEPOSIT__', '__BRIDGE__', '__WITHDRAW__', '__GET_ADDRESS__', '__GET_BALANCE__'];

        for (const action of actionMethod) {
            if (code.includes(action)) {
                return true;
            }
        }

        return false;
    }

    async function __CANCEL__() {
        if (reject) {
            reject();
        }
    }

    async function __SET_STRATEGIES__(strategies: any) {
        setAgentFilteredStrategies(strategies);
        // console.log(strategies);
        setCurrentNavigation('yield');
        setIsInStrategyTab(false);
        setShowOnlyDeposited(false);
    }

    async function __GET_ADDRESS__() {
        return wallets[0].address;
    }

    async function __GET_BALANCE__(token: string, chainId: number) {
        console.log(`Getting balance of ${token} on chain ${chainId}`);
        let inp = null;

        if (token != null) {
            inp = await getTokenBySymbol(token, chainId);
            if (!inp) {
                __MESSAGE__(`${t('cannot_find_token')} ${token}`);
                throw new Error(`Cannot find token ${token}`);
            }
        }

        return await getTokenBalance(chainId, inp.address, wallets[0].address);
    }

    async function __MESSAGE__(message: string) { 
        if (isAnswering) return;
        setMessages(
            (prev: any) => [...prev, {
                message: message,
                isUser: false
            }]
        )
        setAgentMessages((prev: any) => [...prev, message]);
    }

    async function __SWAP__(inputToken, outputToken, amount, message) {
        console.log(`Swapping ${amount} ${inputToken} to ${outputToken}`);

        let inp = null;
        let out = null;
        
        
        if (inputToken != null) {
            inp = await getTokenBySymbol(inputToken, 146);
            if (!inp) {
                __MESSAGE__(`${t('cannot_find_token')} ${inputToken}`);
                throw new Error(`Cannot find token ${inputToken}`);
            }
            
            out = await getTokenBySymbol(outputToken, 146);
            if (!out) {
                __MESSAGE__(`${t('cannot_find_token')} ${outputToken}`);
                throw new Error(`Cannot find token ${outputToken}`);
            }
        }
        
        inp.icon = inp.logoURI;
        out.icon = out.logoURI;
        
        setFromAmountSwap(amount.toString());
        setFromTokenSwap(inp);
        setToTokenSwap(out);
        // setToAmountSwap('');
        
        setCurrentAction('swap');
        setCurrentNavigation('swap');
        await __MESSAGE__ (message);

        const toastId = toast.loading(`${t('waiting_user_to_swap')}...`, {
            closeOnClick: false, // Prevent closing on click
            draggable: false, // Disable drag to dismiss
        });
        
        return new Promise((resolve, reject) => {
            setResolve(() => 
                async (amount) => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(`${t('swap_success')}`)
                    await new Promise(r => setTimeout(r, 2000));
                    resolve(amount);
                    setReject(null);
                    setResolve(null);
                    setCurrentAction(null);
                }
            );
            setReject(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('swap_failed'));
                    await new Promise(r => setTimeout(r, 2000));
                    reject(t('swap_failed'));
                    setReject(null);
                    setResolve(null);
                    setCurrentAction(null);
                });
        });
    }

    async function __BRIDGE__(inputToken, inputChain, outputToken, amount, message) {
        console.log(`${t('bridging')} ${amount} ${inputToken} ${t('to_low')} ${outputToken}`);

        let inp = null;
        let out = null;
        
        if (inputToken != null) {
            inp = await getTokenBySymbol(inputToken, inputChain);
            if (!inp) {
                __MESSAGE__(`${t('cannot_find_token')} ${inputToken}`);
                throw new Error(`Cannot find token ${inputToken}`);
            }
            
            out = await getTokenBySymbol(outputToken, 146);
            if (!out) {
                __MESSAGE__(`${t('cannot_find_token')} ${outputToken}`);
                throw new Error(`Cannot find token ${outputToken}`);
            }
        }
        
        inp.icon = inp.logoURI;
        out.icon = out.logoURI;
        
        setFromAmountBridge(amount.toString());
        setFromChainBridge(inputChain == 1 ? "eth" : inputChain == 137 ? "polygon" : inputChain == 42161 ? "arb" : "base");
        setFromTokenBridge(inp);
        setToTokenBridge(out);
        // setToAmountSwap('');
        
        setCurrentAction('bridge');
        setCurrentNavigation('bridge');
        await __MESSAGE__ (message);

        const toastId = toast.loading(`${t('waiting_user_to_bridge')}...`, {
            closeOnClick: false, // Prevent closing on click
            draggable: false, // Disable drag to dismiss
        });
        
        return new Promise((resolve, reject) => {
            setResolve(() => 
                async (amount) => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(`${t('bridge_success')}`)
                    await new Promise(r => setTimeout(r, 2000));
                    resolve(amount);
                    setResolve(null);
                    setReject(null);
                    setCurrentAction(null);
                }
            );
            setReject(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('bridge_failed'));
                    await new Promise(r => setTimeout(r, 2000));
                    reject(t('bridge_failed'));
                    setReject(null);
                    setResolve(null);
                    setCurrentAction(null);
                });
        });
    }

    async function __WITHDRAW__(strategyName, amount, message) {
        console.log(`Withdrawing ${amount} from ${strategyName}`);

        const strategy = strategyList.find((strategy) => strategy.name === strategyName);

        if (!strategy) {
            __MESSAGE__(`${t('cannot_find_strategy')} ${strategyName}`);
            throw new Error(`Cannot find strategy ${strategyName}`);
        }

        setStrategyAmount(amount.toString());
        setStrategy(strategy);
        setIsInStrategyTab(true);
        setStrategyTab("Withdraw");

        setCurrentAction('Withdraw');
        setCurrentNavigation('yield');

        await __MESSAGE__(message);

        const toastId = toast.loading(`${t('waiting_user_to_withdraw')}...`, {
            closeOnClick: false, // Prevent closing on click
            draggable: false, // Disable drag to dismiss
        });

        return new Promise((resolve, reject) => {
            setResolve(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('withdrawn_successfully'))
                    await new Promise(r => setTimeout(r, 2000));
                    resolve(amount);
                    setResolve(null);
                    setReject(null);
                    setCurrentAction(null);
                }
            );
            setReject(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('failed_to_withdraw'));
                    await new Promise(r => setTimeout(r, 2000));
                    reject(t('failed_to_withdraw'));
                    setReject(null);
                    setResolve(null);
                    setCurrentAction(null);
                });
        });
    }

    async function __DEPOSIT__(inputToken, inputChain, amount, strategyName, message) {
        console.log(`Depositing ${amount} ${inputToken} to ${strategyName}`);

        let inp = null;

        if (inputToken != null) {
            inp = await getTokenBySymbol(inputToken, inputChain);
            if (!inp) {
                __MESSAGE__(`${t('cannot_find_token')} ${inputToken}`);
                throw new Error(`Cannot find token ${inputToken}`);
            }
        }

        if (inputChain == null) inputChain = 146;
        // console.log(strategyList);

        const strategy = strategyList.find((strategy) => strategy.name === strategyName);

        if (!strategy) {
            __MESSAGE__(`${t('cannot_find_strategy')} ${strategyName}`);
            throw new Error(`Cannot find strategy ${strategyName}`);
        }

        // console.log(strategyToken);


        setStrategyTab("Deposit");
        setStrategyAmount(amount.toString());
        setStrategyToken(inp);
        setIsInStrategyTab(true);
        setStrategyChain(inputChain);

        setStrategy(strategy);

        setCurrentAction('Deposit');
        setCurrentNavigation('yield');

        await __MESSAGE__(message);

        const toastId = toast.loading(`${t('waiting_user_to_deposit')}...`, {
            closeOnClick: false, // Prevent closing on click
            draggable: false, // Disable drag to dismiss
        });

        return new Promise((resolve, reject) => {
            setResolve(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('deposit_successfully'))
                    await new Promise(r => setTimeout(r, 2000));
                    resolve(1);
                    setResolve(null);
                    setCurrentAction(null);
                    setReject(null);
                }
            );
            setReject(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__(t('failed_to_deposit'));
                    await new Promise(r => setTimeout(r, 2000));
                    reject(t('failed_to_deposit'));
                    setReject(null);
                    setResolve(null);
                    setCurrentAction(null);
                });
        });

    }


    function isValidJavaScript(code) {
        try {
          new Function(code);
          return { valid: true };
        } catch (err) {
          return { valid: false, error: err.message };
        }
      }

    async function sendMessage(message: string) {
        if (isAnswering) return;
        // console.log(message);
        setMessages((prev: any) => [...prev, {
            message,
            isUser: true
        }]);
        setUserMessages((prev: any) => [...prev, message]);
        
        setIsAnswering(true);
        let reply = '';
        try {
            reply = await getReply(message, threadID);
        } catch {
            __MESSAGE__(t('rate_limit'));
            setIsAnswering(false);
            return;
        }
        // console.log(reply);

        if (!isValidJavaScript(`
                async function run() {
                        try {
                            await (async () => {
                                ${reply}
                            })();
                        } catch(e) {
                            console.log(e);
                        }
                    }
                    run();

            `).valid) {
                console.log(isValidJavaScript(`
                    async function run() {
                            try {
                                await (async () => {
                                    ${reply}
                                })();
                            } catch(e) {
                                console.log(e);
                            }
                        }
                        run();
    
                `).error)
            __MESSAGE__(reply);
            setIsAnswering(false);
            return;
        }

        if (!authenticated && containsFunction(reply)) {
            __MESSAGE__(t("login_first"));
            setIsAnswering(false);
            return;
        }

        if (!isActionCode(reply)) {
            try {
                eval(`
                    async function run() {
                        try {
                            await (async () => {
                                ${reply}
                            })();
                        } catch(e) {
                            console.log(e);
                        }
                    }
                    run();
                    `
                );
            } catch {
                __MESSAGE__(t('error_occurred'));
            }
        } else {
            if (code != '' || reject || resolve) {
                __MESSAGE__(t('cannot_execute_multiple'));
            } else {
                setCode(reply);
            }
        }
        setIsAnswering(false);
    }

    async function sendAutomationMessage(message: string) {
        if (isAnswering) return;

        setIsAnswering(true);

        const reply = await createAutomatedTask(message);

        if (reply.error) {
            __MESSAGE__(reply.error);
            setIsAnswering(false);
            return;
        }

        if (!authenticated) {
            setIsAnswering(false);
            __MESSAGE__(t('login_first'));
            return;
        }
        try {
            await saveAutomatedTask(wallets[0].address, reply.name, reply.code, reply.pseudo_code, reply.interval, reply.type);
        } catch {
            setIsAnswering(false);
            __MESSAGE__(t('error_occured_auto'));
            return;
        }

        setIsAnswering(false);
        __MESSAGE__(t('auto_ok'));
        fetchAutomatedTasks();
    }

    useEffect(() => {
        if (code) {
            console.log("Evaluating code");
            eval(`
                async function run() {
                    try {
                        await (async () => {
                            ${code}
                        })();
                    } catch {
                    
                    } finally {
                        setCode('');
                    }
                    
                }
                run();
                `
            );
        }
    }, [code]);

    return (
        <AgentContext.Provider value={{
            messages,
            userMessages,
            agentMessages,
            sendMessage,
            isAnswering,
            resolve,
            reject,
            currentAction,
            code,
            currentNavigation,
            setCurrentNavigation,
            sendAutomationMessage,
            __DEPOSIT__,
            __WITHDRAW__,
            __SWAP__,
            __BRIDGE__,
            __CANCEL__,
            __MESSAGE__,
            __SET_STRATEGIES__,
            __GET_ADDRESS__,
            __GET_BALANCE__,
            tokenBalance,
            tokenPrice,
            depositedAmount,
            totalBalance,
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export const useAgent = () => {
    return useContext(AgentContext);
}