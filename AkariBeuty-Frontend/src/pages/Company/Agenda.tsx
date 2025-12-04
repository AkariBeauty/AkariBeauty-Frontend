import { useEffect, useState } from "react";
import { CalendarDots, Export, ListChecks } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyAgendaResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyAgendaPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyAgendaResponse | null>(null);
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
                const response = await companyService.getAgenda({ empresaId });
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar agenda consolidada", err);
                setError("Não foi possível carregar a agenda corporativa agora.");
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
        return <p className="mt-4 text-bolt-neutral-500">Carregando agenda consolidada...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Visão corporativa"
                title="Agenda consolidada"
                actions={
                    <>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <ListChecks size={16} /> Reatribuir slots
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            <Export size={16} /> Exportar CSV
                        </button>
                    </>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                {data.summary.map((item) => (
                    <article key={item.label} className={`${companyCardClass} space-y-1`}>
                        <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                            {item.label}
                        </p>
                        <p className="text-3xl font-semibold text-bolt-neutral-900">{item.value}</p>
                        <p className="text-xs text-bolt-neutral-500">{item.detail}</p>
                    </article>
                ))}
            </section>

            <section className={`${companyCardClass} space-y-4`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <CalendarDots size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Slots confirmados</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Filtros: {data.filters.professionals.join(", ")} ·{" "}
                            {data.filters.services.join(", ")}
                        </h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-bolt-neutral-600">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                <th className="px-4 py-2">Data</th>
                                <th className="px-4 py-2">Horário</th>
                                <th className="px-4 py-2">Profissional</th>
                                <th className="px-4 py-2">Serviço</th>
                                <th className="px-4 py-2">Cliente</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Local</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.slots.map((slot) => (
                                <tr key={slot.id} className="border-t border-bolt-primary-50">
                                    <td className="px-4 py-3 text-bolt-neutral-900">{slot.date}</td>
                                    <td className="px-4 py-3">
                                        {slot.start} - {slot.end}
                                    </td>
                                    <td className="px-4 py-3">{slot.professional}</td>
                                    <td className="px-4 py-3">{slot.service}</td>
                                    <td className="px-4 py-3">{slot.client}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                slot.status === "confirmado"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : slot.status === "pendente"
                                                    ? "bg-amber-50 text-amber-600"
                                                    : slot.status === "cancelado"
                                                    ? "bg-rose-50 text-rose-600"
                                                    : "bg-bolt-primary-50 text-bolt-primary-600"
                                            }`}
                                        >
                                            {slot.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-bolt-neutral-500">
                                        {slot.location}
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
