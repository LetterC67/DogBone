import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { HiInformationCircle } from "react-icons/hi";
function APR({ strategyApr, pointApr }) {
    const [isHovering, setIsHovering] = useState(false);
    return (_jsxs("div", { className: 'relative', children: [_jsx(HiInformationCircle, { className: "text-(--higherlight) hover:text-(--less-highlight) transition duration-300 hover:cursor-pointer", onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false) }), isHovering &&
                _jsxs("div", { className: "absolute rounded-xl translate-x-5 -translate-y-1/2 mt-2 w-54 p-2 bg-(--accent-2) text-white rounded shadow-lg", children: [_jsx("div", { children: _jsxs("span", { children: ["Strategy APR: ", strategyApr.toFixed(2), "%"] }) }), _jsx("div", { children: _jsxs("span", { children: ["Points APR: ", pointApr.toFixed(2), "%"] }) })] })] }));
}
export default APR;
