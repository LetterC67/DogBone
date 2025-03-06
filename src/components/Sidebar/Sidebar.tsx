import SidebarContent from "./SidebarContent";
import LoginButton from "./LoginButton";
// import SignMessage from "./SignMessage";
// import SendTransaction from "./SendTransaction";
import { useState, useEffect } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { Link } from "react-router";


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
      }, [ready, wallets.length]);

    return (
        <>
            <aside className="bg-(--secondary) h-full p-6 flex-col flex justify-between">
                <div className="flex-col gap-1">
                    <div className="flex flex-col justify-center items-center gap-3 mb-10">
                        <img src="https://iili.io/3FsujwX.md.png" className='w-2/3'></img>
                        <div style={{fontFamily: "Playwrite IT Moderna"}} className="text-4xl">DogBone</div>
                    </div>
                    <SidebarContent setActive={setActive} active={active} text="Home" to="/"/>
                    <SidebarContent setActive={setActive} active={active} text="Portfolio" to="/portfolio" />
                    <SidebarContent setActive={setActive} active={active} text="Yield" to="/yield" />
                    <SidebarContent setActive={setActive} active={active} text="Swap" to="/swap" />
                    <SidebarContent setActive={setActive} active={active} text="Bridge" to="/bridge" />
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