import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePrivy } from '@privy-io/react-auth';
import { FaWallet } from 'react-icons/fa';
import usePortfolio from '../../hooks/usePortfolio';
function LoginButton() {
    const { ready, authenticated, login, user, logout } = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    const { totalBalance } = usePortfolio();
    if (ready && !authenticated) {
        return (_jsx("button", { disabled: disableLogin, onClick: login, className: "\n                bg-[var(--accent-2)]\n                text-[var(--primary)]\n                font-[var(--kanit)]\n                px-4 py-2\n                rounded-lg\n                cursor-pointer\n                transition-colors duration-300\n                disabled:bg-[var(--disabled)] disabled:cursor-not-allowed\n                hover:!bg-[#503A47]\n                focus:outline-none focus:ring-2 focus:ring-[var(--focus)]\n                w-full\n            ", children: "Log in" }));
    }
    if (ready && authenticated) {
        return (
        // <div className="flex items-center gap-2 bg-[var(--accent-2)] text-[var(--primary)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md">
        //     <FaWallet  className="text-[var(--primary)]" />
        //     {/* <span>{user?.id}</span> */}
        // </div>
        _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md", children: [_jsx(FaWallet, { size: 30 }), _jsxs("span", { className: "w-full items-center flex justify-center", children: ["$", totalBalance.toFixed(2)] })] }), _jsx("button", { onClick: logout, className: "\n                    flex items-center gap-2 border-2 text-[var(--less-highlight)] font-[var(--kanit)] px-4 py-2 rounded-lg shadow-md cursor-pointer transition-colors duration-300 hover:!bg-[#503A47] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]\n                ", children: _jsx("span", { className: "w-full items-center flex justify-center", children: "Log out" }) })] }));
    }
}
export default LoginButton;
