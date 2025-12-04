import { useEffect, useState } from "react";
import {
    TrendUp,
    TrendDown,
    Warning,
    DownloadSimple,
    ArrowsClockwise,
} from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyDashboardData, CompanyAlert, CompanyRankingItem } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

const baseCardClasses = companyCardClass;
const labelClass = "text-xs uppercase tracking-wide text-bolt-neutral-400";
const headingClass = "text-lg font-semibold text-bolt-neutral-900";

const getVariationIcon = (value: number) =>
    value >= 0 ? (
        <TrendUp size={16} className="text-emerald-600" />
    ) : (
        <TrendDown size={16} className="text-rose-500" />
    );

const alertBadgeStyles: Record<CompanyAlert["type"], string> = {
    financeiro: "bg-rose-50 text-rose-600",
    agenda: "bg-amber-50 text-amber-600",
    cadastro: "bg-sky-50 text-sky-600",
    atencao: "bg-violet-50 text-violet-600",
};

function RankingList({ title, items }: { title: string; items: CompanyRankingItem[] }) {
    return (
        <div className={baseCardClasses}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={labelClass}>Ranking</p>
                    <h3 className={headingClass}>{title}</h3>
                </div>
                <button
                    type="button"
                    className="text-xs font-semibold text-bolt-primary-600 hover:text-bolt-primary-500"
                >
                    Ver todos
                </button>
            </div>
            <ul className="space-y-3">
                {items.map((item) => (
                    <li
                        key={item.name}
                        className="flex items-center justify-between text-sm text-bolt-neutral-900"
                    >
                        <span>{item.name}</span>
                        <span className="flex items-center gap-2 text-bolt-neutral-500">
                            {item.value}
                            <span
                                className={`text-xs ${
                                    item.delta >= 0 ? "text-emerald-600" : "text-rose-500"
                                }`}
                            >
                                {item.delta >= 0 ? "+" : ""}
                                {item.delta}%
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function CompanyDashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyDashboardData | null>(null);
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
                const response = await companyService.getDashboard(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar dashboard da empresa", err);
                setError("Não foi possível carregar o painel executivo agora.");
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
        return <p className="mt-4 text-bolt-neutral-500">Carregando indicadores…</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Painel executivo"
                title="Indicadores e alertas"
                actions={
                    <>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <ArrowsClockwise size={16} /> Atualizar dados
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            <DownloadSimple size={16} /> Exportar .xlsx
                        </button>
                    </>
                }
            />
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {data.kpis.map((kpi) => (
                    <article key={kpi.label} className={`${baseCardClasses} space-y-3`}>
                        <p className={labelClass}>{kpi.label}</p>
                        <p className="text-3xl font-semibold text-bolt-neutral-900">{kpi.value}</p>
                        <p className="flex items-center gap-2 text-sm">
                            {getVariationIcon(kpi.variation)}
                            <span
                                className={
                                    kpi.variation >= 0 ? "text-emerald-600" : "text-rose-500"
                                }
                            >
                                {kpi.variation >= 0 ? "+" : ""}
                                {kpi.variation}% vs ontem
                            </span>
                        </p>
                    </article>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
                <article className={`${baseCardClasses} space-y-4`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={labelClass}>Tendência semanal</p>
                            <h3 className={headingClass}>Agendamentos confirmados</h3>
                        </div>
                        <button
                            type="button"
                            className="text-xs font-semibold text-bolt-primary-600 hover:text-bolt-primary-500"
                        >
                            Exportar CSV
                        </button>
                    </div>
                    <div className="flex items-end gap-4">
                        {data.weeklyTrend.map((item) => (
                            <div
                                key={item.label}
                                className="flex flex-col items-center flex-1 gap-2"
                            >
                                <div className="w-full rounded-2xl bg-bolt-primary-50">
                                    <div
                                        className="rounded-2xl bg-gradient-to-t from-bolt-primary-500 to-bolt-secondary-400"
                                        style={{ height: `${Math.min(item.value * 4, 220)}px` }}
                                    />
                                </div>
                                <p className="text-xs font-semibold text-bolt-neutral-900">
                                    {item.value}
                                </p>
                                <p className="text-xs text-bolt-neutral-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={`${baseCardClasses} space-y-4`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={labelClass}>Alertas</p>
                            <h3 className={headingClass}>Atenção imediata</h3>
                        </div>
                        <button
                            type="button"
                            className="text-xs font-semibold text-bolt-primary-600 hover:text-bolt-primary-500"
                        >
                            Ver detalhes
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {data.alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className="rounded-2xl border border-bolt-primary-50 bg-bolt-primary-50 px-4 py-3"
                            >
                                <p className="flex items-center gap-2 text-sm font-semibold text-bolt-neutral-900">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            alertBadgeStyles[alert.type]
                                        }`}
                                    >
                                        {alert.type}
                                    </span>
                                    {alert.title}
                                </p>
                                <p className="flex items-center gap-2 text-xs text-bolt-neutral-500">
                                    <Warning size={14} /> {alert.detail}
                                </p>
                            </li>
                        ))}
                    </ul>
                </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <RankingList title="Top serviços" items={data.services} />
                <RankingList title="Profissionais em destaque" items={data.professionals} />
            </section>

            <section className={`${baseCardClasses} space-y-4`}>
                <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div>
                        <p className={labelClass}>Relatórios rápidos</p>
                        <h3 className={headingClass}>Exportações recentes</h3>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600 hover:bg-bolt-primary-50"
                    >
                        <DownloadSimple size={16} /> Exportar .xlsx
                    </button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {["Fluxo de caixa", "Comissões", "Clientes VIP"].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-dashed border-bolt-primary-100 px-4 py-3 bg-bolt-primary-50 text-bolt-neutral-600"
                        >
                            <p className="text-sm font-semibold text-bolt-neutral-900">{item}</p>
                            <p className="text-xs text-bolt-neutral-500">Atualizado há 3h</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
