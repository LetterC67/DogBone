import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import usePortfolio from '../../hooks/usePortfolio';
import { useData } from '../../context/DataContext';
import Navigator from '../Navigator';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from "react-router-dom";
import { useControl } from '../../context/ControlContext';
function BreathingText() {
    const [pulse, setPulse] = useState(false);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setPulse((prev) => !prev);
        }, 2000); // Pulse every 2 seconds (adjust as needed)
        return () => clearInterval(intervalId);
    }, []);
    const textColor = pulse ? 'text-(--accent-2)' : 'text-[#D2ADB8]'; // Highlight pulse
    return (_jsx("div", { className: `text-2xl font-semibold transition-colors duration-2000 ease-in-out ${textColor} p-4 rounded-lg`, children: "Paws-itively loading your portfolio!" }));
}
export default function Portfolio() {
    const [expandedTokens, setExpandedTokens] = useState([]);
    const { portfolio, totalBalance, ready } = usePortfolio();
    const { sonicPoint, ringsPoint } = useData();
    const { authenticated, login } = usePrivy();
    const toggleDetails = (symbol) => {
        setExpandedTokens(prev => prev.includes(symbol)
            ? prev.filter(s => s !== symbol)
            : [...prev, symbol]);
    };
    if (!authenticated) {
        return (_jsx("div", { className: "w-full h-full flex flex-col items-center justify-center", children: _jsxs("div", { className: 'w-160 h-120 text-4xl rounded-2xl border-(--divider)  flex flex-col items-center justify-center gap-5 font-(family-name:--eb) mimdak', children: [_jsx("img", { src: "https://www.svgrepo.com/show/423814/dog-origami-paper.svg", className: "h-36" }), _jsx("p", { children: "Tokens dance in light," }), _jsxs("p", { children: [_jsx("span", { className: 'hover:cursor-pointer underline underline-offset-6 decoration-2', onClick: login, children: "Login" }), " to unveil your wealth,"] }), _jsx("p", { children: "Crypto dreams take flight." })] }) }));
    }
    return (_jsxs("div", { className: "portfolio-container w-full h-full flex flex-col rounded-2xl", style: {
            background: 'var(--background)',
            color: 'var(--primary)',
            padding: '2rem'
        }, children: [_jsx(Navigator, {}), _jsxs("div", { className: "container h-full", style: { maxWidth: '1000px', margin: '0 auto' }, children: [_jsxs("div", { className: "portfolio-summary", style: {
                            display: 'grid',
                            gap: '1.5rem',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            marginBottom: '2rem'
                        }, children: [_jsx(SummaryCard, { title: "Total Balance", value: `$${totalBalance.toFixed(2)}` }), _jsx(SummaryCard, { title: "Sonic Points", value: parseFloat(sonicPoint).toFixed(2), img: _jsx("img", { src: "https://tokens.debridge.finance/Logo/100000014/0x0000000000000000000000000000000000000000/small/token-logo.svg", className: 'h-7 w-7' }) }), _jsx(SummaryCard, { title: "Rings Points", value: parseFloat(ringsPoint).toFixed(2), img: _jsx("img", { src: "https://i.ibb.co/TBqmpJDt/Logo-White.png", className: 'h-6 w-6' }) })] }), _jsx("div", { className: "rounded-2xl h-4/5  bg-(--secondary)", children: _jsxs("div", { className: "w-full h-full token-list", style: { width: '99%', overflowX: 'auto', overflowY: 'auto' }, children: [ready && _jsxs("table", { style: {
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        overflow: 'hidden'
                                    }, className: 'rounded-2xl', children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid var(--divider)' }, children: [_jsx("th", { style: { textAlign: 'left', padding: '1rem 1.5rem' }, children: "Token" }), _jsx("th", { style: { textAlign: 'right', padding: '1rem 1.5rem' }, children: "Balance" }), _jsx("th", { style: { textAlign: 'right', padding: '1rem 1.5rem' }, children: "Price" }), _jsx("th", { style: { textAlign: 'right', padding: '1rem 1.5rem' }, className: "" }), _jsx("th", { style: { textAlign: 'right', padding: '1rem 1.5rem' }, className: "w-1/20" })] }) }), _jsx("tbody", { children: portfolio.map(asset => (_jsx(TokenRow, { token: asset.token, asset: asset, isExpanded: expandedTokens.includes(asset.token.symbol), onToggle: toggleDetails }, asset.token.symbol))) })] }), !ready &&
                                    _jsxs("div", { className: "flex items-center justify-center h-full flex-col gap-10 text-2xl", children: [_jsx("div", { className: "w-30 h-30 border-4 border-(--accent-3) border-t-(--highlight) rounded-full animate-spin" }), _jsx(BreathingText, {})] })] }) })] })] }));
}
function SummaryCard({ title, value, subValue, img }) {
    return (_jsxs("div", { className: "summary-card", style: {
            background: 'var(--secondary)',
            padding: '1.5rem',
            borderRadius: '1rem'
        }, children: [_jsx("div", { className: "card-title", style: {
                    color: 'var(--highlight)',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem'
                }, children: title }), _jsxs("div", { className: "card-value flex flex-row gap-2 items-center", style: {
                    fontSize: '1.5rem',
                    color: 'var(--primary)'
                }, children: [value, img] }), subValue && (_jsx("div", { className: "card-subvalue", style: {
                    fontSize: '0.9rem',
                    color: 'var(--less-highlight)'
                }, children: subValue }))] }));
}
function TokenRow({ token, isExpanded, onToggle, asset }) {
    const navigate = useNavigate();
    const { setSelectedTokens, setIsInStrategyTab } = useControl();
    return (_jsxs(_Fragment, { children: [_jsxs("tr", { onClick: () => onToggle(token.symbol), style: {
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                    /* If not expanded, add a divider; if expanded, the divider is rendered below the details */
                    borderBottom: isExpanded ? 'none' : '1px solid var(--divider)'
                }, children: [_jsxs("td", { style: { padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }, children: [_jsx("img", { src: token.logoURI, alt: token.name, style: { width: '40px', height: '40px', borderRadius: '50%' } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 500 }, children: token.name }), _jsx("div", { style: { color: 'var(--disabled)', fontSize: '0.9rem' }, children: token.symbol })] })] }), _jsxs("td", { style: { padding: '1rem 1.5rem', textAlign: 'right' }, children: [_jsx("div", { children: (parseFloat(asset.balance) + parseFloat(asset.deposited)).toFixed(6) }), _jsxs("div", { style: { color: 'var(--less-highlight)', fontSize: '0.9rem' }, children: ["~$", asset.amount_usd.toFixed(4)] })] }), _jsxs("td", { style: { padding: '1rem 1.5rem', textAlign: 'right' }, children: [_jsxs("div", { children: ["$", parseFloat(asset.price).toFixed(2)] }), _jsx("div", { style: {
                                    fontSize: '0.9rem',
                                    color: `var(--accent-2)`
                                }, children: "-" })] }), _jsx("td", { style: { padding: '1rem 1.5rem', textAlign: 'center' }, children: _jsx("div", { className: "bg-(--accent) text-white rounded-4xl p-2 hover:bg-(--accent-2) transition duration-300 hover:cursor-pointer", onClick: () => {
                                setSelectedTokens([token.symbol]);
                                setIsInStrategyTab(false);
                                navigate(`/yield`);
                            }, children: "Earn" }) }), _jsx("td", { style: { padding: '1rem 1.5rem', textAlign: 'right' }, children: _jsx("svg", { style: {
                                transition: 'transform 0.3s ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'none',
                                stroke: 'var(--primary)',
                                strokeWidth: '2'
                            }, width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", strokeWidth: "2", children: _jsx("path", { d: "M6 9l6 6 6-6" }) }) })] }), isExpanded && (_jsx("tr", { children: _jsxs("td", { colSpan: 4, style: {
                        padding: '1rem',
                        background: 'var(--secondary)',
                        borderBottom: '1px solid var(--divider)'
                    }, children: [_jsx(DetailRow, { label: "Wallet Balance", value: parseFloat(asset.balance).toFixed(6) }, "Wallet Balance"), _jsx(DetailRow, { label: "Vault Deposit", value: parseFloat(asset.deposited).toFixed(6) }, "Vault Deposit")] }) }))] }));
}
function DetailRow({ label, value }) {
    return (_jsxs("div", { style: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            padding: '0.5rem',
            borderRadius: '0.5rem',
        }, children: [_jsx("span", { style: { color: 'var(--disabled)' }, children: label }), _jsx("span", { children: value })] }));
}
