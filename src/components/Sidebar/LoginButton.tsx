import { usePrivy } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';
import usePortfolio from '../../hooks/usePortfolio';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useControl } from '../../context/ControlContext';
import { AiOutlineGlobal } from "react-icons/ai";
import LanguageModal from './LanguageModal';

function LoginButton() {
    const { ready, authenticated, login, user, logout} = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    const { totalBalance } = usePortfolio();
    const { t, i18n} = useTranslation();
  
    const { lang, setLang } = useControl();
    const [modalVisible, setModalVisible] = useState(false);

    const handleLanguageClick = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleLanguageSelect = (selectedLang) => {
        setLang(selectedLang);
        handleCloseModal();
    };

    const [langList] = useState([
        { lang: 'en', name: 'English'},
        { lang: 'vi', name: 'Tiếng Việt' },
        { lang: 'zh', name: '中文' },
        { lang: 'es', name: 'Español' },
        { lang: 'fr', name: 'Français' },
        { lang: 'de', name: 'Deutsch' },
        { lang: 'it', name: 'Italiano' },
        { lang: 'ja', name: '日本語' },
        { lang: 'ko', name: '한국어' },
        { lang: 'pt', name: 'Português' },
        { lang: 'ru', name: 'Русский' },
    ]);

    if (ready && !authenticated) {
        return (
            <div className="flex flex-col gap-2">
                {modalVisible && <LanguageModal
                    visible={modalVisible}
                    langList={langList}
                    onLanguageSelect={handleLanguageSelect}
                    onClose={handleCloseModal}
                    t={t}
                />}
                <div className="flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.2)] hover:cursor-pointer" onClick={() => setModalVisible(true)}>
                <AiOutlineGlobal size={30} />
                    <span className="w-full items-center flex justify-center">
                        {lang.name}
                    </span>
                    {/* <span>{user?.id}</span> */}
                </div>
                <button
                disabled={disableLogin}
                onClick={login}
                className="
                    bg-[var(--accent-2)]
                    text-[var(--primary)]
                    font-[var(--kanit)]
                    px-4 py-2
                    rounded-lg
                    cursor-pointer
                    transition-colors duration-300
                    disabled:bg-[var(--disabled)] disabled:cursor-not-allowed
                    hover:!bg-[#503A47]
                    focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                    w-full
                "
                >
                {t('login')}
                </button>
            </div>
        );
    }

    if (ready && authenticated) {
        return (
            // <div className="flex items-center gap-2 bg-[var(--accent-2)] text-[var(--primary)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md">
            //     <FaWallet  className="text-[var(--primary)]" />
            //     {/* <span>{user?.id}</span> */}
            // </div>

            <div className="flex flex-col gap-2">
                {modalVisible && <LanguageModal
                    visible={modalVisible}
                    langList={langList}
                    onLanguageSelect={handleLanguageSelect}
                    onClose={handleCloseModal}
                    t={t}
                />}
                <div className="flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.2)] hover:cursor-pointer" onClick={() => setModalVisible(true)}>
                <AiOutlineGlobal size={30} />
                    <span className="w-full items-center flex justify-center">
                        {lang.name}
                    </span>
                    {/* <span>{user?.id}</span> */}
                </div>
                <div className="flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.2)]">
                    <FaWallet size={30} />
                    <span className="w-full items-center flex justify-center">
                        ${totalBalance.toFixed(2)}
                    </span>
                    {/* <span>{user?.id}</span> */}
                </div>
                <button
                onClick={logout}
                className="
                    flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md cursor-pointer transition-colors duration-300 hover:!bg-[#503A47] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]
                "
                >
                <span className="w-full items-center flex justify-center">
                    {t('logout')}
                </span>
                </button>
            </div>
        );
    }
}

export default LoginButton;