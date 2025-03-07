import { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { getUserBalance } from '../api/common';
const useFetchBalance = (token, chain, token2, chain2) => {
    const [userBalance, setUserBalance] = useState(null);
    const [userBalance2, setUserBalance2] = useState(null);
    const { wallets } = useWallets();
    useEffect(() => {
        async function fetchBalance() {
            console.log("fetching balance", wallets, token);
            if (wallets.length > 0) {
                const balance = await getUserBalance(wallets[0], wallets[0].address, token.address, chain);
                console.log("balance", balance, token, chain);
                setUserBalance(balance);
                const balance2 = await getUserBalance(wallets[0], wallets[0].address, token2.address, chain2, chain);
                console.log("balance", balance2, token2, chain2);
                setUserBalance2(balance2);
            }
        }
        // Fetch every 15 seconds
        setUserBalance(null);
        setUserBalance2(null);
        fetchBalance();
        const interval = setInterval(() => {
            fetchBalance();
        }, 10000);
        return () => clearInterval(interval);
    }, [token, wallets.length, chain, token2, chain2]);
    return { userBalance, userBalance2 };
};
export default useFetchBalance;
