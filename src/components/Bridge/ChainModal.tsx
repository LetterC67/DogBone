// src/ChainModal.tsx
import React, { useState, useEffect } from 'react';
import { Chain } from './types';
import { useTranslation } from 'react-i18next';

interface ChainModalProps {
  chains: Chain[];
  onSelect: (chain: Chain) => void;
  onClose: () => void;
  title?: string;
}

const ChainModal: React.FC<ChainModalProps> = ({
  chains,
  onSelect,
  onClose,
  title = "Select a chain",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const filteredChains = chains.filter(chain =>
    chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chain.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: 'rgba(17,7,12,0.7)' }}
        onClick={handleClose}
      />
      {/* Modal container */}
      <div
        className={`rounded-lg shadow-lg z-10 w-80 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{ backgroundColor: 'var(--secondary)' }}
      >
        <div className="sticky top-0 z-20 p-4 border-b" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--divider)' }}>
          <div className="flex items-center">
            <button onClick={handleClose} className="mr-2 focus:outline-none">
              <svg className="w-6 h-6 transition-colors duration-200 hover:text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>{title}</h2>
          </div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search chain..."
              className="w-full p-2 rounded-lg outline-none transition-colors duration-200"
              style={{ backgroundColor: 'var(--accent-2)', color: 'var(--primary)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          {filteredChains.map((chain) => (
            <div
              key={chain.id}
              className="flex items-center p-4 cursor-pointer transition-colors duration-200 hover:bg-[var(--accent)]"
              style={{ borderBottom: '1px solid var(--divider)' }}
              onClick={() => onSelect(chain)}
            >
              {chain.icon && <img src={chain.icon} alt={chain.name} className="w-8 h-8 mr-3" />}
              <div className="font-medium" style={{ color: 'var(--primary)' }}>{chain.name}</div>
            </div>
          ))}
          {filteredChains.length === 0 && (
            <div className="p-4 text-center" style={{ color: 'var(--primary)' }}>No chains found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChainModal;
