// src/FromTokenModal.tsx
import React, { useState, useEffect } from "react";
import { Token, Chain } from "./types";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useTranslation } from "react-i18next";

interface FromTokenModalProps {
currentChain: string;
availableChains: Chain[];
sampleTokens: { [chainId: string]: Token[] };
onSelect: (token: Token, chainId: string) => void;
onClose: () => void;
title?: string;
}

const FromTokenModal: React.FC<FromTokenModalProps> = ({
currentChain,
availableChains,
sampleTokens,
onSelect,
onClose,
title = "Select source chain and token",
}) => {
	const [selectedChain, setSelectedChain] = useState(currentChain);
	const [searchQuery, setSearchQuery] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		setIsVisible(true);
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onClose(), 300);
	};

	const tokensForChain = sampleTokens[selectedChain] || [];
	
	const filteredTokens = tokensForChain.filter(
		(token) =>
		token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
	);

return (
	<div className="fixed inset-0 flex items-center justify-center z-50">
	{/* Overlay */}
	<div
		className={`absolute inset-0 transition-opacity duration-300 ${
		isVisible ? "opacity-100" : "opacity-0"
		}`}
		style={{ backgroundColor: "rgba(17,7,12,0.7)" }}
		onClick={handleClose}
	/>
	{/* Modal container */}
	<div
		className={`rounded-lg shadow-lg z-10 w-120 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out ${
		isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
		}`}
		style={{ backgroundColor: "var(--secondary)" }}
	>
		{/* Header with back arrow, title, and chain selector */}
		<div
		className="sticky top-0 z-20 p-4 border-b"
		style={{ backgroundColor: "var(--secondary)", borderColor: "var(--divider)" }}
		>
		<div className="flex items-center">
			<button onClick={handleClose} className="mr-2 focus:outline-none">
			<svg
				className="w-6 h-6 transition-colors duration-200 hover:text-[var(--primary)]"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				style={{ color: "var(--primary)" }}
			>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
			</svg>
			</button>
			<h2 className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
			{title}
			</h2>
		</div>
		{/* Chain selection buttons */}
		<div className="mt-2">
			<div className="flex flex-wrap gap-2">
			{availableChains.map((chain) => (
				<button
				key={chain.id}
				onClick={() => setSelectedChain(chain.id)}
				className={`flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200 ${
					selectedChain === chain.id
					? "bg-[var(--accent-2)]"
					: "bg-transparent hover:bg-[var(--accent-2)]"
				}
				border-(--divider) border
				`}
				>
				{chain.icon && <img src={chain.icon} alt={chain.name} className="w-6 h-6" />}
				<span style={{ color: "var(--primary)" }}>{chain.name}</span>
				</button>
			))}
			</div>
		</div>
		{/* Search input */}
		<div className="mt-4">
			<input
			type="text"
			placeholder={t("search_token")}
			className="w-full p-2 rounded-lg outline-none transition-colors duration-200"
			style={{ backgroundColor: "var(--accent-3)", color: "var(--primary)" }}
			value={searchQuery}
			onChange={(e) => setSearchQuery(e.target.value)}
			/>
		</div>
		</div>
		{/* Token List */}
		{filteredTokens.length > 0 ? (
			<List
				height={Math.min(filteredTokens.length * 64, 400)} // Adjust 64 if your item height changes; max height is 400px
				itemCount={filteredTokens.length}
				itemSize={64} // Fixed height for each item
				width="100%"
			>
				{({ index, style }: ListChildComponentProps) => {
				const token = filteredTokens[index];
				return (
					<div
					key={token.address}
					style={{ ...style, borderBottom: "1px solid var(--divider)" }}
					className="token-list-item flex items-center p-4 cursor-pointer transition-colors duration-200"
					onClick={() => onSelect(token, selectedChain)}
					>
					{token.logoURI && (
						<img src={token.logoURI} alt={token.symbol} className="w-8 h-8 mr-3" loading="lazy" />
					)}
					{!token.logoURI && (
						<img src="https://sonicscan.org/assets/sonic/images/svg/empty-token.svg?v=25.2.1.0" alt={token.symbol} className="w-8 h-8 mr-3" loading="lazy" />
					)}
					<div>
						<div className="font-medium" style={{ color: "var(--primary)" }}>
						{token.name}
						</div>
						<div className="text-sm" style={{ color: "var(--less-highlight)" }}>
						{token.symbol}
						</div>
					</div>
					</div>
				);
				}}
			</List>
			) : (
			<div className="p-4 text-center" style={{ color: "var(--primary)" }}>
				{t("no_tokens_found")}
			</div>
			)}
	</div>
	</div>
);
};

export default FromTokenModal;
