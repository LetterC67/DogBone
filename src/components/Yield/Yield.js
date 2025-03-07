import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Navigator from '../Navigator';
import YieldTable from './YieldTable';
import Deposit from './Deposit';
import { useControl } from '../../context/ControlContext';
function Yield() {
    const { isInStrategyTab } = useControl();
    return (_jsxs(_Fragment, { children: [_jsx(Navigator, {}), isInStrategyTab && _jsx(Deposit, {}), !isInStrategyTab &&
                _jsx("div", { className: "w-full h-full flex flex-col items-center justify-center", children: _jsx("div", { className: "h-4/5 w-7/10 bg-(--secondary) rounded-lg  border-2 border-(--divider)", children: _jsx(YieldTable, {}) }) })] }));
}
export default Yield;
