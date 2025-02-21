import {useState} from 'react';
import { HiInformationCircle } from "react-icons/hi";


function APR({strategyApr, pointApr}: {strategyApr: string | number, pointApr: string | number}) {
    const [isHovering, setIsHovering] = useState<boolean>(false);

    return (
        <div>
            <HiInformationCircle className="text-(--higherlight) hover:text-(--less-highlight) transition duration-300 hover:cursor-pointer" 
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            ></HiInformationCircle>

            { isHovering && 
                <div className="absolute translate-x-5 -translate-y-1/2 mt-2 w-48 p-2 bg-(--accent-2) text-white rounded shadow-lg">

                    <div>
                        <span>Strategy APR: {strategyApr}</span>
                    </div>
                    <div>
                        <span>Points APR: {pointApr}</span>
                    </div>
                </div>
            }
        </div>
    );
}

export default APR;