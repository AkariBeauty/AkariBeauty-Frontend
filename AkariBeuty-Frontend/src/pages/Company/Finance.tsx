import { useEffect, useState } from "react";
import { CurrencyDollarSimple, FileArrowDown } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyFinanceResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyFinancePage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyFinanceResponse | null>(null);
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
                const response = await companyService.getFinance(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar módulo financeiro", err);
                setError("Não foi possível carregar o financeiro agora.");
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
        return <p className="mt-4 text-bolt-neutral-500">Carregando financeiro...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Fluxo e comissões"
                title="Financeiro"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        <FileArrowDown size={16} /> Exportar .xlsx
                    </button>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                {data.kpis.map((kpi) => (
                    <article key={kpi.label} className={`${companyCardClass} space-y-1`}>
                        <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                            {kpi.label}
                        </p>
                        <p className="text-3xl font-semibold text-bolt-neutral-900">{kpi.value}</p>
                        <p
                            className={`text-xs font-semibold ${
                                kpi.variation >= 0 ? "text-emerald-600" : "text-rose-600"
                            }`}
                        >
                            {kpi.variation >= 0 ? "+" : ""}
                            {kpi.variation}% contra semana anterior
                        </p>
                    </article>
                ))}
            </section>

            <section className={`${companyCardClass} space-y-4`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <CurrencyDollarSimple size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Fluxo de caixa</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Entradas vs saídas
                        </h2>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {data.cashFlow.map((entry) => (
                        <div
                            key={entry.period}
                            className="rounded-2xl border border-bolt-primary-50 p-4"
                        >
                            <p className="text-sm font-semibold text-bolt-neutral-900">
                                {entry.period}
                            </p>
                            <div className="mt-3 space-y-2">
                                <div>
                                    <p className="text-xs text-bolt-neutral-500">Entradas</p>
                                    <div className="h-2 rounded-full bg-bolt-primary-100">
                                        <div
                                            className="h-2 rounded-full bg-bolt-primary-500"
                                            style={{ width: `${Math.min(entry.entradas, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-bolt-neutral-500">Saídas</p>
                                    <div className="h-2 rounded-full bg-bolt-secondary-100">
                                        <div
                                            className="h-2 rounded-full bg-bolt-secondary-400"
                                            style={{ width: `${Math.min(entry.saidas, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`${companyCardClass} space-y-3`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Comissões</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Pagamentos por profissional
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                    >
                        Baixar relatório
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-bolt-neutral-600">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                <th className="px-4 py-2">Profissional</th>
                                <th className="px-4 py-2">Valor</th>
                                <th className="px-4 py-2">Competência</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.commissions.map((row) => (
                                <tr
                                    key={`${row.professional}-${row.period}`}
                                    className="border-t border-bolt-primary-50"
                                >
                                    <td className="px-4 py-3 text-bolt-neutral-900">
                                        {row.professional}
                                    </td>
                                    <td className="px-4 py-3">{row.amount}</td>
                                    <td className="px-4 py-3">{row.period}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                row.status === "pago"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : row.status === "pendente"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : "bg-rose-50 text-rose-600"
                                            }`}
                                        >
                                            {row.status}
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
