import { Link } from "react-router-dom";

interface SidebarContentProps {
    text: string;
    active: string;
    setActive: (text: string) => void;
    to: string;
}

function SidebarContent({ text, active, setActive, to }: SidebarContentProps) {
    return (
        <div className={`p-2 ${active==text ? 'bg-(--accent)' : ''} rounded-md hover:text-(--focus) transition duration-300 ease-in-out hover:cursor-pointer`} onClick={() => setActive(text)}>
            <Link to={to}>
                <div>
                    { text }
                </div>
            </Link>
        </div>
    );
};

export default SidebarContent;