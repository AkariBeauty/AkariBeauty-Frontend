import { Bell, User } from "@phosphor-icons/react";

interface UserType {
    name: string;
}

export default function HeaderEmpresa({ user }: { user: UserType }) {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 h-full flex items-center justify-between">
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-lg">
                    <input
                        type="search"
                        placeholder="Pesquisar agendamentos, clientes..."
                        className="w-full px-4 py-1.5 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800"> { user.name } </p>
                        <p className="text-xs text-gray-500">Administrador(a)</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

        </header>
    );
}
