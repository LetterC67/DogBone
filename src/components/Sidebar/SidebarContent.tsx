interface SidebarContentProps {
    text: string;
    active: string;
    setActive: (text: string) => void;
}

function SidebarContent({ text, active, setActive }: SidebarContentProps) {
    return (
        <div className={`p-2 ${active==text ? 'bg-(--accent)' : ''} rounded-md hover:text-(--focus) transition duration-300 ease-in-out hover:cursor-pointer`} onClick={() => setActive(text)}>
            <div>
                { text }
            </div>
        </div>
    );
};

export default SidebarContent;