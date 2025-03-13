import {useState} from 'react';
import { HiInformationCircle } from "react-icons/hi";
import { useTranslation } from 'react-i18next';

function APR({strategyApr, pointApr}: {strategyApr: string | number, pointApr: string | number}) {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const {t } = useTranslation();

    return (
        
            <div className='relative'>
                <HiInformationCircle className="text-(--higherlight) hover:text-(--less-highlight) transition duration-300 hover:cursor-pointer" 
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                ></HiInformationCircle>
                { isHovering && 
                    <div className="absolute rounded-xl translate-x-5 -translate-y-1/2 mt-2 w-54 p-2 bg-(--accent-2) text-white rounded shadow-lg">

                        <div>
                            <span>{t('strategy_apr')}: {strategyApr.toFixed(2)}%</span>
                        </div>
                        <div>
                            <span>{t('points_apr')}: {pointApr.toFixed(2)}%</span>
                        </div>
                    </div>
                }

            </div>
    );
}

export default APR;