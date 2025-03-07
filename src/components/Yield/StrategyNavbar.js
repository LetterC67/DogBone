import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useControl } from '../../context/ControlContext';
function NavbarTab({ title, active, onClick }) {
    return (_jsx("div", { className: `p-2 ${active == title ? 'bg-(--highlight) text-(--background)' : 'bg-(--accent) text-(--disabled)'} rounded-t-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1`, onClick: () => onClick(title), children: _jsx("div", { children: title }) }));
}
function StrategyNavbar() {
    const { strategyTab, setStrategyTab } = useControl();
    return (_jsxs("div", { className: "flex flex-row gap-2 self-start", children: [_jsx(NavbarTab, { title: "Deposit", active: strategyTab, onClick: () => setStrategyTab("Deposit") }), _jsx(NavbarTab, { title: "Withdraw", active: strategyTab, onClick: () => setStrategyTab("Withdraw") })] }));
}
export default StrategyNavbar;
