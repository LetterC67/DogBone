import Navbar from './Navbar';
import YieldTable from './YieldTable';

function Yield() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className='w-3/5 pl-6'>
                <Navbar />  
            </div>
            <div className="h-2/3 w-3/5 bg-(--secondary) rounded-lg  border-2 border-(--divider)">
                <YieldTable />
            </div>
        </div>
    )
}

export default Yield;