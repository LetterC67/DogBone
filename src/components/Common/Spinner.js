import { jsx as _jsx } from "react/jsx-runtime";
const Spinner = () => {
    return (_jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "w-6 h-6 border-2 border-(--accent-3) border-t-(--highlight) rounded-full animate-spin" }) }));
};
export default Spinner;
