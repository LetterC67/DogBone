import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAgent } from "../../context/AgentContext";
import { useRef, useEffect, useState } from "react";
import Markdown from "react-markdown";

interface ChatMessageItemProps {
  message: any;
  attachRef?: React.Ref<HTMLDivElement>;
}

function ChatMessageItem({ message, attachRef }: ChatMessageItemProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount with a slight delay.
        const timer = setTimeout(() => {
        setVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
        ref={attachRef}
        className={`flex items-start p-2 ${
            message.isUser ? "justify-end" : "justify-start"
        }`}
        >
        {/* Render avatar for agent messages */}
        {!message.isUser && (
            <img
            src="https://www.svgrepo.com/show/405231/dog-face.svg"
            alt="Agent Avatar"
            className="w-8 h-8 mt-2 mr-2"
            />
        )}
        <div
            className={`p-2 inline-block px-4 rounded-4xl transition-all duration-500
            ${message.isUser ? "bg-(--accent)" : ""}
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
            <div className="text-[--primary] prose prose-lg prose-p:text-white-500">
            <Markdown>{message.message}</Markdown>
            </div>
        </div>
        </div>
  );
}

function QuickAction({content}: {content:string}) {
    const { sendMessage } = useAgent();

    function handleClick() {
        sendMessage(content);
    }

    return (
        <div className="p-2 border-(--divider) border-2 rounded-2xl px-4 hover:bg-(--divider) transition duration-300 hover:cursor-pointer" onClick={handleClick}>
            {content}
        </div>
    )
}

function ChatMessages() {
    // Destructure isAnswering from agent context.
    const { messages, isAnswering } = useAgent();
    const containerRef = useRef<HTMLDivElement>(null);
    const lastUserMessageRef = useRef<HTMLDivElement>(null);
    const { authenticated, ready, login} = usePrivy();
    const { wallets } = useWallets();

    useEffect(() => {
        if (containerRef.current) {
        // If the latest message is from the user, scroll so that message is at the top.
        if (
            messages.length > 0 &&
            messages[messages.length - 1].isUser &&
            lastUserMessageRef.current
        ) {
            containerRef.current.scrollTop =
            lastUserMessageRef.current.offsetTop;
        } else {
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
        } else if (hour < 18) {
          greeting = "Good Afternoon";
        } else {
          greeting = "Good Evening";
        }
  
        return greeting;
      }



    if (messages.length == 0 && ready) {
        return (
            <>
            <div
            className="w-full p-4 h-full overflow-y-auto rounded-4xl flex flex-col items-center justify-center"
            >
                    <div className="text-4xl mb-8 flex flex-row gap-2">
                        <img src="https://www.svgrepo.com/show/405231/dog-face.svg" className='w-10'></img>
                        {displayGreeting()},
                        <span>
                            {wallets.length > 0 && <>{` ${wallets[0].address.substring(0, 4)}...${wallets[0].address.substring(37,41)}`}</>}
                            {(wallets.length == 0) && " Anon"}
                        </span>
                    </div>
                    {authenticated && 
                    <div className="justify-center flex flex-wrap flex-row gap-2 w-1/2">
                        <QuickAction content="Swap 100 USDC for Sonic"></QuickAction>
                        <QuickAction content="How to move my assets from Binance CEX"></QuickAction>
                        <QuickAction content="How can I earn on DogBone?"></QuickAction>
                        <QuickAction content="Deposit my ETH on Ethereum into the most profitable vault"></QuickAction>
                        <QuickAction content="Deposit the amount of Sonic equivalent to 8th Fibonacci number into the best Beefy vault"></QuickAction>
                    </div>
                    }

                    {!authenticated && 
                    <div className="justify-center flex flex-wrap flex-row gap-2 w-1/2">
                        <QuickAction content="How can I earn money with my token?"></QuickAction>
                        <QuickAction content="What is special about Sonic chain"></QuickAction>
                        <QuickAction content="Show me the best strategy for wS token"></QuickAction>
                        <QuickAction content="Write a haiku about DogBone"></QuickAction>
                        <div className="p-2 border-(--divider) border-2 rounded-2xl px-4 hover:bg-(--divider) transition duration-300 hover:cursor-pointer" onClick={login}>
                            Log me in
                        </div>
                    </div>
                    }
                </div>
            </>
        )
    }

    return (
        <div
        ref={containerRef}
        className="w-full p-4 h-full overflow-y-auto rounded-4xl flex flex-col items-center"
        >
        <div className="w-3/5">
            {messages.map((message: any, index: number) => {
                const isLastUserMessage =
                message.isUser && index === messages.length - 1;
                return (
                    <ChatMessageItem
                    key={index}
                    message={message}
                    attachRef={isLastUserMessage ? lastUserMessageRef : null}
                    />
                );
            })}
            {/* Show the thinking indicator if agent is answering */}
            {isAnswering && (
            <div className="flex items-center p-2 justify-start">
                <img
                src="https://www.svgrepo.com/show/405231/dog-face.svg"
                alt="Agent Avatar"
                className="w-8 h-8 mr-2"
                />
                <div className="p-2 inline-block rounded-4xl">
                <span className="animate-pulse">Agent is thinking...</span>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}

export default ChatMessages;
