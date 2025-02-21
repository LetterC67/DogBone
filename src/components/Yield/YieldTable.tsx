import CustomDropdown from "./CustomDropdown";
import { useEffect, useState } from "react";
import APR from "./APR";
import { useData } from "../../context/DataContext";
import { useControl } from "../../context/ControlContext";

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
    const [filteredStrategies, setFilteredStrategies] = useState<any[]>([]);
    const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
    const {strategyList, tokenPriceSonic} = useData();
    const { setStrategy, setIsInStrategyTab, showOnlyDeposited, setShowOnlyDeposited } = useControl();

    useEffect(() => {
        for (const strategy of strategyList) {
            setAllTokens((prev) => [...prev, strategy.token]);
        }

        // Unique values
        setAllTokens((prev) => [...new Set(prev)]);
    }, [strategyList]);

    useEffect(() => {
        if (selectedTokens.length != 0) {
            setFilteredStrategies(strategyList.filter((strategy) => selectedTokens.includes(strategy.token.symbol)));
        } else {
            setFilteredStrategies(strategyList);
        }

        // console.log(showOnlyDeposited);
        if (showOnlyDeposited) {
            setFilteredStrategies((prev) => prev.filter((strategy) => strategy.position != 0));
        }
    }, [selectedTokens, showOnlyDeposited]);

    useEffect(() => {
        setFilteredStrategies(strategyList);
        const _tokens = [];

        if (showOnlyDeposited) {
            setFilteredStrategies((prev) => prev.filter((strategy) => strategy.position != 0));
        }

        for (const strategy of strategyList) {
            _tokens.push(strategy.token);
        }

        setAllTokens([...new Set(_tokens)]);
    }, [strategyList]);

    function selectStrategy(strategy: any) {
        setStrategy(strategy);
        setIsInStrategyTab(true);
    }

    return (
        <>
            {/* {JSON.stringify(strategyList[0])} */}
            <div  className="overflow-y-scroll w-full h-full">
                <div className="flex flex-row gap-8 h-15">
                    <CustomDropdown tokens={allTokens} selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens}></CustomDropdown>
                    <div className="flex flex-row h-full relative items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlyDeposited}
                            onChange={() => setShowOnlyDeposited(!showOnlyDeposited)}
                            className="form-checkbox h-6 w-6 !accent-[var(--highlight)]
                                    !focus:ring-[var(--focus)] rounded-full"
                        />
                        <div className="text-(--highlight)">
                            Show only deposited
                        </div>
                    </div>
                </div>
                <table className="w-full border-collapse">
                    <thead className="self-start border-t-1 border-b-1  border-(--divider) text-(--highlight)">
                        <tr >
                            <th className="text-left py-2 pl-6 pr-2 w-1/4">Token</th>
                            <th className="text-left w-1/3">Strategy / Provider</th>
                            <th className="text-right">Nett APR</th>
                            <th className="text-right px-6">Deposited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStrategies && filteredStrategies.map((element) => (
                            <tr style={{fontFamily:'Kanit'}} className="text-lg border-t-1 border-b-1  border-(--divider) hover:cursor-pointer hover:bg-(--accent) transition"  onClick={() => selectStrategy(element)}>
                                <td className=" gap-2 py-4 pl-6 content-center h-full">
                                    <div className="flex flex-row items-center gap-2">
                                        <img src={element.token?.logoURI} alt={element.token?.name} width="36" height="36" />
                                        <div className="flex flex-col">
                                            <span className="text-lg">
                                                {element.token?.symbol}
                                            </span>
                                            <span className="text-sm text-(--highlight) font-light">
                                                {element.token?.name}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-row items-center gap-2 py-4">
                                        <img src={element.provider.img} alt={element.token?.name} width="36" height="36" />
                                        <div className="flex flex-col">
                                            <span className="text-lg">
                                                {element.name}
                                            </span>
                                            <span className="text-sm text-(--highlight) font-light">
                                                {element.provider.full_name}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <span className="flex flex-row-reverse justify-content items-center gap-1">
                                        {element.apr.toFixed(2)}% 
                                        {/* <APR strategyApr={element.strategy_apr} pointApr={element.point_apr}></APR> */}
                                    </span>
                                </td>

                                <td className="px-6">
                                    <span className="flex flex-row-reverse justify-content items-center gap-1">
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-lg flex flex-row-reverse">
                                                    {element.position == 0 ? '0' : parseFloat(element.position).toFixed(4)} 
                                                </span>
                                                <span className="text-sm text-(--highlight) font-light">
                                                    ~${element.position == 0 ? '0' : (parseFloat(element.position) * tokenPriceSonic[element.token.address] ? tokenPriceSonic[element.token.address] : 0).toFixed(3)
                                                    } 
                                                </span>
                                            </div>
                                        </div>
                                        
                                    </span>
                                </td>
                                {/* <td>{element.name}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default YieldTable;