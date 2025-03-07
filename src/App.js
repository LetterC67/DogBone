import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Yield from './components/Yield/Yield';
import Swap from "./components/Swap/Swap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Bridge from './components/Bridge/Bridge';
import { AllTools } from './tools/AllTools';
import { Testing } from './tools/Testing';
import { DataProvider } from './context/DataContext';
import { StrictMode } from 'react';
import { ControlProvider } from './context/ControlContext';
import { AgentProvider } from './context/AgentContext';
import FullChat from './components/Chat/FullChat';
import MiniChat from './components/Chat/MiniChat';
import { ToastContainer, Bounce } from 'react-toastify';
import Portfolio from "./components/Portfolio/Portfolio";
function IntegrateMiniChat({ element }) {
    return (_jsxs("div", { className: "h-screen w-full flex flex-col", children: [_jsx("div", { className: 'flex-1 h-1', children: element }), _jsx("div", { className: 'flex flex-col items-center w-full p-6', children: _jsx(MiniChat, {}) })] }));
}
function App() {
    return (_jsx(StrictMode, { children: _jsx(ControlProvider, { children: _jsx(DataProvider, { children: _jsx(AgentProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(ToastContainer, { position: "top-right", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: false, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true, theme: "light", transition: Bounce }), _jsxs("div", { className: "h-screen w-screen flex-row flex", children: [_jsx("div", { className: "w-1/6 h-full text-lg font-bold", children: _jsx(Sidebar, {}) }), _jsx("div", { className: "w-5/6 h-full", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(FullChat, {}) }), _jsx(Route, { path: "/yield", element: _jsx(IntegrateMiniChat, { element: _jsx(Yield, {}) }) }), _jsx(Route, { path: "/swap", element: _jsx(IntegrateMiniChat, { element: _jsx(Swap, {}) }) }), _jsx(Route, { path: "/bridge", element: _jsx(IntegrateMiniChat, { element: _jsx(Bridge, {}) }) }), _jsx(Route, { path: "/alltools", element: _jsx(AllTools, {}) }), _jsx(Route, { path: "/portfolio", element: _jsx(IntegrateMiniChat, { element: _jsx(Portfolio, {}) }) }), _jsx(Route, { path: "/test", element: _jsx(Testing, {}) })] }) })] })] }) }) }) }) }));
}
export default App;
