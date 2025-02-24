// src/TokenModal.tsx
import React, { useState, useEffect } from 'react';
import { Token } from './types';

interface TokenModalProps {
  tokens: Token[];
  strategyChain: number;
  setStrategyChain: (chainId: number) => void;
  onSelect: (token: Token) => void;
  onClose: () => void;
  title?: string;
}

const availableChains = [
    { id: "sonic", name: "Sonic", icon: "https://tokens.debridge.finance/Logo/100000014/0x0000000000000000000000000000000000000000/small/token-logo.svg", chainId: 146 },
    { id: "eth", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=014", chainId: 1 },
    { id: "base", name: "Base", icon: "https://raw.githubusercontent.com/base/brand-kit/a3b352afcc0839a0a355ccc2ae3279442fa56343/logo/symbol/Base_Symbol_Blue.svg", chainId: 8453 },
    { id: "polygon", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=014", chainId: 137 },
    { id: "arb", name: "Arbitrum", icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=014", chainId: 42161 },
  ];
  

const TokenModal: React.FC<TokenModalProps> = ({
  tokens,
  onSelect,
  onClose,
  strategyChain,
    setStrategyChain,
  title = 'Select a token',
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Trigger entry animation after mounting
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Trigger exit animation then call onClose after delay
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
        onClose();
        }, 300); // duration matches the CSS transition
    };

    // Filter tokens based on the search input
    const filteredTokens = tokens.filter(
        (token) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Overlay with fade-in/out transition */}
        <div
            className={`absolute inset-0 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'rgba(17,7,12,0.7)' }}
            onClick={handleClose}
        />

        {/* Modal container with smooth scale/opacity transition */}
        <div
            className={`rounded-lg shadow-lg z-10 w-110 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ backgroundColor: 'var(--secondary)' }}
        >
            {/* Sticky header with back arrow, title, and search input */}
            <div
            className="sticky top-0 z-20 p-4 border-b"
            style={{
                backgroundColor: 'var(--secondary)',
                borderColor: 'var(--divider)',
            }}
            >
            <div className="flex items-center">
                <button onClick={handleClose} className="mr-2 focus:outline-none">
                {/* Back arrow icon */}
                <svg
                    className="w-6 h-6 transition-colors duration-200 hover:text-[var(--primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--primary)' }}
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                    />
                </svg>
                </button>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                {title}
                </h2>
            </div>
            {/* Chain selection buttons */}
            <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                {availableChains.map((chain) => (
                    <button
                    key={chain.id}
                    onClick={() => setStrategyChain(chain.chainId)}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
                        strategyChain === chain.chainId
                        ? "bg-[var(--accent-2)]"
                        : "bg-transparent hover:bg-[var(--accent-2)]"
                    }
                    border-(--divider) border
                    hover:cursor-pointer
                    `}
                    >
                    {chain.icon && <img src={chain.icon} alt={chain.name} className="w-6 h-6" />}
                    <span style={{ color: "var(--primary)" }}>{chain.name}</span>
                    </button>
                ))}
                </div>
            </div>
            <div className="mt-2">
                <input
                type="text"
                placeholder="Search token..."
                className="w-full p-2 rounded-lg outline-none transition-colors duration-200"
                style={{
                    backgroundColor: 'var(--accent-2)',
                    color: 'var(--primary)',
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            </div>

            
            {/* Token List */}
            <div>
            {filteredTokens.map((token) => (
                <div
                key={token.name}
                className="token-list-item flex items-center p-4 cursor-pointer transition-colors duration-200"
                style={{ borderBottom: '1px solid var(--divider)' }}
                onClick={() => onSelect(token)}
                >
                {token.logoURI && (
                    <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 mr-3 rounded-full"
                    />
                )}
                <div>
                    <div className="font-medium" style={{ color: 'var(--primary)' }}>
                    {token.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--less-highlight)' }}>
                    {token.symbol}
                    </div>
                </div>
                </div>
            ))}
            {filteredTokens.length === 0 && (
                <div className="p-4 text-center" style={{ color: 'var(--primary)' }}>
                No tokens found.
                </div>
            )}
            </div>
        </div>
        </div>
    );
};

export default TokenModal;
