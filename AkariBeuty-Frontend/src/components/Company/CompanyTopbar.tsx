import { MagnifyingGlass, Bell } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";

export default function CompanyTopbar() {
    const { user } = useAuth();

    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <p className="text-sm text-bolt-neutral-500">Bem-vindo de volta</p>
                <h1 className="text-2xl font-semibold text-bolt-neutral-900">
                    {user?.name ?? "Admin"}
                </h1>
                <p className="text-xs text-bolt-neutral-400">
                    Plano corporativo ativo · ID #{user?.empresaId ?? "-"}
                </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-2xl border border-bolt-primary-50 bg-white px-4 py-2 shadow-sm">
                    <MagnifyingGlass size={18} className="text-bolt-neutral-400" />
                    <input
                        type="text"
                        placeholder="Buscar profissionais, serviços..."
                        className="flex-1 border-none bg-transparent text-sm text-bolt-neutral-700 placeholder:text-bolt-neutral-400 focus:outline-none"
                    />
                </div>
                <button
                    type="button"
                    className="rounded-2xl border border-bolt-primary-100 bg-white p-3 text-bolt-primary-600 shadow-sm transition hover:bg-bolt-primary-50"
                    aria-label="Notificações"
                >
                    <Bell size={18} />
                </button>
            </div>
        </header>
    );
}
