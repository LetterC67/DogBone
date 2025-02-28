import CustomDropdown from "./CustomDropdown";
import { useEffect, useState } from "react";
import APR from "./APR";
import { useData } from "../../context/DataContext";
import { useControl } from "../../context/ControlContext";

const Bone = () => {
    return (
        <svg fill="#ECECEC" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 251.67 251.67" xmlSpace="preserve">
<g>
	<path d="M241.867,184.083c-0.05-0.741-0.411-1.255-0.886-1.585c-4.959-20.633-32.401-28.115-46.476-8.522
		C153.32,136.978,118.474,96.548,84.108,53.598c17.788-11.66,17.643-38.745-1.528-49.235c-0.292-0.16-0.561-0.191-0.812-0.173
		c-0.555-0.393-1.08-0.832-1.662-1.181C61.069-8.405,42.891,15.067,48.431,32.97C31.399,24.597,7.806,38.818,9.85,59.259
		c0.444,4.436,2.168,8.457,4.746,11.753c8.182,17.041,30.966,17.027,41.158,2.132c15.117,22.864,31.684,44.824,48.848,66.174
		c15.947,19.836,32.342,43.681,53.278,58.766c-17.677,11.111-16.836,38.808,1.474,50.156c17.185,10.652,41.444-5.223,43.499-24.102
		c0.009,0.003,0.011,0.011,0.019,0.013c9.507,2.917,21.124-3.535,27.737-10.065c0.27-0.266,0.498-0.565,0.759-0.839
		c5.846-5.189,9.462-13.07,10.244-20.853c0.037-0.374-0.001-0.716,0.023-1.085C241.924,188.921,242.032,186.503,241.867,184.083z
		 M234.94,199.515c-0.201,0.517-0.413,1.029-0.638,1.536c-0.265,0.59-0.533,1.175-0.827,1.725c-0.126,0.245-0.267,0.485-0.399,0.728
		c-8.069,13.986-25.649,14.348-35.989,1.44c-0.525-0.655-1.236-0.589-1.763-0.197c-1.302-0.007-2.582,0.994-2.038,2.551
		c2.688,7.703,3.84,15.11-0.21,22.646c-4.477,8.331-13.658,12.202-22.826,10.634c-9.449-1.615-16.436-8.908-17.372-18.56
		c-1.069-11.035,5.696-17.536,13.776-23.674c0.523-0.397,0.725-0.921,0.734-1.43c1.883,1.608,4.461-1.1,2.76-3.023
		c-38.459-43.504-75.986-88.096-114.855-131.198c-0.567-0.628-1.416-0.494-1.979-0.034c-0.474-0.906-1.912-1.166-2.185,0.089
		C48.778,73.52,32.685,77.254,23.908,72.92c-7.616-3.76-10.911-13.011-8.769-21.003c4.206-15.7,23.886-21.731,36.16-11.38
		c2.247,1.895,5.449-1.166,3.277-3.277c-0.313-0.304-0.661-0.522-0.984-0.804c-1.932-5.142-3.069-10.394-1.575-15.961
		c2.476-9.23,11.44-17.028,21.235-14.898c7.555,1.643,13.346,8.817,15.323,16.129c1.001,3.704,1.073,7.415,0.004,11.115
		c-0.704,2.438-5.677,13.013-9.987,10.849c-0.909-0.456-1.763-0.282-2.419,0.168c-1.182-0.72-2.958,0.873-2.11,2.227
		c15.131,24.178,33.657,46.538,52.646,67.758c9.487,10.601,19.28,20.928,29.379,30.949c6.879,6.825,18.43,21.524,28.73,27.236
		c1.741,3.491,4.718,5.992,8.313,7.626c1.076,0.49,2.019-0.037,2.401-0.823c0.294-0.218,0.556-0.484,0.735-0.815
		c0.701-0.024,1.4-0.31,1.898-1.04c6.297-9.227,17.979-13.281,28.154-7.501C237.016,175.551,239.046,188.78,234.94,199.515z"/>
</g>
</svg>
    )
}

function YieldTable() {
    const {strategyList, tokenPriceSonic} = useData();
    const { setStrategy, setIsInStrategyTab, showOnlyDeposited, setShowOnlyDeposited, filteredStrategies, setFilteredStrategies, selectedTokens, setSelectedTokens, allTokens} = useControl();


    

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
                {strategyList.length == 0 && <div className="flex flex-col items-center justify-center h-3/4">
                    
                    <div className="flex flex-col items-center gap-4 text-4xl color-(--primary)">
                        <div className="loading-container w-50 h-50 mb-10">
                            <div className="spinning-bone w-50 h-50" >
                                <Bone/>
                            </div>
                        </div>
                        <p>Fetching your bones...</p>
                        <p>Just a moment, we're digging deep!</p>

                    </div>

                </div>
                }

                {strategyList.length != 0 && <table className="w-full border-collapse">
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
                                        <img className="rounded-full" src={element.provider.img} alt={element.token?.name} width="36" height="36" />
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
                                        <APR strategyApr={element.apr} pointApr={element.point_apr}></APR>
                                        {(element.apr + element.point_apr).toFixed(2)}% 
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
                                                    ~${
                                                    element.position == 0 ? 
                                                    '0' 
                                                    : 
                                                    tokenPriceSonic[element.token.symbol] 
                                                    ? (parseFloat(element.position) * tokenPriceSonic[element.token.symbol]).toFixed(3) : 0
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