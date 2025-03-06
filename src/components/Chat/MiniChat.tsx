import React, { useEffect, useState } from 'react';
import ChatInputMini from './ChatInputMini';
import { useAgent } from '../../context/AgentContext';
import Markdown from 'react-markdown';

function MiniChat() {
    const { agentMessages, isAnswering } = useAgent();
    const [visible, setVisible] = useState(false);
    const [latestAgentMessage, setLatestAgentMessage] = useState<string>('');
    const [newMessage, setNewMessage] = useState<boolean>(true);

    // If no agent message exists, return empty content.
    if (!agentMessages || agentMessages.length === 0) {
        console.log('No agent messages');
        return null;
    }

    // Get the latest agent message.
    // const latestAgentMessage = agentMessages[agentMessages.length - 1];

    // Trigger animation each time the latest message changes.
    useEffect(() => {
        setVisible(false);
        setNewMessage(false);
        const timer = setTimeout(() => {
            setLatestAgentMessage(agentMessages[agentMessages.length - 1]);
            setNewMessage(true);
        }, 200);
        return () => clearTimeout(timer);
    }, [agentMessages]);
    
    useEffect(() => {
        if(!newMessage) return;
        setVisible(true);
    }, [latestAgentMessage, newMessage]);

    return (
        <>
            <div className="flex flex-col items-center h-64  w-3/5 rounded-4xl border-3 border-(--divider) px-4 pt-2">
                <div className="w-full flex flex-col justify-between h-full pb-6 items-center h-40">
                    {/* Latest agent message with avatar and animation */}
                    {!isAnswering && <div className="w-full flex items-center  overflow-y-auto">
                        <img
                            src="https://iili.io/3FsujwX.md.png"
                            alt="Agent Avatar"
                            className="w-6 h-6 mr-2"
                        />
                        <div
                            className={`p-2 rounded-lg break-word transition-all duration-500 h-full ${
                            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 '
                            }`}
                        >
                                <Markdown>
                            {latestAgentMessage}
                            </Markdown>
                        </div>
                    </div>
                    }
                    {/* Thinking indicator if the agent is answering */}
                    {isAnswering && (
                    <div className="w-full flex items-center">
                        <img
                        src="https://iili.io/3FsujwX.md.png"
                        alt="Agent Avatar"
                        className="w-6 h-6 mr-2"
                        />
                        <div className="p-2 rounded-lg">
                        <span className="animate-pulse">Agent is thinking...</span>
                        </div>
                    </div>
                    )}
                    {/* Chat input */}
                    <div className="mt-auto w-full">
                        <ChatInputMini />
                    </div>
                </div>
            </div>
        </>
    );
}

export default MiniChat;
