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
        } else {
          setUp();
        }
        async function setUp() {
            const embeddedWallet = wallets.find(
                (wallet) => wallet.walletClientType === "privy"
            );
            if (embeddedWallet) {
                console.log("hello");
            }
        }
      }, [ready, wallets]);

    return (
        <>
            <aside className="bg-(--secondary) h-full p-6 flex-col flex justify-between">
                <div className="flex-col gap-1">
                    <SidebarContent setActive={setActive} active={active} text="Home" />
                    <SidebarContent setActive={setActive} active={active} text="Yield" />
                    <SidebarContent setActive={setActive} active={active} text="Swap" />
                    <SidebarContent setActive={setActive} active={active} text="Bridge" />
                </div>

                <div>
                    {/* <SendTransaction/> */}
                    <LoginButton/>
                </div>
            </aside>
        </>
    )
};

export default Sidebar;