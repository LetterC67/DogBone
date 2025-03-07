import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import SidebarContent from "./SidebarContent";
import LoginButton from "./LoginButton";
// import SignMessage from "./SignMessage";
// import SendTransaction from "./SendTransaction";
import { useState, useEffect } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
function Sidebar() {
    const [active, setActive] = useState("Home");
    const { wallets } = useWallets();
    const { ready } = usePrivy();
    useEffect(() => {
        if (!ready) {
            return;
        }
        else {
            setUp();
        }
        async function setUp() {
            const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
            if (embeddedWallet) {
                console.log("hello");
            }
        }
    }, [ready, wallets.length]);
    return (_jsx(_Fragment, { children: _jsxs("aside", { className: "bg-(--secondary) h-full p-6 flex-col flex justify-between", children: [_jsxs("div", { className: "flex-col gap-1", children: [_jsxs("div", { className: "flex flex-col justify-center items-center gap-3 mb-10", children: [_jsx("img", { src: "https://iili.io/3FsujwX.md.png", className: 'w-2/3' }), _jsx("div", { style: { fontFamily: "Playwrite IT Moderna" }, className: "text-4xl", children: "DogBone" })] }), _jsx(SidebarContent, { setActive: setActive, active: active, text: "Home", to: "/" }), _jsx(SidebarContent, { setActive: setActive, active: active, text: "Portfolio", to: "/portfolio" }), _jsx(SidebarContent, { setActive: setActive, active: active, text: "Yield", to: "/yield" }), _jsx(SidebarContent, { setActive: setActive, active: active, text: "Swap", to: "/swap" }), _jsx(SidebarContent, { setActive: setActive, active: active, text: "Bridge", to: "/bridge" })] }), _jsx("div", { children: _jsx(LoginButton, {}) })] }) }));
}
;
export default Sidebar;
