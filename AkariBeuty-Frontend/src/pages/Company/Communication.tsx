import { useCallback, useEffect, useMemo, useState } from "react";
import { PaperPlaneTilt, ChatsCircle, PencilSimple } from "@phosphor-icons/react";
import Modal from "../../components/UI/Modal";
import companyService from "../../services/companyService";
import type { CompanyCommunicationResponse, CompanyCommunicationTemplate } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useCompanySearch } from "../../contexts/CompanySearchContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

type TemplateFormState = {
    title: string;
    audience: string;
    status: "rascunho" | "agendado" | "enviado";
    scheduleDate: string;
};

type CommunicationFormState = {
    title: string;
    audience: string;
    channel: "email" | "sms" | "push";
    scheduleDate: string;
    message: string;
};

const templateInitialState: TemplateFormState = {
    title: "",
    audience: "",
    status: "rascunho",
    scheduleDate: "",
};

const communicationInitialState: CommunicationFormState = {
    title: "",
    audience: "Clientes ativos",
    channel: "email",
    scheduleDate: "",
    message: "",
};

const formatDateLabel = (value?: string) => {
    if (!value) return new Date().toLocaleDateString("pt-BR");
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return new Date().toLocaleDateString("pt-BR");
    return parsed.toLocaleDateString("pt-BR");
};

