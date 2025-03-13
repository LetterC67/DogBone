// src/TokenModal.tsx
import React, { useState, useEffect } from 'react';
import { Token } from './types';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

interface TokenModalProps {
	tokens: Token[];
	onSelect: (token: Token) => void;
	onClose: () => void;
	title?: string;
}

const TokenModal: React.FC<TokenModalProps> = ({
	tokens,
	onSelect,
	onClose,
	title = 'Select a token',
}) => {
const [searchQuery, setSearchQuery] = useState('');
const [isVisible, setIsVisible] = useState(false);

useEffect(() => { setIsVisible(true); }, []);

const handleClose = () => {
	setIsVisible(false);
	setTimeout(() => onClose(), 300);
};

const filteredTokens = tokens.filter(
	(token) =>
	token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
	token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
	<div className="fixed inset-0 flex items-center justify-center z-50">
	<div
		className={`absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
		style={{ backgroundColor: 'rgba(17,7,12,0.7)' }}
		onClick={handleClose}
	/>
	<div
		className={`rounded-lg shadow-lg z-10 w-120 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
			placeholder={t('search_token')}
			className="w-full p-2 rounded-lg outline-none transition-colors duration-200"
			style={{ backgroundColor: 'var(--accent-3)', color: 'var(--primary)' }}
			value={searchQuery}
			onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</div>
		</div>
		<div>
		{filteredTokens.map((token) => (
			<div
			key={token.address}
			className="token-list-item flex items-center p-4 cursor-pointer transition-colors duration-200"
			style={{ borderBottom: '1px solid var(--divider)' }}
			onClick={() => onSelect(token)}
			>
			{token.logoURI && <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 mr-3" />}
			<div>
				<div className="font-medium" style={{ color: 'var(--primary)' }}>{token.name}</div>
				<div className="text-sm" style={{ color: 'var(--less-highlight)' }}>{token.symbol}</div>
			</div>
			</div>
		))}
		{filteredTokens.length === 0 && (
			<div className="p-4 text-center" style={{ color: 'var(--primary)' }}>{t('no_token')}</div>
		)}
		</div>
	</div>
	</div>
);
};

export default TokenModal;
