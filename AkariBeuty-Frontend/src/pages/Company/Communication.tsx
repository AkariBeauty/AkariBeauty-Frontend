import { useEffect, useState } from "react";
import { PaperPlaneTilt, ChatsCircle, PencilSimple } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyCommunicationResponse } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanyCommunicationPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanyCommunicationResponse | null>(null);
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
                const response = await companyService.getCommunication(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar comunicações da empresa", err);
                setError("Não foi possível carregar as comunicações agora.");
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
        return <p className="mt-4 text-bolt-neutral-500">Carregando comunicações...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Templates e disparos"
                title="Comunicação e notificações"
                actions={
                    <>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <PencilSimple size={16} /> Criar template
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            <PaperPlaneTilt size={16} /> Novo comunicado
                        </button>
                    </>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                <article className={`${companyCardClass} space-y-1`}>
                    <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                        Envios semanais
                    </p>
                    <p className="text-3xl font-semibold text-bolt-neutral-900">
                        {data.stats.sentThisWeek}
                    </p>
                    <p className="text-xs text-bolt-neutral-500">
                        Campanhas disparadas nos últimos 7 dias
                    </p>
                </article>
                <article className={`${companyCardClass} space-y-1`}>
                    <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                        Taxa de entrega
                    </p>
                    <p className="text-3xl font-semibold text-bolt-neutral-900">
                        {data.stats.deliveryRate}%
                    </p>
                    <p className="text-xs text-bolt-neutral-500">Baseado na fila atual</p>
                </article>
                <article className={`${companyCardClass} space-y-1`}>
                    <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                        Campanhas ativas
                    </p>
                    <p className="text-3xl font-semibold text-bolt-neutral-900">
                        {data.stats.activeCampaigns}
                    </p>
                    <p className="text-xs text-bolt-neutral-500">Entre SMS, email e push</p>
                </article>
            </section>

            <section className={`${companyCardClass} space-y-3`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <ChatsCircle size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Fila atual</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Templates e comunicados
                        </h2>
                    </div>
                </div>
                <div className="grid gap-3">
                    {data.templates.map((template) => (
                        <article
                            key={template.id}
                            className="flex flex-col gap-3 rounded-2xl border border-bolt-primary-50 bg-bolt-primary-50/50 p-4 md:flex-row md:items-center md:justify-between"
                        >
                            <div>
                                <p className="text-sm font-semibold text-bolt-neutral-900">
                                    {template.title}
                                </p>
                                <p className="text-xs text-bolt-neutral-500">{template.audience}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-bolt-neutral-500">
                                <span>{template.lastSend}</span>
                                <span className="rounded-full bg-white px-3 py-1 font-semibold text-bolt-primary-600">
                                    {template.status}
                                </span>
                                {template.openRate > 0 && (
                                    <span className="text-emerald-600">
                                        Open rate {template.openRate}%
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                className="rounded-2xl border border-bolt-primary-200 bg-white px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                            >
                                Ver detalhes
                            </button>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
