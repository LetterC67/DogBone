import { useLocation, useNavigate } from 'react-router-dom';
import { useAgent } from '../context/AgentContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function Navigator() {
    const {currentNavigation, setCurrentNavigation} = useAgent();
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    useEffect(() => {
        if ((currentNavigation == 'swap' && location.pathname != '/swap') || 
            (currentNavigation == 'bridge' && location.pathname != '/bridge') ||
            (currentNavigation == 'yield' && location.pathname != '/yield') 
        ) {
            toast.info(t('navigate_to') + ' ' + t(currentNavigation) + ' ' + t('in_3_seconds'), {
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
                if (currentNavigation == 'swap')
                    navigate('/swap');
                else if (currentNavigation == 'bridge')
                    navigate('/bridge');
                else if (currentNavigation == 'yield')
                    navigate('/yield');
                setCurrentNavigation('');
            }, 3000);
        } else if (location.pathname == '/swap' || location.pathname == '/bridge' || location.pathname == '/yield') {
            setCurrentNavigation('');
        }
    }, [currentNavigation, setCurrentNavigation]);

    return null;
}

export default Navigator;