export default function CompanyCommunicationPage() {
    const { user, isLoading: authLoading } = useAuth();
    const empresaId = useMemo(() => resolveEmpresaIdFromUser(user), [user]);
    const storageKey = useMemo(() => (empresaId ? `akari_comm_${empresaId}` : null), [empresaId]);
    const { query: globalSearch } = useCompanySearch();

    const [data, setData] = useState<CompanyCommunicationResponse | null>(null);
    const [customTemplates, setCustomTemplates] = useState<CompanyCommunicationTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [templateModalOpen, setTemplateModalOpen] = useState(false);
    const [communicationModalOpen, setCommunicationModalOpen] = useState(false);
    const [templateForm, setTemplateForm] = useState<TemplateFormState>(templateInitialState);
    const [communicationForm, setCommunicationForm] =
        useState<CommunicationFormState>(communicationInitialState);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const persistCustomTemplates = useCallback(
        (items: CompanyCommunicationTemplate[]) => {
            if (!storageKey || typeof window === "undefined") return;
            try {
                localStorage.setItem(storageKey, JSON.stringify(items));
            } catch (persistError) {
                console.warn("Nao foi possivel salvar comunicados locais", persistError);
            }
        },
        [storageKey]
    );

    const loadCustomTemplates = useCallback((): CompanyCommunicationTemplate[] => {
        if (!storageKey || typeof window === "undefined") return [];
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored) return [];
            return JSON.parse(stored) as CompanyCommunicationTemplate[];
        } catch {
            return [];
        }
    }, [storageKey]);

    useEffect(() => {
        const load = async () => {
            if (authLoading) return;

            if (!empresaId) {
                setError("Não foi possível identificar a empresa do usuário.");
                setLoading(false);
                return;
            }

            try {
                const response = await companyService.getCommunication(empresaId);
                setData(response);
                const stored = loadCustomTemplates();
                setCustomTemplates(stored);
            } catch (err) {
                console.error("Erro ao carregar comunicações da empresa", err);
                setError("Não foi possível carregar as comunicações agora.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, empresaId, loadCustomTemplates]);

    const combinedTemplates = useMemo(() => {
        return [...customTemplates, ...(data?.templates ?? [])];
    }, [customTemplates, data]);

    const filteredTemplates = useMemo(() => {
        const term = globalSearch.trim().toLowerCase();
        if (!term) return combinedTemplates;
        return combinedTemplates.filter((template) => {
            return (
                template.title.toLowerCase().includes(term) ||
                template.audience.toLowerCase().includes(term) ||
                template.status.toLowerCase().includes(term)
            );
        });
    }, [combinedTemplates, globalSearch]);

    const appendCustomTemplate = (template: CompanyCommunicationTemplate) => {
        setCustomTemplates((prev) => {
            const next = [template, ...prev];
            persistCustomTemplates(next);
            return next;
        });
    };

    const handleTemplateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!templateForm.title.trim() || !templateForm.audience.trim()) {
            setActionError("Preencha título e público do template.");
            return;
        }

        const newTemplate: CompanyCommunicationTemplate = {
            id: Date.now(),
            title: templateForm.title.trim(),
            audience: templateForm.audience.trim(),
            status: templateForm.status,
            lastSend: formatDateLabel(templateForm.scheduleDate),
            openRate: 0,
        };

        appendCustomTemplate(newTemplate);
        setTemplateModalOpen(false);
        setTemplateForm(templateInitialState);
        setActionError(null);
        setActionFeedback("Template criado com sucesso.");
    };

    const handleCommunicationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!communicationForm.title.trim()) {
            setActionError("Informe um título para o comunicado.");
            return;
        }

        const scheduleLabel = formatDateLabel(communicationForm.scheduleDate);
        const status = communicationForm.scheduleDate ? "agendado" : "enviado";

        const newTemplate: CompanyCommunicationTemplate = {
            id: Date.now(),
            title: communicationForm.title.trim(),
            audience: `${communicationForm.audience} · ${communicationForm.channel.toUpperCase()}`,
            status,
            lastSend: scheduleLabel,
            openRate: 0,
        };

        appendCustomTemplate(newTemplate);
        setCommunicationModalOpen(false);
        setCommunicationForm(communicationInitialState);
        setActionError(null);
        setActionFeedback("Comunicado incluído na fila.");
    };

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
                            onClick={() => {
                                setTemplateForm(templateInitialState);
                                setTemplateModalOpen(true);
                                setActionError(null);
                                setActionFeedback(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <PencilSimple size={16} /> Criar template
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCommunicationForm(communicationInitialState);
                                setCommunicationModalOpen(true);
                                setActionError(null);
                                setActionFeedback(null);
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            <PaperPlaneTilt size={16} /> Novo comunicado
                        </button>
                    </>
                }
            />

            {(actionFeedback || actionError) && (
                <div
                    className={`rounded-2xl border p-4 text-sm ${
                        actionError
                            ? "border-rose-200 bg-rose-50 text-rose-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                >
                    {actionError ?? actionFeedback}
                </div>
            )}

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
                    {filteredTemplates.map((template) => (
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

            <Modal
                isOpen={templateModalOpen}
                onClose={() => setTemplateModalOpen(false)}
                title="Novo template"
            >
                <form className="space-y-4" onSubmit={handleTemplateSubmit}>
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Título
                        <input
                            type="text"
                            value={templateForm.title}
                            onChange={(event) =>
                                setTemplateForm((prev) => ({ ...prev, title: event.target.value }))
                            }
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Público
                        <input
                            type="text"
                            value={templateForm.audience}
                            onChange={(event) =>
                                setTemplateForm((prev) => ({
                                    ...prev,
                                    audience: event.target.value,
                                }))
                            }
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Status inicial
                            <select
                                value={templateForm.status}
                                onChange={(event) =>
                                    setTemplateForm((prev) => ({
                                        ...prev,
                                        status: event.target.value as TemplateFormState["status"],
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            >
                                <option value="rascunho">Rascunho</option>
                                <option value="agendado">Agendado</option>
                                <option value="enviado">Enviado</option>
                            </select>
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Próximo disparo
                            <input
                                type="date"
                                value={templateForm.scheduleDate}
                                onChange={(event) =>
                                    setTemplateForm((prev) => ({
                                        ...prev,
                                        scheduleDate: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setTemplateModalOpen(false)}
                            className="rounded-xl border border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Salvar template
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={communicationModalOpen}
                onClose={() => setCommunicationModalOpen(false)}
                title="Novo comunicado"
            >
                <form className="space-y-4" onSubmit={handleCommunicationSubmit}>
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Título do comunicado
                        <input
                            type="text"
                            value={communicationForm.title}
                            onChange={(event) =>
                                setCommunicationForm((prev) => ({
                                    ...prev,
                                    title: event.target.value,
                                }))
                            }
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Mensagem
                        <textarea
                            value={communicationForm.message}
                            onChange={(event) =>
                                setCommunicationForm((prev) => ({
                                    ...prev,
                                    message: event.target.value,
                                }))
                            }
                            rows={3}
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Público
                            <input
                                type="text"
                                value={communicationForm.audience}
                                onChange={(event) =>
                                    setCommunicationForm((prev) => ({
                                        ...prev,
                                        audience: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Canal
                            <select
                                value={communicationForm.channel}
                                onChange={(event) =>
                                    setCommunicationForm((prev) => ({
                                        ...prev,
                                        channel: event.target.value as CommunicationFormState["channel"],
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            >
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                                <option value="push">Push</option>
                            </select>
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Data de envio
                            <input
                                type="datetime-local"
                                value={communicationForm.scheduleDate}
                                onChange={(event) =>
                                    setCommunicationForm((prev) => ({
                                        ...prev,
                                        scheduleDate: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setCommunicationModalOpen(false)}
                            className="rounded-xl border border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Agendar envio
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
