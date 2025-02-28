import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface SidebarContentProps {
    text: string;
    active: string;
    setActive: (text: string) => void;
    to: string;
}

function SidebarContent({ text, active, setActive, to }: SidebarContentProps) {
    const location = useLocation();

    return (
        <Link to={to}>
            <div className={`p-2 ${location.pathname==to ? 'bg-(--accent)' : ''} rounded-md hover:text-(--focus) transition duration-300 ease-in-out hover:cursor-pointer`} onClick={() => setActive(text)}>
                    <div>
                        { text }
                    </div>
            </div>
        </Link>
    );
};

export default SidebarContent;