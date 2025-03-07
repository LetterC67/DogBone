import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
function SidebarContent({ text, active, setActive, to }) {
    const location = useLocation();
    return (_jsx(Link, { to: to, children: _jsx("div", { className: `p-2 ${location.pathname == to ? 'bg-(--accent)' : ''} rounded-md hover:text-(--focus) transition duration-300 ease-in-out hover:cursor-pointer`, onClick: () => setActive(text), children: _jsx("div", { children: text }) }) }));
}
;
export default SidebarContent;
