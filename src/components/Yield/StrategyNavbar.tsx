import React, { useState } from 'react';
import { useControl } from '../../context/ControlContext';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function NavbarTab({ title, active, onClick }: { title: string; active: string; onClick: (title: string) => void }) {
    const { t } = useTranslation();
    return (
        <div className={`p-2 ${active == title ? 'bg-(--highlight) text-(--background)' : 'bg-(--accent) text-(--disabled)'} rounded-t-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1`} onClick={() => onClick(title)}>
            <div>
                {t(title.toLowerCase())}
            </div>
        </div>
    );
}

function StrategyNavbar() {
    const { strategyTab, setStrategyTab } = useControl();

    return (
        <div className="flex flex-row gap-2 self-start">
            <NavbarTab title="Deposit" active={strategyTab} onClick={() => setStrategyTab("Deposit")}/>
            <NavbarTab title="Withdraw" active={strategyTab} onClick={() => setStrategyTab("Withdraw")} />
        </div>
    );
}

export default StrategyNavbar;