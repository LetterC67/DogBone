import tokenList from "../tools/tokenList.json";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
// import {sampleToTokens} from "../data/sonicTokens";

const sonicTokens = tokenList.tokens.filter((token) => token.chainId === 146);

function usePortfolio() {
    const { tokenPriceSonic, tokenBalanceSonic, strategyList } = useData();
    const [totalBalance, setTotalBalance] = useState(0);
    const [portfolio, setPortfolio] = useState<any[]>([]);

    function totalDeposited(token: any) {
        return strategyList.reduce((acc, strategy) => {
            if (strategy.token.address === token.address) {
                return acc + Number(strategy.position);
            }
            return acc;
        }, 0);
    }

    useEffect(() => {
        if (!(tokenPriceSonic && tokenBalanceSonic && strategyList)) {
            return;
        }

        let valid = true;

        setPortfolio([]);
        let total = 0;

    
        for (const token of sonicTokens) {
            const balance = tokenBalanceSonic[token.address];
            let price;

            try {
                price = tokenPriceSonic[token.symbol];
            } catch {
                console.log("Price not found for ", token.symbol);
            }

            const deposited = totalDeposited(token);
            
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

        console.log("portfolio ", portfolio);

        return () => {
            valid = false;
        }
    }, [tokenPriceSonic, tokenBalanceSonic, strategyList]);
    return {portfolio, totalBalance};
}

export default usePortfolio;