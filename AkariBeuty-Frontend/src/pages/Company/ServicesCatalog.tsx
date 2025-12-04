import { useEffect, useState } from "react";
import { SquaresFour, PlusCircle, ArrowsClockwise } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyServiceCatalogItem, CompanyServiceHistoryEntry } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyServicesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [catalog, setCatalog] = useState<CompanyServiceCatalogItem[]>([]);
    const [history, setHistory] = useState<CompanyServiceHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (authLoading) return;
            const empresaId = resolveEmpresaIdFromUser(user);
            if (!empresaId) {
                setError("Não foi possível identificar a empresa do usuário.");
                setLoading(false);
                return;
            }
            try {
                const response = await companyService.getServices(empresaId);
                setCatalog(response.catalog);
                setHistory(response.history);
            } catch (err) {
                console.error("Erro ao carregar serviços da empresa", err);
                setError("Não foi possível carregar o catálogo agora.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, user]);

    if (loading) {
        if (error) {
            return (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            );
        }
        return <p className="mt-4 text-bolt-neutral-500">Carregando catálogo...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Gerencie oferta corporativa"
                title="Serviços e Catálogo"
                actions={
                    <>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <ArrowsClockwise size={16} /> Sincronizar ERP
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md"
                        >
                            <PlusCircle size={16} /> Novo serviço
                        </button>
                    </>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                {catalog.map((item) => (
                    <article key={item.id} className={`${companyCardClass} space-y-3`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                    {item.category}
                                </p>
                                <h3 className="text-lg font-semibold text-bolt-neutral-900">
                                    {item.name}
                                </h3>
                            </div>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    item.status === "ativo"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : item.status === "rascunho"
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                }`}
                            >
                                {item.status}
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-bolt-neutral-900">{item.price}</p>
                        <p className="text-sm text-bolt-neutral-500">Duração {item.duration}</p>
                        <div className="flex items-center justify-between text-xs text-bolt-neutral-400">
                            <span>{item.updatedAt}</span>
                            <span>Versão {item.version}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-bolt-neutral-500">
                            <span className="rounded-full bg-bolt-primary-50 px-2 py-0.5">
                                Responsável: {item.updatedBy}
                            </span>
                            <span className="rounded-full border border-dashed border-bolt-primary-100 px-2 py-0.5">
                                {item.status === "ativo" ? "Disponível" : "Revisão"}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="flex-1 rounded-2xl border border-bolt-primary-200 px-3 py-2 text-sm font-semibold text-bolt-primary-600"
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-2xl border border-dashed border-bolt-primary-100 px-3 py-2 text-sm text-bolt-neutral-500"
                            >
                                Duplicar
                            </button>
                        </div>
                    </article>
                ))}
            </section>

            <section className={`${companyCardClass} space-y-3`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <SquaresFour size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Histórico de alterações</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Últimas atualizações de catálogo
                        </h2>
                    </div>
                </div>
                <ul className="space-y-3">
                    {history.map((entry) => (
                        <li
                            key={entry.id}
                            className="rounded-2xl border border-bolt-primary-50 bg-bolt-primary-50 px-4 py-3"
                        >
                            <p className="text-sm font-semibold text-bolt-neutral-900">
                                {entry.name}
                            </p>
                            <p className="text-xs text-bolt-neutral-500">{entry.changes}</p>
                            <p className="text-[11px] text-bolt-neutral-400">{entry.updatedAt}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
