import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {PrivyProvider} from '@privy-io/react-auth';
import App from './App.tsx'
import { sonic } from "viem/chains"

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PrivyProvider
		appId="cm6xon0se016t1ko0g21g92qa"
		config={{
			loginMethods: ['email', 'wallet'],
			appearance: {
				theme: 'dark',
				accentColor: '#472F3D',
				logo: 'https://your-logo-url',
			},
			supportedChains: [sonic],
			embeddedWallets: {
				createOnLogin: 'users-without-wallets',
			},
		}}
		>
			<App />
		</PrivyProvider>
	</StrictMode>,
)
