import CustomDropdown from "./CustomDropdown";
import { useEffect, useState } from "react";
import APR from "./APR";
import { useData } from "../../context/DataContext";
import { useControl } from "../../context/ControlContext";
import { useTranslation } from 'react-i18next';

function YieldTable() {
    const {strategyList, tokenPriceSonic, depositedSonic} = useData();
    const { setStrategy, setIsInStrategyTab, showOnlyDeposited, setShowOnlyDeposited, filteredStrategies, setFilteredStrategies, selectedTokens, setSelectedTokens, allTokens} = useControl();

    const { t } = useTranslation();
    

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
                            {t('show_only_deposited')}
                        </div>
                    </div>
                </div>

                {strategyList.length != 0 && <table className="w-full border-collapse">
                    <thead className="self-start border-t-1 border-b-1  border-(--divider) text-(--highlight)">
                        <tr >
                            <th className="text-left py-2 pl-6 pr-2 w-1/4">{t('token')}</th>
                            <th className="text-left w-1/3">{t('strategy/provider')}</th>
                            <th className="text-right">APY</th>
                            <th className="text-right px-6">{t('deposited')}</th>
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
                                        <img className="rounded-full" src={element.provider.img} alt={element.token?.name} width="36" height="36" />
                                        <div className="flex flex-col">
                                            <span className="text-lg">
                                                {element.name}
                                            </span>
                                            <span className="text-sm text-(--highlight) font-light flex flex-row gap-1">
                                                {element.provider.full_name} 
                                                <span>
                                                    {(element.risk == 'low') && <span className="text-(--success) bg-[#2E4435] text-[#A7D7AC] px-1 rounded-full"> {t('low_risk')}</span>}
                                                    {(element.risk == 'medium') && <span className="text-(--highlight) bg-[#5A4A2F] text-[#E3D7A4] px-1 rounded-full"> {t('medium_risk')}</span>}
                                                    {(element.risk == 'high') && <span className="text-(--error) bg-[#5A2E30] text-[#E7A6A9] px-1 rounded-full"> {t('high_risk')} </span>}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="">
                                    <span className="flex flex-row-reverse justify-content items-center gap-1">
                                        <APR strategyApr={element.apr} pointApr={element.point_apr}></APR>
                                        {(element.apr + element.point_apr).toFixed(2)}% 
                                    </span>
                                </td>

                                <td className="px-6">
                                    <span className="flex flex-row-reverse justify-content items-center gap-1">
                                        <div className="flex flex-row items-center gap-2">
                                            <div className="flex flex-col">
                                                <span className="text-lg flex flex-row-reverse">
                                                    {depositedSonic[element.name] ? parseFloat(depositedSonic[element.name]).toFixed(6) : '-'}
                                                </span>
                                                <span className="text-sm text-(--highlight) font-light flex flex-row-reverse">
                                                    ~${
                                                    (tokenPriceSonic[element.token.symbol] && depositedSonic[element.name])
                                                    ? (parseFloat( depositedSonic[element.name]) * tokenPriceSonic[element.token.symbol]).toFixed(2) : 0
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
                }
            </div>
        </>
    )
}

export default YieldTable;