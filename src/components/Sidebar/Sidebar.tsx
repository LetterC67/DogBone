import SidebarContent from "./SidebarContent";
import { useState } from "react";
import {usePrivy} from '@privy-io/react-auth';


function Sidebar() {
    const [active, setActive] = useState("Home");
    const {login} = usePrivy();



    return (
        <>
            <aside className="bg-(--secondary) h-full p-6 flex-col gap-1">
                <SidebarContent setActive={setActive} active={active} text="Home" />
                <SidebarContent setActive={setActive} active={active} text="Yield" />
                <SidebarContent setActive={setActive} active={active} text="Swap" />
                <SidebarContent setActive={setActive} active={active} text="Bridge" />

                <button onClick={() => login({loginMethods: ['email', 'wallet']})}>
                    Login
                </button>;
            </aside>
        </>
    )
};

export default Sidebar;