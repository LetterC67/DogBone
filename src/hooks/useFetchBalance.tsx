import { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { getUserBalance } from '../api/common';

const useFetchBalance = (token: any, chain: any) => {
    const [userBalance, setUserBalance] = useState<string>(null);
    const { wallets } = useWallets();

    useEffect(() => {
        async function fetchBalance() {
            
            console.log("fetching balance", wallets, token);
            
            if (wallets.length > 0) {
                const balance = await getUserBalance(wallets[0], wallets[0].address, token.address, chain);
                console.log("balance", balance);
                setUserBalance(balance);
            }
        }
        
        // Fetch every 15 seconds
        
        setUserBalance(null);
        fetchBalance();
        const interval = setInterval(() => {
            fetchBalance();
        }, 10000);

        return () => clearInterval(interval);
    }, [token, wallets.length, chain]);

    return {userBalance};
};

export default useFetchBalance;
