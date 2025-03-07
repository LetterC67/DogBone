import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import { sonic, mainnet, polygon, base, arbitrum } from "viem/chains";
createRoot(document.getElementById('root')).render(
// <StrictMode>
_jsx(PrivyProvider, { appId: "cm6xon0se016t1ko0g21g92qa", config: {
        loginMethods: ['email', 'wallet'],
        appearance: {
            theme: 'dark',
            accentColor: '#472F3D',
            logo: '/dogbone.png',
        },
        defaultChain: sonic,
        supportedChains: [sonic, mainnet, polygon, base, arbitrum],
        embeddedWallets: {
            createOnLogin: 'users-without-wallets',
        },
    }, children: _jsx(App, {}) })
// </StrictMode>
);
