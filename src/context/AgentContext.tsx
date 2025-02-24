import { createContext, useContext, useState, useEffect} from "react";
import { getReply } from "../api/agent";
import { useControl } from "./ControlContext";
import { getTokenAddressBySymbol } from "../tools/getTokenAddressBySymbol";
import TokenList from "../tools/tokenList.json"
import { toast } from "react-toastify";


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
    setCurrentNavigation: (t: any) => {}
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
    } = useControl();

    function isActionCode(code: string) {
        const actionMethod = ['__SWAP__', '__DEPOSIT__', '__BRIDGE__'];

        for (const action of actionMethod) {
            if (code.includes(action)) {
                return true;
            }
        }

        return false;
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
                __MESSAGE__(`Cannot find token ${inputToken}`);
                throw new Error(`Cannot find token ${inputToken}`);
            }
            
            out = await getTokenBySymbol(outputToken, 146);
            if (!out) {
                __MESSAGE__(`Cannot find token ${outputToken}`);
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

        const toastId = toast.loading("Waiting user to swap...", {
            closeOnClick: false, // Prevent closing on click
            draggable: false, // Disable drag to dismiss
        });
        
        return new Promise((resolve, reject) => {
            setResolve(() => 
                async () => {
                    toast.dismiss(toastId);
                    await __MESSAGE__("Swapped successfully!")
                    await new Promise(r => setTimeout(r, 2000));
                    resolve(1);
                }
            );
            setReject(() => reject);
        });
    }

    async function sendMessage(message: string) {
        if (isAnswering) return;
        console.log(message);
        setMessages((prev: any) => [...prev, {
            message,
            isUser: true
        }]);
        setUserMessages((prev: any) => [...prev, message]);
        
        setIsAnswering(true);
        const reply = await getReply(message);
        
        if (!isActionCode(reply)) {
            eval(reply);
        } else {
            if (code != '') {
                __MESSAGE__("You cannot execute multiple actions at once. Please wait for the current action to finish.");
            } else {
                setCode(reply);
            }
        }
        setIsAnswering(false);
    }

    useEffect(() => {
        if (code) {
            eval('(async () => {\n' + code + '\n;setCode("");})(); ');
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
            setCurrentNavigation
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export const useAgent = () => {
    return useContext(AgentContext);
}