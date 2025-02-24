import { useAgent } from "../../context/AgentContext";
import { useRef, useEffect, useState } from "react";

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
            className={`p-2 inline-block px-4 rounded-4xl break-all transition-all duration-500
            ${message.isUser ? "bg-(--accent)" : ""}
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
            {message.message}
        </div>
        </div>
  );
}

function ChatMessages() {
    // Destructure isAnswering from agent context.
    const { messages, isAnswering } = useAgent();
    const containerRef = useRef<HTMLDivElement>(null);
    const lastUserMessageRef = useRef<HTMLDivElement>(null);

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
