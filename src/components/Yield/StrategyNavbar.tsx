import React, { useState } from 'react';
import { useControl } from '../../context/ControlContext';

function NavbarTab({ title, active, onClick }: { title: string; active: string; onClick: (title: string) => void }) {
    return (
        <div className={`p-2 ${active == title ? 'bg-(--highlight) text-(--background)' : 'bg-(--accent) text-(--disabled)'} rounded-t-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1`} onClick={() => onClick(title)}>
            <div>
                {title}
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