import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import Navigator from '../Navigator';
function FullChat() {
    return (_jsxs("div", { className: 'flex flex-col items-center h-full text-lg', children: [_jsx(Navigator, {}), _jsxs("div", { className: 'w-full flex flex-col justify-between h-full pb-6 items-center', children: [_jsx(ChatMessages, {}), _jsx("div", { className: 'w-3/5', children: _jsx(ChatInput, { maxHeight: 200 }) })] })] }));
}
export default FullChat;
