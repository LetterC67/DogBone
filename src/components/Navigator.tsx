import { useLocation, useNavigate } from 'react-router-dom';
import { useAgent } from '../context/AgentContext';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

function Navigator() {
    const {currentNavigation, setCurrentNavigation} = useAgent();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (currentNavigation == 'swap' && location.pathname != '/swap') {
            toast.info('Navigate to ' + currentNavigation + ' page in 3 seconds', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                navigate('/swap');
                setCurrentNavigation('');
            }, 3000);
        } else if (location.pathname == '/swap') {
            setCurrentNavigation('');
        }
    }, [currentNavigation, setCurrentNavigation]);

    return null;
}

export default Navigator;