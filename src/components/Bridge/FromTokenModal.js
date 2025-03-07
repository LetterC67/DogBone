import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/FromTokenModal.tsx
import { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
const FromTokenModal = ({ currentChain, availableChains, sampleTokens, onSelect, onClose, title = "Select source chain and token", }) => {
    const [selectedChain, setSelectedChain] = useState(currentChain);
    const [searchQuery, setSearchQuery] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(true);
    }, []);
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };
    const tokensForChain = sampleTokens[selectedChain] || [];
    const filteredTokens = tokensForChain.filter((token) => token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    return (_jsxs("div", { className: "fixed inset-0 flex items-center justify-center z-50", children: [_jsx("div", { className: `absolute inset-0 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`, style: { backgroundColor: "rgba(17,7,12,0.7)" }, onClick: handleClose }), _jsxs("div", { className: `rounded-lg shadow-lg z-10 w-120 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`, style: { backgroundColor: "var(--secondary)" }, children: [_jsxs("div", { className: "sticky top-0 z-20 p-4 border-b", style: { backgroundColor: "var(--secondary)", borderColor: "var(--divider)" }, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: handleClose, className: "mr-2 focus:outline-none", children: _jsx("svg", { className: "w-6 h-6 transition-colors duration-200 hover:text-[var(--primary)]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", style: { color: "var(--primary)" }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 19l-7-7 7-7" }) }) }), _jsx("h2", { className: "text-lg font-semibold", style: { color: "var(--primary)" }, children: title })] }), _jsx("div", { className: "mt-2", children: _jsx("div", { className: "flex flex-wrap gap-2", children: availableChains.map((chain) => (_jsxs("button", { onClick: () => setSelectedChain(chain.id), className: `flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${selectedChain === chain.id
                                            ? "bg-[var(--accent-2)]"
                                            : "bg-transparent hover:bg-[var(--accent-2)]"}
				border-(--divider) border
				`, children: [chain.icon && _jsx("img", { src: chain.icon, alt: chain.name, className: "w-6 h-6" }), _jsx("span", { style: { color: "var(--primary)" }, children: chain.name })] }, chain.id))) }) }), _jsx("div", { className: "mt-4", children: _jsx("input", { type: "text", placeholder: "Search token...", className: "w-full p-2 rounded-lg outline-none transition-colors duration-200", style: { backgroundColor: "var(--accent-3)", color: "var(--primary)" }, value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }) })] }), filteredTokens.length > 0 ? (_jsx(List, { height: Math.min(filteredTokens.length * 64, 400), itemCount: filteredTokens.length, itemSize: 64, width: "100%", children: ({ index, style }) => {
                            const token = filteredTokens[index];
                            return (_jsxs("div", { style: { ...style, borderBottom: "1px solid var(--divider)" }, className: "token-list-item flex items-center p-4 cursor-pointer transition-colors duration-200", onClick: () => onSelect(token, selectedChain), children: [token.logoURI && (_jsx("img", { src: token.logoURI, alt: token.symbol, className: "w-8 h-8 mr-3", loading: "lazy" })), !token.logoURI && (_jsx("img", { src: "https://sonicscan.org/assets/sonic/images/svg/empty-token.svg?v=25.2.1.0", alt: token.symbol, className: "w-8 h-8 mr-3", loading: "lazy" })), _jsxs("div", { children: [_jsx("div", { className: "font-medium", style: { color: "var(--primary)" }, children: token.name }), _jsx("div", { className: "text-sm", style: { color: "var(--less-highlight)" }, children: token.symbol })] })] }, token.address));
                        } })) : (_jsx("div", { className: "p-4 text-center", style: { color: "var(--primary)" }, children: "No tokens found." }))] })] }));
};
export default FromTokenModal;
