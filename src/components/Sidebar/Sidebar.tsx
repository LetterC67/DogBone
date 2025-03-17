import SidebarContent from "./SidebarContent";
import LoginButton from "./LoginButton";
// import SignMessage from "./SignMessage";
// import SendTransaction from "./SendTransaction";
import { useState, useEffect, use } from "react";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { useTranslation } from 'react-i18next';
import { OnrampWebSDK } from '@onramp.money/onramp-web-sdk';


function Sidebar() {
    const [active, setActive] = useState("Home");
    const { wallets } = useWallets();
    const { ready } = usePrivy();
    const { t, i18n } = useTranslation();
    
    let onrampInstance = null;
    
    useEffect(() => {
        console.log("onrampInstance", onrampInstance);
    }, [onrampInstance]);

    useEffect(() => {
        if (wallets.length < 1 || !ready) return;
        console.log(
            "Wallets: ",
            wallets.map((wallet) => wallet.walletClientType)
        )
        onrampInstance = new OnrampWebSDK({
            appId: 1, // replace this with the appID you got during onboarding process
            walletAddress: wallets[0].address,
            flowType: 1,
            fiatType: 1,
            paymentMethod: 1,
            lang: 'vi', 
            theme: {
              lightMode: {
                baseColor: "#472F3D", // * required (hex code e.g. #XXXXXX)
                inputRadius: "20px",  //optional (in px e.g. 20px)
                buttonRadius: "10px" //optional (in px e.g. 10px)
              },
              // darkMode: {coming soon}
            },
            // ... pass other configs
        });
    }, [ready, wallets.length]);

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
                        <div style={{fontFamily: "More Sugar"}} className="text-4xl">DogBone</div>
                    </div>
                    <SidebarContent setActive={setActive} active={active} text={t('home')} to="/"/>
                    <SidebarContent setActive={setActive} active={active} text={t('automation')} to="/automation"/>
                    <SidebarContent setActive={setActive} active={active} text={t('portfolio')} to="/portfolio" />
                    <SidebarContent setActive={setActive} active={active} text={t('yield')} to="/yield" />
                    <SidebarContent setActive={setActive} active={active} text={t('swap')} to="/swap" />
                    <SidebarContent setActive={setActive} active={active} text={t('bridge')} to="/bridge" />
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