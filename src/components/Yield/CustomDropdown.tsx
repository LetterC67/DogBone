import React, { useState, useRef, useEffect } from "react";

export default function TokenDropdown({tokens, selectedTokens, setSelectedTokens}: {tokens: any[], selectedTokens: any[], setSelectedTokens: any}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
  
    // A ref to the dropdown container, so we can detect clicks outside
    const dropdownRef = useRef(null);
  
    // Close dropdown if user clicks outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
            dropdownRef.current &&
            !(dropdownRef.current as HTMLElement).contains(event.target as Node)
            ) {
            setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
  
    const toggleDropdown = () => setIsOpen((prev) => !prev);
  
    const handleSelect = (tokenValue: string) => {
      setSelectedTokens((prev: any) =>
        prev.includes(tokenValue)
          ? prev.filter((val: any) => val !== tokenValue) // uncheck
          : [...prev, tokenValue] // check
      );
    };
  
    // Filter tokens by searchTerm
    const filteredTokens = tokens.filter((t) =>
        t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
        <div className="ml-2 relative w-96 p-2" ref={dropdownRef}>
            {/* Dropdown trigger */}
            <div
            onClick={toggleDropdown}
            className="border border-[var(--divider)] rounded-xl px-3 py-2 
                        cursor-pointer bg-[var(--active)] text-[var(--higherlight)]"
            >
                {selectedTokens.length === 0
                    ? "Filter token(s)..."
                    : selectedTokens.join(", ")}
            </div>
    
            {/* Dropdown menu */}
            {isOpen && (
            <div
                className={`p-2 h-96 absolute left-0 top-full mt-1 w-full border-2 border-[var(--divider)] 
                rounded-xl shadow-lg bg-[var(--secondary)] animate-fadeIn  overflow-scroll`}
            >
                {/* Search box */}
                <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 text-[var(--primary)] 
                            bg-[var(--background)] outline-none rounded-xl"
                />
    
                {/* Token list */}
                <div className="w-full h-full">
                {filteredTokens.map((token) => {
                    const isSelected = selectedTokens.includes(token.symbol);
                    return (
                        <label
                        key={token.value}
                        className={`flex items-center px-2 py-2 cursor-pointer 
                            flex justify-between
                            `}
                        >
                            <div className="flex items-center">
                                <img
                                    src={token.logoURI}
                                    alt={token.name}
                                    className="w-10 h-10 ml-2 mr-2"
                                />
                                <div>
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="text-lg">
                                        {token.symbol}
                                        </span>
                                    </div>
                                    <small className="text-[var(--highlight)] text-md">
                                    {token.name}
                                    </small>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelect(token.symbol)}
                                className="form-checkbox h-5 w-5 !accent-[var(--highlight)]
                                        !focus:ring-[var(--focus)] rounded-full"
                            />
                        </label>
                    );
                })}
                </div>
            </div>
            )}
        </div>
    );
  }