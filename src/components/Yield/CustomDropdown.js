import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
export default function TokenDropdown({ tokens, selectedTokens, setSelectedTokens }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    // A ref to the dropdown container, so we can detect clicks outside
    const dropdownRef = useRef(null);
    // Close dropdown if user clicks outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const handleSelect = (tokenValue) => {
        setSelectedTokens((prev) => prev.includes(tokenValue)
            ? prev.filter((val) => val !== tokenValue) // uncheck
            : [...prev, tokenValue] // check
        );
    };
    // Filter tokens by searchTerm
    const filteredTokens = tokens.filter((t) => t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "ml-2 relative w-96 p-2", ref: dropdownRef, children: [_jsx("div", { onClick: toggleDropdown, className: "border border-[var(--divider)] rounded-xl px-3 py-2 \n                        cursor-pointer bg-[var(--active)] text-[var(--higherlight)]", children: selectedTokens.length === 0
                    ? "Filter token(s)..."
                    : selectedTokens.join(", ") }), isOpen && (_jsxs("div", { className: `p-2 h-96 absolute left-0 top-full mt-1 w-full border-2 border-[var(--divider)] 
                rounded-xl shadow-lg bg-[var(--secondary)] animate-fadeIn  overflow-scroll`, children: [_jsx("input", { type: "text", placeholder: "Search...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full p-2 text-[var(--primary)] \n                            bg-[var(--background)] outline-none rounded-xl" }), _jsx("div", { className: "w-full h-full", children: filteredTokens.map((token) => {
                            const isSelected = selectedTokens.includes(token.symbol);
                            return (_jsxs("label", { className: `flex items-center px-2 py-2 cursor-pointer 
                            flex justify-between
                            `, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: token.logoURI, alt: token.name, className: "w-10 h-10 ml-2 mr-2" }), _jsxs("div", { children: [_jsx("div", { className: "flex flex-row items-center gap-2", children: _jsx("span", { className: "text-lg", children: token.symbol }) }), _jsx("small", { className: "text-[var(--highlight)] text-md", children: token.name })] })] }), _jsx("input", { type: "checkbox", checked: isSelected, onChange: () => handleSelect(token.symbol), className: "form-checkbox h-5 w-5 !accent-[var(--highlight)]\n                                        !focus:ring-[var(--focus)] rounded-full" })] }, token.value));
                        }) })] }))] }));
}
