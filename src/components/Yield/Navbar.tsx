import React, { useState } from 'react';

function NavbarTab({ title, active, onClick }: { title: string; active: string; onClick: (title: string) => void }) {
    return (
        <div className={`p-2 ${active == title ? 'bg-(--highlight) text-(--background)' : 'bg-(--accent) text-(--disabled)'} rounded-t-lg hover:text-(--primary) transition duration-300 ease-in-out hover:cursor-pointer font-bold pb-1`} onClick={() => onClick(title)}>
            <div>
                {title}
            </div>
        </div>
    );
}

function Navbar() {
    const [active, setActive] = useState("All strategies");

    return (
        <div className="flex flex-row gap-2 self-start">
            <NavbarTab title="All strategies" active={active} onClick={() => setActive("All strategies")}/>
            <NavbarTab title="Your position" active={active} onClick={() => setActive("Your position")} />
        </div>
    );
}

export default Navbar;