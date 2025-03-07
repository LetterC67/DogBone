import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/ChainModal.tsx
import { useState, useEffect } from 'react';
const ChainModal = ({ chains, onSelect, onClose, title = "Select a chain", }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        setIsVisible(true);
    }, []);
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };
    const filteredChains = chains.filter(chain => chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chain.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: [_jsx("div", { className: `absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`, style: { backgroundColor: 'rgba(17,7,12,0.7)' }, onClick: handleClose }), _jsxs("div", { className: `rounded-lg shadow-lg z-10 w-80 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`, style: { backgroundColor: 'var(--secondary)' }, children: [_jsxs("div", { className: "sticky top-0 z-20 p-4 border-b", style: { backgroundColor: 'var(--secondary)', borderColor: 'var(--divider)' }, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: handleClose, className: "mr-2 focus:outline-none", children: _jsx("svg", { className: "w-6 h-6 transition-colors duration-200 hover:text-[var(--primary)]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: 'var(--primary)' }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) }), _jsx("h2", { className: "text-lg font-semibold", style: { color: 'var(--primary)' }, children: title })] }), _jsx("div", { className: "mt-2", children: _jsx("input", { type: "text", placeholder: "Search chain...", className: "w-full p-2 rounded-lg outline-none transition-colors duration-200", style: { backgroundColor: 'var(--accent-2)', color: 'var(--primary)' }, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }) })] }), _jsxs("div", { children: [filteredChains.map((chain) => (_jsxs("div", { className: "flex items-center p-4 cursor-pointer transition-colors duration-200 hover:bg-[var(--accent)]", style: { borderBottom: '1px solid var(--divider)' }, onClick: () => onSelect(chain), children: [chain.icon && _jsx("img", { src: chain.icon, alt: chain.name, className: "w-8 h-8 mr-3" }), _jsx("div", { className: "font-medium", style: { color: 'var(--primary)' }, children: chain.name })] }, chain.id))), filteredChains.length === 0 && (_jsx("div", { className: "p-4 text-center", style: { color: 'var(--primary)' }, children: "No chains found." }))] })] })] }));
};
export default ChainModal;
