import { ChartBar, Calendar, CurrencyDollar, Users, UserCheck, SignOut } from "@phosphor-icons/react";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

type PageType = "home" | "agenda" | "financeiro" | "profissionais" | "clientes";

export default function SidebarEmpresa({ page }: { page: PageType }) {

    let navigate = useNavigate();

    const menuItems = [
        { id: "home" as PageType, label: "Dashboard", icon: ChartBar },
        { id: "agenda" as PageType, label: "Agenda", icon: Calendar },
        { id: "financeiro" as PageType, label: "Financeiro", icon: CurrencyDollar },
        { id: "profissionais" as PageType, label: "Equipe", icon: Users },
        { id: "clientes" as PageType, label: "Clientes", icon: UserCheck },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("typeUser");
        navigate("/login");
    }

    return (
        <div className=" fixed h-screen w-[16%] bg-white shadow-lg flex flex-col">
            <div className="h-1/12 flex items-center justify-center">
                <div className="flex items-center justify-center space-x-2">
                    <img src={Logo} alt="Logo" className="w-8 h-8" />
                    <span className="text-xl font-bold text-gray-800">AkariBeauty</span>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li>
                                <button
                                    onClick={() => navigate("/" + item.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${page === item.id ? 'bg-pink-100 text-pink-700 border-r-4 border-pink-500' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="h-1/12 flex items-center justify-center">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 font-bold rounded-lg transition-colors text-gray-600 hover:bg-gray-200 hover:text-gray-800">
                    <SignOut size={32} weight="bold"/>
                    <span className="font-medium text-lg">Sair</span>
                </button>
            </div>
        </div>
    );
}
