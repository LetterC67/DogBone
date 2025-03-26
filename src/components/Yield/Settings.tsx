// src/TokenModal.tsx
import React, { useState, useEffect } from 'react';
import { Token } from './types';
import { useTranslation } from 'react-i18next';
import { useControl } from '../../context/ControlContext';

function Settings({ onClose }: { onClose: () => void }): JSX.Element {
    const [isVisible, setIsVisible] = useState(false);
    const {t } = useTranslation();
    const {slippage, setSlippage} = useControl();

    // Trigger entry animation after mounting
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Trigger exit animation then call onClose after delay
    const handleClose = () => {
        setIsVisible(false);
        if (slippage > 10) {
            setSlippage(10);
        } else if (slippage < 0.1) {
            setSlippage(0.1);
        }
        setTimeout(() => {
        onClose();
        }, 300); // duration matches the CSS transition
    };


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
            className={`rounded-lg shadow-lg z-10 w-110 max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-out p-6 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ backgroundColor: 'var(--secondary)' }}
        >
            {/* Sticky header with back arrow, title, and search input */}
            <div>
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
                    {t('settings')}
                </h2>
            </div>
            <div className="mt-6">
    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--primary)' }}>
        {t('slippageTolerance')}
    </h3>
    
    <div className="flex items-center gap-2">
        <div className="relative flex-1">
            <input
                type="number"
                min="0"
                step="0.1"
                value={slippage}
                onChange={(e) => {
                 
                    setSlippage(e.target.value)
                }}
                className="w-full pl-3 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 focus-[var(--divider)]transition-all"
                style={{
                    backgroundColor: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    color: 'var(--primary)',
                    focusRingColor: 'var(--divider)'
                }}
                placeholder="0.5"
            />
            <span 
                className="absolute right-3 top-2.5"
                style={{ color: 'var(--accent)' }}
            >
                %
            </span>
        </div>
        
        <div className="flex gap-2">
                    {['0.01', '0.1', '0.5', '1'].map((value) => (
                        <button
                            key={value}
                            onClick={() => setSlippage(value)}
                            className={`px-3 py-2 rounded-lg transition-colors hover:cursor-pointer hover:bg-[var(--accent-3)] bg-[var(--accent-2)] ${
                                slippage === value ? 'bg-opacity-30' : 'bg-opacity-10 hover:bg-opacity-20'
                            }`}
                            style={{
                                color: 'var(--primary)'
                            }}
                        >
                            {value}%
                        </button>
                    ))}
                </div>
            </div>
            
            {slippage > 5 && (
                <p className="text-sm mt-2" style={{ color: 'var(--primary)' }}>
                    {t('highSlippageWarning')}
                </p>
            )}
        </div>
        </div>
        </div>
        </div>
    );
};

export default Settings;
