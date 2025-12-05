import { useEffect, useMemo, useState } from "react";
import { Users, UploadSimple, MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyClientsResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyClientsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyClientsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

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
                const response = await companyService.getClients(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar clientes corporativos", err);
                setError("Não foi possível carregar os clientes no momento.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, user]);

    const filteredClients = useMemo(() => {
        if (!data) return [];
        if (!search.trim()) return data.clients;
        const term = search.toLowerCase();
        return data.clients.filter((client) =>
            [client.name, client.segment, client.status]
                .filter(Boolean)
                .some((field) => field.toLowerCase().includes(term))
        );
    }, [data, search]);

    const statusLegend = useMemo(() => {
        if (!data) return [];
        return Array.from(new Set(data.clients.map((client) => client.status)));
    }, [data]);

    if (loading || !data) {
        if (error) {
            return (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            );
        }
        return <p className="mt-4 text-bolt-neutral-500">Carregando clientes corporativos...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Segmentação corporativa"
                title="Clientes e relacionamento"
                actions={
                    <>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <UploadSimple size={16} /> Importar CSV
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Exportar lista
                        </button>
                    </>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                {data.metrics.map((metric) => (
                    <article key={metric.label} className={`${companyCardClass} space-y-1`}>
                        <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                            {metric.label}
                        </p>
                        <p className="text-3xl font-semibold text-bolt-neutral-900">
                            {metric.value}
                        </p>
                        <p
                            className={`text-xs font-semibold ${
                                metric.delta >= 0 ? "text-emerald-600" : "text-rose-600"
                            }`}
                        >
                            {metric.delta >= 0 ? "+" : ""}
                            {metric.delta}% nos últimos 30d
                        </p>
                    </article>
                ))}
            </section>

            <section className={`${companyCardClass} space-y-3`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Lista priorizada</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Segmentação e status financeiro
                        </h2>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-2xl border border-bolt-primary-100 bg-white px-3 py-2">
                        <MagnifyingGlass size={16} className="text-bolt-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por nome, segmento ou status"
                            className="flex-1 border-none bg-transparent text-sm text-bolt-neutral-700 placeholder:text-bolt-neutral-400 focus:outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                    >
                        <FunnelSimple size={16} /> Filtros avançados
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                    {statusLegend.map((status) => (
                        <span
                            key={status}
                            className="rounded-full border border-dashed border-bolt-primary-100 px-3 py-1 font-semibold text-bolt-neutral-500"
                        >
                            {status}
                        </span>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-bolt-neutral-600">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                <th className="px-4 py-2">Cliente</th>
                                <th className="px-4 py-2">Segmento</th>
                                <th className="px-4 py-2">Visitas</th>
                                <th className="px-4 py-2">Retenção</th>
                                <th className="px-4 py-2">Lifetime value</th>
                                <th className="px-4 py-2">Última visita</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-sm text-bolt-neutral-500"
                                    >
                                        {search
                                            ? "Nenhum cliente corresponde ao filtro aplicado."
                                            : "Nenhum cliente cadastrado."}
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="border-t border-bolt-primary-50">
                                        <td className="px-4 py-3 text-bolt-neutral-900">
                                            {client.name}
                                        </td>
                                        <td className="px-4 py-3">{client.segment}</td>
                                        <td className="px-4 py-3">{client.visits}</td>
                                        <td className="px-4 py-3">{client.retention}</td>
                                        <td className="px-4 py-3">{client.lifetimeValue}</td>
                                        <td className="px-4 py-3">{client.lastVisit}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    client.status === "vip"
                                                        ? "bg-violet-50 text-violet-600"
                                                        : client.status === "inadimplente"
                                                        ? "bg-rose-50 text-rose-600"
                                                        : "bg-emerald-50 text-emerald-600"
                                                }`}
                                            >
                                                {client.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
