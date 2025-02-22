import Navbar from './Navbar';
import YieldTable from './YieldTable';
import Deposit from './Deposit';
import { useControl } from '../../context/ControlContext';

function Yield() {
    const {isInStrategyTab} = useControl();

    return (
        <>
            {isInStrategyTab && <Deposit />}
            {!isInStrategyTab && 
                <div className="w-full h-full flex flex-col items-center justify-center">
                    {/* <div className='w-3/5 pl-6'>
                        <Navbar />  
                    </div> */}
                    <div className="h-4/5 w-7/10 bg-(--secondary) rounded-lg  border-2 border-(--divider)">
                        <YieldTable />
                    </div>
                </div>
            }
        </>
    )
}

export default Yield;