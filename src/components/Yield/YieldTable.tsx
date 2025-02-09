import CustomDropdown from "./CustomDropdown";
import { useEffect, useState } from "react";

// Random Token Data
const tokens = {
    "WETH": {
        "name": "Wrapped Ethereum",
        "ticker": "WETH",
        "image_url": "https://assets-cdn.trustwallet.com/blockchains/smartchain/assets/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png",
    },
    "BTC": {
        "name": "Bitcoin",
        "ticker": "BTC",
        "image_url": "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040",
    },
    "USDT": {
        "name": "Tether USD",
        "ticker": "USDT",
        "image_url": "https://tokens.pancakeswap.finance/images/symbol/usdt.png",
    }
}

// Random Strategy Data
const strategies = [
    {
        "token": tokens["WETH"],
        "name": "DogBone",
        "apr": "10%",
        "strategy_apr": "10.53%",
        "point_apr": "2.38%",
        "tvl": "399.22",
    },
    {
        "token": tokens["BTC"],
        "name": "CatBone",
        "apr": "122.2%",
        "strategy_apr": "10.53%",
        "point_apr": "2.38%",
        "tvl": "39.22",
    },
    {
        "token": tokens["USDT"],
        "name": "CowBone",
        "apr": "10.22%",
        "strategy_apr": "102.53%",
        "point_apr": "22.28%",
        "tvl": "55.12",
    },
]

function YieldTable() {
    const [allTokens, setAllTokens] = useState<any[]>([]);
    const [filteredStrategies, setFilteredStrategies] = useState<any[]>(strategies);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

    useEffect(() => {
        for (const strategy of strategies) {
            setAllTokens((prev) => [...prev, strategy.token]);
        }

        // Unique values
        setAllTokens((prev) => [...new Set(prev)]);
    }, strategies);

    useEffect(() => {
        if (selectedTokens.length != 0) {
            setFilteredStrategies(strategies.filter((strategy) => selectedTokens.includes(strategy.token.ticker)));
        } else {
            setFilteredStrategies(strategies);
        }
    }, [selectedTokens]);

    return (
        <>
            <CustomDropdown tokens={allTokens} selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens}></CustomDropdown>
            <table className="w-full border-collapse">
                <thead className="self-start border-t-1 border-b-1  border-(--divider) text-(--highlight)">
                    <tr>
                        <th className="text-left py-2 pl-6 w-1/4">Token</th>
                        <th className="text-left w-3/20">Strategy</th>
                        <th className="text-left w-3/20">Nett APR</th>
                        <th className="text-left w-3/20">Strategy APR</th>
                        <th className="text-left w-3/20">Points APR</th>
                        <th className="text-left">TVL</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStrategies.map((element) => (
                        <tr style={{fontFamily:'Kanit'}} className="text-lg border-t-1 border-b-1  border-(--divider)" key={element.name}>
                            <td className="flex flex-row items-center gap-2 py-4 pl-6">
                                <img src={element.token.image_url} alt={element.token.name} width="36" height="36" />
                                <div className="flex flex-col">
                                    <span className="text-lg">
                                        {element.token.ticker}
                                    </span>
                                    <span className="text-sm text-(--highlight) font-light">
                                        {element.token.name}
                                    </span>
                                </div>
                            </td>
                            <td>{element.name}</td>
                            <td>{element.apr}</td>
                            <td>{element.strategy_apr}</td>
                            <td>{element.point_apr}</td>
                            <td>{element.tvl}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default YieldTable;