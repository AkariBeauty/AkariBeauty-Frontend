import { useState } from "react";

interface TabProps {
    label : string;
    action : () => void;
}

export default function LoginTabs ({tabs} : {tabs : TabProps[]}) {

    const [activeTab, setActiveTab] = useState("Cliente"); // Definindo "Cliente" como padrão

    const handleTabClick = (tab: TabProps) => {
        tab.action(); // Chama a função para definir o typeUser
        setActiveTab(tab.label);
    };

    return(
        <>
            <div className="relative flex justify-evenly before:absolute before:bottom-[-2px] before:w-full before:bg-gray-200 before:h-[2px]">
                {tabs.map((tab, index) => (
                    <button 
                        key={index}
                        type="button" 
                        onClick={() => handleTabClick(tab)} 
                        className={`${activeTab === tab.label ? 'text-primary before:w-full' : 'before:w-0'} relative text-2xl font-bold cursor-pointer before:absolute before:bottom-0 before:bg-primary before:h-1 before:transition-all before:duration-500 ease-in-out hover:text-primary hover:transition-all hover:duration-200`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </>
    );
}
