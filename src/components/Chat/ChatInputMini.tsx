import { useAgent } from "../../context/AgentContext";
import { useState, useRef, useEffect } from "react";
import { MdSend } from "react-icons/md"; // Ensure react-icons is installed
import { usePrivy } from "@privy-io/react-auth";
import { useTranslation } from "react-i18next";

function ChatInput({maxHeight}: {maxHeight: number}) {
  const { sendMessage } = useAgent();
  const [message, setMessage] = useState<string>('');
  const textAreaRef = useRef<HTMLInputElement>(null);
  const { authenticated } = usePrivy();
  const { t } = useTranslation();

  // Auto-resize effect for the textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height
      const newHeight = Math.min(textAreaRef.current.scrollHeight, maxHeight);
      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  // Handle Enter (send) vs Shift+Enter (new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative border-3 border-(--divider) rounded-4xl flex flex-row">
        <input
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: `${maxHeight}px` }}
            className="w-full pl-6 pr-14 h-14 m-2 py-2  resize-none focus:outline-none overflow-y-auto"
            placeholder={t('what_do_you_want_to_do')}
        />
        <div className="flex flex-col-reverse">
                <button
                    onClick={handleSendMessage}
                    className="transform -translate-y-1 m-1 p-2 bg-(--accent) text-white rounded-full hover:bg-opacity-90 mr-2 mt-2 hover:cursor-pointer hover:bg-(accent-2)"
                >
                    <MdSend size={24} />
                </button>
        </div>
    </div>
  );
}

export default ChatInput;
