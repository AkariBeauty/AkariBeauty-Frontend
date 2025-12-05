import { MagnifyingGlass, Bell, SignOut, XCircle } from "@phosphor-icons/react";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCompanySearch } from "../../contexts/CompanySearchContext";

export default function CompanyTopbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { query, setQuery, clear } = useCompanySearch();

    const handleLogout = () => {
        logout();
        clear();
        navigate("/login");
    };

    const handleSearchSubmit = (event: FormEvent) => {
        event.preventDefault();
    };

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
                <form
                    className="flex items-center gap-2 rounded-2xl border border-bolt-primary-50 bg-white px-4 py-2 shadow-sm"
                    onSubmit={handleSearchSubmit}
                >
                    <MagnifyingGlass size={18} className="text-bolt-neutral-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Buscar profissionais, serviços..."
                        className="flex-1 border-none bg-transparent text-sm text-bolt-neutral-700 placeholder:text-bolt-neutral-400 focus:outline-none"
                    />
                    {query ? (
                        <button
                            type="button"
                            onClick={clear}
                            className="text-bolt-neutral-300 transition hover:text-bolt-neutral-500"
                            aria-label="Limpar busca"
                        >
                            <XCircle size={16} />
                        </button>
                    ) : null}
                </form>
                <button
                    type="button"
                    className="rounded-2xl border border-bolt-primary-100 bg-white p-3 text-bolt-primary-600 shadow-sm transition hover:bg-bolt-primary-50"
                    aria-label="Notificações"
                >
                    <Bell size={18} />
                </button>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-2xl border border-bolt-primary-100 bg-white px-4 py-2 text-sm font-semibold text-bolt-primary-700 shadow-sm transition hover:bg-bolt-primary-50"
                >
                    <SignOut size={18} />
                    Sair
                </button>
            </div>
        </header>
    );
}
