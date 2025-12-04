import { useEffect, useState } from "react";
import { ShieldCheck, FunnelSimple } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyAuditResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyAuditPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyAuditResponse | null>(null);
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
                const response = await companyService.getAuditLogs(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar registros de auditoria", err);
                setError("Não foi possível carregar os logs agora.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, user]);

    if (loading || !data) {
        if (error) {
            return (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            );
        }
        return <p className="mt-4 text-bolt-neutral-500">Carregando auditoria...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Registro de ações"
                title="Auditoria e logs"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                    >
                        <FunnelSimple size={16} /> Filtros avançados
                    </button>
                }
            />

            <section className={`${companyCardClass} space-y-3`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Escopo monitorado</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            {data.filters.modules.join(", ")}
                        </h2>
                        <p className="text-xs text-bolt-neutral-500">
                            Usuários recentes: {data.filters.actors.join(", ")}
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-bolt-neutral-600">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                <th className="px-4 py-2">Horário</th>
                                <th className="px-4 py-2">Módulo</th>
                                <th className="px-4 py-2">Ação</th>
                                <th className="px-4 py-2">Usuário</th>
                                <th className="px-4 py-2">Nível</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.logs.map((log) => (
                                <tr key={log.id} className="border-t border-bolt-primary-50">
                                    <td className="px-4 py-3 text-bolt-neutral-900">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-4 py-3">{log.module}</td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">{log.actor}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                log.severity === "info"
                                                    ? "bg-bolt-primary-50 text-bolt-primary-600"
                                                    : log.severity === "warning"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-rose-50 text-rose-600"
                                            }`}
                                        >
                                            {log.severity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
