import SidebarContent from "./SidebarContent";
import { useState } from "react";

function Sidebar() {
    const [active, setActive] = useState("Home");

    return (
        <>
            <aside className="bg-(--secondary) h-full p-6 flex-col gap-1">
                <SidebarContent setActive={setActive} active={active} text="Home" />
                <SidebarContent setActive={setActive} active={active} text="Yield" />
                <SidebarContent setActive={setActive} active={active} text="Swap" />
                <SidebarContent setActive={setActive} active={active} text="Bridge" />
            </aside>
        </>
    )
};

export default Sidebar;