import { createContext, useContext, useState } from "react";
import { getReply } from "../api/agent";

const AgentContext = createContext({
    messages: [],
    userMessage: [],
    agentMessage: [],
    sendMessage: (message: string) => {},
    isAnswering: false
});

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [userMessages, setUserMessages] = useState<string[]>([]);
    const [agentMessages, setAgentMessages] = useState<string[]>([]);

    const [isAnswering, setIsAnswering] = useState<boolean>(false);
    

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
        eval(reply);
        setIsAnswering(false);
    }

    return (
        <AgentContext.Provider value={{
            messages,
            userMessages,
            agentMessages,
            sendMessage,
            isAnswering
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export const useAgent = () => {
    return useContext(AgentContext);
}