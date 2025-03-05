import tokenList from "../tools/tokenList.json";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
// import {sampleToTokens} from "../data/sonicTokens";

const sonicTokens = tokenList.tokens.filter((token) => token.chainId === 146);

function usePortfolio() {
    const { tokenPriceSonic, tokenBalanceSonic, strategyList, depositedSonic } = useData();
    const [totalBalance, setTotalBalance] = useState(0);
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [ready, setReady] = useState(false);

    function totalDeposited(token: any) {
        return strategyList.reduce((acc, strategy) => {
            if (strategy.token.address === token.address) {
                return acc + Number(depositedSonic[strategy.name]);
            }
            return acc;
        }, 0);
    }

    function isEmpty(dict: {}) {
        return Object.keys(dict).length === 0;
    }

    useEffect(() => {
        console.log(isEmpty(tokenPriceSonic), tokenBalanceSonic, strategyList.length, isEmpty(depositedSonic));

        console.log(depositedSonic);

        if (!(!isEmpty(tokenPriceSonic) && tokenBalanceSonic && strategyList.length > 0 && !isEmpty(depositedSonic))) {
            return;
        }


        console.log("deposited ", depositedSonic);

        let valid = true;

        setPortfolio([]);
        let total = 0;

    
        for (const token of sonicTokens) {
            const balance = tokenBalanceSonic[token.symbol];
            let price;

            try {
                price = tokenPriceSonic[token.symbol];
            } catch {
                console.log("Price not found for ", token.symbol);
            }

            
            const deposited = totalDeposited(token);
            console.log(deposited, token.symbol, price, token.address);
            
            if ((balance != '0' || deposited) && price) {
                if (!valid) return;
                setPortfolio((prev) => [
                    ...prev,
                    {
                        token: token,
                        amount_usd: (parseFloat(balance) + parseFloat(deposited)) * parseFloat(price),
                        price: price,
                        deposited: deposited,
                        balance: balance,
                    },
                ]);
                total += (parseFloat(balance) + parseFloat(deposited)) * parseFloat(price);
            }

        }
        if (!valid) return;
        setTotalBalance(total);
        
        setReady(true);

        return () => {
            valid = false;
        }
    }, [tokenPriceSonic, tokenBalanceSonic, strategyList, depositedSonic]);
    return {portfolio, totalBalance, ready, tokenPriceSonic, tokenBalanceSonic, depositedSonic};
}

export default usePortfolio;