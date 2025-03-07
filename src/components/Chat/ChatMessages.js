import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAgent } from "../../context/AgentContext";
import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";
import TipsBox from "../Common/TipSection";
function ChatMessageItem({ message, attachRef }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        // Trigger animation on mount with a slight delay.
        const timer = setTimeout(() => {
            setVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);
    return (_jsxs("div", { ref: attachRef, className: `flex items-start p-2 ${message.isUser ? "justify-end" : "justify-start"}`, children: [!message.isUser && (_jsx("img", { src: "https://www.svgrepo.com/show/405231/dog-face.svg", alt: "Agent Avatar", className: "w-8 h-8 mt-2 mr-2" })), _jsx("div", { className: `p-2 inline-block px-4 rounded-4xl transition-all duration-500
            ${message.isUser ? "bg-(--accent)" : ""}
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`, children: _jsx("div", { className: "text-[--primary] prose prose-lg prose-p:text-white-500", children: _jsx(Markdown, { children: message.message }) }) })] }));
}
function QuickAction({ content }) {
    const { sendMessage } = useAgent();
    function handleClick() {
        sendMessage(content);
    }
    return (_jsx("div", { className: "p-2 border-(--divider) border-2 rounded-2xl px-4 hover:bg-(--divider) transition duration-300 hover:cursor-pointer", onClick: handleClick, children: content }));
}
function ChatMessages() {
    // Destructure isAnswering from agent context.
    const { messages, isAnswering } = useAgent();
    const containerRef = useRef(null);
    const lastUserMessageRef = useRef(null);
    const { authenticated, ready, login } = usePrivy();
    const { wallets } = useWallets();
    useEffect(() => {
        if (containerRef.current) {
            // If the latest message is from the user, scroll so that message is at the top.
            if (messages.length > 0 &&
                messages[messages.length - 1].isUser &&
                lastUserMessageRef.current) {
                containerRef.current.scrollTop =
                    lastUserMessageRef.current.offsetTop;
            }
            else {
                // Otherwise, scroll to the bottom to reveal new agent messages.
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    }, [messages]);
    function displayGreeting() {
        const now = new Date();
        const hour = now.getHours();
        let greeting;
        if (hour < 12) {
            greeting = "Good Morning";
        }
        else if (hour < 18) {
            greeting = "Good Afternoon";
        }
        else {
            greeting = "Good Evening";
        }
        return greeting;
    }
    if (messages.length == 0 && ready) {
        return (_jsx(_Fragment, { children: _jsxs("div", { className: "w-full p-4 h-full overflow-y-auto rounded-4xl flex flex-col items-center justify-center", children: [_jsxs("div", { className: "text-4xl mb-8 flex flex-row gap-2", children: [_jsx("img", { src: "https://iili.io/3FsujwX.md.png", className: 'w-10' }), displayGreeting(), ",", _jsxs("span", { children: [wallets.length > 0 && _jsx(_Fragment, { children: ` ${wallets[0].address.substring(0, 4)}...${wallets[0].address.substring(37, 41)}` }), (wallets.length == 0) && " Anon"] })] }), authenticated &&
                        _jsxs("div", { className: "justify-center flex flex-wrap flex-row gap-2 w-1/2", children: [_jsx(QuickAction, { content: "Swap 100 USDC for Sonic" }), _jsx(QuickAction, { content: "How to move my assets from Binance CEX" }), _jsx(QuickAction, { content: "How can I earn on DogBone?" }), _jsx(QuickAction, { content: "Deposit my ETH on Ethereum into the most profitable vault" }), _jsx(QuickAction, { content: "Deposit the amount of Sonic equivalent to 8th Fibonacci number into the best Beefy vault" })] }), !authenticated &&
                        _jsxs("div", { className: "justify-center flex flex-wrap flex-row gap-2 w-1/2", children: [_jsx(QuickAction, { content: "How can I earn money with my token?" }), _jsx(QuickAction, { content: "What is special about Sonic chain" }), _jsx(QuickAction, { content: "Show me the best strategy for wS token" }), _jsx(QuickAction, { content: "Write a haiku about DogBone" }), _jsx("div", { className: "p-2 border-(--divider) border-2 rounded-2xl px-4 hover:bg-(--divider) transition duration-300 hover:cursor-pointer", onClick: login, children: "Log me in" })] })] }) }));
    }
    return (_jsx("div", { ref: containerRef, className: "w-full p-4 h-full overflow-y-auto rounded-4xl flex flex-col items-center", children: _jsxs("div", { className: "w-3/5", children: [messages.map((message, index) => {
                    const isLastUserMessage = message.isUser && index === messages.length - 1;
                    return (_jsx(ChatMessageItem, { message: message, attachRef: isLastUserMessage ? lastUserMessageRef : null }, index));
                }), isAnswering && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center p-2 justify-start", children: [_jsx("div", { className: "w-10 h-full flex flex-start", children: _jsx("img", { src: "https://iili.io/3FsujwX.md.png", alt: "Agent Avatar", className: "w-8 h-8 mr-2" }) }), _jsx("div", { className: "p-2 inline-block rounded-4xl", children: _jsx("span", { className: "animate-pulse", children: "Agent is thinking..." }) })] }), _jsx(TipsBox, {})] }))] }) }));
}
export default ChatMessages;
