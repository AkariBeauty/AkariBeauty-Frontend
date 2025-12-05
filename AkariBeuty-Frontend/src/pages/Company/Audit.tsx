import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, FunnelSimple } from "@phosphor-icons/react";
import Modal from "../../components/UI/Modal";
import companyService from "../../services/companyService";
import type { CompanyAuditResponse, CompanyLogEntry } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useCompanySearch } from "../../contexts/CompanySearchContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

type AuditFilterState = {
    module?: string;
    actor?: string;
    severity?: "info" | "warning" | "critical" | "";
    startDate?: string;
    endDate?: string;
};

const defaultFilters: AuditFilterState = {
    module: "",
    actor: "",
    severity: "",
    startDate: "",
    endDate: "",
};

const parseLogTimestamp = (timestamp: string): Date | null => {
    const [datePart, timePart] = timestamp.split(" ");
    if (!datePart || !timePart) return null;
    const [day, month] = datePart.split("/");
    const [hour, minute] = timePart.split(":");
    const year = new Date().getFullYear();
    const parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const severityDictionary: Record<CompanyLogEntry["severity"], { label: string; badgeClass: string; helper: string }> = {
    info: {
        label: "Informativo",
        badgeClass: "bg-bolt-primary-50 text-bolt-primary-600",
        helper: "Eventos rotineiros e registros de sistema",
    },
    warning: {
        label: "Atenção",
        badgeClass: "bg-amber-50 text-amber-700",
        helper: "Requer verificação manual para evitar impacto",
    },
    critical: {
        label: "Crítico",
        badgeClass: "bg-rose-50 text-rose-600",
        helper: "Impacto direto em finanças ou clientes",
    },
};

const severityOrder: CompanyLogEntry["severity"][] = ["critical", "warning", "info"];

const getSeverityMeta = (level: CompanyLogEntry["severity"]) => severityDictionary[level] ?? severityDictionary.info;

export default function CompanyAuditPage() {
    const { user, isLoading: authLoading } = useAuth();
    const empresaId = useMemo(() => resolveEmpresaIdFromUser(user), [user]);
    const { query: globalSearch } = useCompanySearch();
    const [data, setData] = useState<CompanyAuditResponse | null>(null);
    const [allLogs, setAllLogs] = useState<CompanyLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filterForm, setFilterForm] = useState<AuditFilterState>(defaultFilters);
    const [activeFilters, setActiveFilters] = useState<AuditFilterState>(defaultFilters);

    useEffect(() => {
        const load = async () => {
            if (authLoading) return;

            if (!empresaId) {
                setError("Não foi possível identificar a empresa do usuário.");
                setLoading(false);
                return;
            }

            try {
                const response = await companyService.getAuditLogs(empresaId);
                setData(response);
                setAllLogs(response.logs ?? []);
                setFilterForm(defaultFilters);
                setActiveFilters(defaultFilters);
            } catch (err) {
                console.error("Erro ao carregar registros de auditoria", err);
                setError("Não foi possível carregar os logs agora.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, empresaId]);

    const severityOptions = useMemo(() => {
        const unique = new Set(allLogs.map((log) => log.severity));
        return severityOrder.filter((level) => unique.has(level));
    }, [allLogs]);

    const filteredLogs = useMemo(() => {
        const term = globalSearch.trim().toLowerCase();
        const startDate = activeFilters.startDate ? new Date(activeFilters.startDate) : null;
        const endDate = activeFilters.endDate ? new Date(activeFilters.endDate) : null;

        return allLogs.filter((log) => {
            if (activeFilters.module && log.module !== activeFilters.module) return false;
            if (activeFilters.actor && log.actor !== activeFilters.actor) return false;
            if (activeFilters.severity && log.severity !== activeFilters.severity) return false;

            const occurredAt = parseLogTimestamp(log.timestamp);
            if (startDate && occurredAt && occurredAt < startDate) return false;
            if (endDate && occurredAt && occurredAt > endDate) return false;

            if (!term) return true;
            return (
                log.module.toLowerCase().includes(term) ||
                log.action.toLowerCase().includes(term) ||
                log.actor.toLowerCase().includes(term) ||
                log.severity.toLowerCase().includes(term)
            );
        });
    }, [allLogs, activeFilters, globalSearch]);

    const hasActiveFilters = useMemo(() => {
        return (
            !!activeFilters.module ||
            !!activeFilters.actor ||
            !!activeFilters.severity ||
            !!activeFilters.startDate ||
            !!activeFilters.endDate
        );
    }, [activeFilters]);

    const applyFilters = () => {
        setActiveFilters(filterForm);
        setFilterModalOpen(false);
    };

    const resetFilters = () => {
        setFilterForm(defaultFilters);
        setActiveFilters(defaultFilters);
    };

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
                    <>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-2xl border border-dashed border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-500"
                            >
                                Limpar filtros
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setFilterModalOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <FunnelSimple size={16} /> Filtros avançados
                        </button>
                    </>
                }
            />

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 text-xs">
                    {activeFilters.module && (
                        <span className="rounded-full border border-bolt-primary-100 bg-bolt-primary-50 px-3 py-1 font-semibold text-bolt-neutral-600">
                            Módulo: {activeFilters.module}
                        </span>
                    )}
                    {activeFilters.actor && (
                        <span className="rounded-full border border-bolt-primary-100 bg-bolt-primary-50 px-3 py-1 font-semibold text-bolt-neutral-600">
                            Usuário: {activeFilters.actor}
                        </span>
                    )}
                    {activeFilters.severity && (
                        <span className="rounded-full border border-bolt-primary-100 bg-bolt-primary-50 px-3 py-1 font-semibold text-bolt-neutral-600">
                            Severidade: {getSeverityMeta(activeFilters.severity as CompanyLogEntry["severity"]).label}
                        </span>
                    )}
                    {(activeFilters.startDate || activeFilters.endDate) && (
                        <span className="rounded-full border border-bolt-primary-100 bg-bolt-primary-50 px-3 py-1 font-semibold text-bolt-neutral-600">
                            {activeFilters.startDate || ".."} ➝ {activeFilters.endDate || ".."}
                        </span>
                    )}
                </div>
            )}

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
                <div className="flex flex-wrap gap-3 text-xs text-bolt-neutral-500">
                    {severityOrder.map((level) => {
                        const meta = getSeverityMeta(level);
                        return (
                            <div
                                key={level}
                                className="flex items-center gap-2 rounded-2xl border border-bolt-primary-50 bg-white px-3 py-2"
                            >
                                <span className={`rounded-full px-3 py-1 font-semibold ${meta.badgeClass}`}>
                                    {meta.label}
                                </span>
                                <span className="text-bolt-neutral-400">{meta.helper}</span>
                            </div>
                        );
                    })}
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
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-sm text-bolt-neutral-500"
                                    >
                                        Nenhuma entrada encontrada com os filtros atuais.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                <tr key={log.id} className="border-t border-bolt-primary-50">
                                    <td className="px-4 py-3 text-bolt-neutral-900">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-4 py-3">{log.module}</td>
                                    <td className="px-4 py-3">{log.action}</td>
                                    <td className="px-4 py-3">{log.actor}</td>
                                    <td className="px-4 py-3">
                                        {(() => {
                                            const meta = getSeverityMeta(log.severity);
                                            return (
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
                                                >
                                                    {meta.label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Modal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                title="Filtros avançados"
                size="lg"
            >
                <form
                    className="space-y-4"
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Módulo
                            <select
                                value={filterForm.module}
                                onChange={(event) =>
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        module: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            >
                                <option value="">Todos</option>
                                {data.filters.modules.map((module) => (
                                    <option key={module} value={module}>
                                        {module}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Usuário
                            <select
                                value={filterForm.actor}
                                onChange={(event) =>
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        actor: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            >
                                <option value="">Todos</option>
                                {data.filters.actors.map((actor) => (
                                    <option key={actor} value={actor}>
                                        {actor}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Severidade
                            <select
                                value={filterForm.severity}
                                onChange={(event) =>
                                    setFilterForm((prev) => ({
                                        ...prev,
                                        severity: event.target.value as AuditFilterState["severity"],
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            >
                                <option value="">Todas</option>
                                {severityOptions.map((severity) => {
                                    const meta = getSeverityMeta(severity);
                                    return (
                                        <option key={severity} value={severity}>
                                            {meta.label}
                                        </option>
                                    );
                                })}
                            </select>
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="text-sm font-medium text-bolt-neutral-600">
                                De
                                <input
                                    type="date"
                                    value={filterForm.startDate}
                                    onChange={(event) =>
                                        setFilterForm((prev) => ({
                                            ...prev,
                                            startDate: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                />
                            </label>
                            <label className="text-sm font-medium text-bolt-neutral-600">
                                Até
                                <input
                                    type="date"
                                    value={filterForm.endDate}
                                    onChange={(event) =>
                                        setFilterForm((prev) => ({
                                            ...prev,
                                            endDate: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setFilterModalOpen(false)}
                            className="rounded-xl border border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
