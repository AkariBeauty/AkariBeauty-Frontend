import { useCallback, useEffect, useMemo, useState } from "react";
import { SquaresFour, PlusCircle, ArrowsClockwise } from "@phosphor-icons/react";
import Modal from "../../components/UI/Modal";
import companyService from "../../services/companyService";
import { servicoService, getCategoriaDisplayName } from "../../services/servicoService";
import type { CategoriaServico, Servico } from "../../services/servicoService";
import type { CompanyServiceCatalogItem, CompanyServiceHistoryEntry } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useCompanySearch } from "../../contexts/CompanySearchContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

type ServiceFormState = {
    servicoPrestado: string;
    descricao: string;
    valorBase: string;
    categoriaServicoId: string;
    tempo: string;
};

const defaultServiceForm = (): ServiceFormState => ({
    servicoPrestado: "",
    descricao: "",
    valorBase: "0",
    categoriaServicoId: "",
    tempo: "60",
});

export default function CompanyServicesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const empresaId = useMemo(() => resolveEmpresaIdFromUser(user), [user]);
    const { query: globalSearch } = useCompanySearch();

    const [catalog, setCatalog] = useState<CompanyServiceCatalogItem[]>([]);
    const [history, setHistory] = useState<CompanyServiceHistoryEntry[]>([]);
    const [rawServices, setRawServices] = useState<Servico[]>([]);
    const [categories, setCategories] = useState<CategoriaServico[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [serviceMode, setServiceMode] = useState<"create" | "edit">("create");
    const [serviceForm, setServiceForm] = useState<ServiceFormState>(() => defaultServiceForm());
    const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
    const [serviceSubmitting, setServiceSubmitting] = useState(false);
    const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);
    const [serviceError, setServiceError] = useState<string | null>(null);

    const loadPageData = useCallback(async () => {
        if (!empresaId) return;
        setLoading(true);
        setError(null);
        try {
            const [servicesResponse, ownServices, categoryResponse] = await Promise.all([
                companyService.getServices(empresaId),
                servicoService.getByEmpresa(empresaId),
                servicoService.getCategorias(),
            ]);
            setCatalog(servicesResponse.catalog);
            setHistory(servicesResponse.history);
            setRawServices(ownServices);
            setCategories(categoryResponse);
        } catch (err) {
            console.error("Erro ao carregar serviços da empresa", err);
            setError("Não foi possível carregar o catálogo agora.");
        } finally {
            setLoading(false);
        }
    }, [empresaId]);

    useEffect(() => {
        if (authLoading) return;
        if (!empresaId) {
            setError("Não foi possível identificar a empresa do usuário.");
            setLoading(false);
            return;
        }
        void loadPageData();
    }, [authLoading, empresaId, loadPageData]);

    const filteredCatalog = useMemo(() => {
        const term = globalSearch.trim().toLowerCase();
        if (!term) return catalog;
        return catalog.filter((item) => {
            return (
                item.name.toLowerCase().includes(term) ||
                item.category.toLowerCase().includes(term) ||
                item.status.toLowerCase().includes(term)
            );
        });
    }, [catalog, globalSearch]);

    const resetServiceForm = () => {
        setServiceForm(defaultServiceForm());
        setServiceError(null);
        setServiceFeedback(null);
    };

    const openCreateModal = () => {
        setServiceMode("create");
        setEditingServiceId(null);
        resetServiceForm();
        setServiceModalOpen(true);
    };

    const populateForm = (service: Servico) => {
        setServiceForm({
            servicoPrestado: service.servicoPrestado,
            descricao: service.descricao,
            valorBase: String(service.valorBase ?? 0),
            categoriaServicoId: String(service.categoriaServicoId),
            tempo: String(service.tempo ?? 60),
        });
        setServiceError(null);
        setServiceFeedback(null);
    };

    const openEditModal = (serviceId: number) => {
        const target = rawServices.find((item) => item.id === serviceId);
        if (!target) {
            setServiceError("Não foi possível carregar o serviço selecionado.");
            return;
        }
        setServiceMode("edit");
        setEditingServiceId(serviceId);
        populateForm(target);
        setServiceModalOpen(true);
    };

    const openDuplicateModal = (serviceId: number) => {
        const target = rawServices.find((item) => item.id === serviceId);
        if (!target) {
            setServiceError("Não foi possível carregar o serviço selecionado.");
            return;
        }
        setServiceMode("create");
        setEditingServiceId(null);
        populateForm(target);
        setServiceModalOpen(true);
    };

    const closeServiceModal = () => {
        if (serviceSubmitting) return;
        setServiceModalOpen(false);
        resetServiceForm();
        setEditingServiceId(null);
    };

    const validateServiceForm = (): string | null => {
        if (!serviceForm.servicoPrestado.trim()) return "Informe o nome do serviço.";
        if (!serviceForm.descricao.trim()) return "Informe uma descrição.";
        const valor = Number(serviceForm.valorBase);
        if (!Number.isFinite(valor) || valor <= 0) return "Informe um valor válido.";
        if (!serviceForm.categoriaServicoId) return "Selecione uma categoria.";
        const tempo = Number(serviceForm.tempo);
        if (!Number.isFinite(tempo) || tempo <= 0) return "Informe o tempo médio em minutos.";
        if (!empresaId) return "Empresa não identificada.";
        return null;
    };

    const handleServiceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationError = validateServiceForm();
        if (validationError) {
            setServiceError(validationError);
            return;
        }

        if (!empresaId) return;

        const payload: Omit<Servico, "id"> = {
            servicoPrestado: serviceForm.servicoPrestado.trim(),
            descricao: serviceForm.descricao.trim(),
            valorBase: Number(serviceForm.valorBase),
            empresaId,
            categoriaServicoId: Number(serviceForm.categoriaServicoId),
            tempo: Number(serviceForm.tempo),
        };

        setServiceSubmitting(true);
        setServiceError(null);
        try {
            if (serviceMode === "edit" && editingServiceId) {
                await servicoService.update(editingServiceId, payload);
                setServiceFeedback("Serviço atualizado com sucesso.");
            } else {
                await servicoService.create(payload);
                setServiceFeedback("Serviço cadastrado com sucesso.");
            }
            setServiceModalOpen(false);
            resetServiceForm();
            await loadPageData();
        } catch (err) {
            console.error("Erro ao salvar serviço", err);
            setServiceError("Não foi possível salvar o serviço. Tente novamente.");
        } finally {
            setServiceSubmitting(false);
        }
    };

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
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md"
                        >
                            <PlusCircle size={16} /> Novo serviço
                        </button>
                    </>
                }
            />

            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            )}

            {(serviceFeedback || serviceError) && (
                <div
                    className={`rounded-2xl border p-4 text-sm ${
                        serviceError
                            ? "border-rose-200 bg-rose-50 text-rose-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                >
                    {serviceError ?? serviceFeedback}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-3">
                {filteredCatalog.map((item) => (
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
                                onClick={() => openEditModal(item.id)}
                                className="flex-1 rounded-2xl border border-bolt-primary-200 px-3 py-2 text-sm font-semibold text-bolt-primary-600"
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={() => openDuplicateModal(item.id)}
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

            <Modal
                isOpen={serviceModalOpen}
                onClose={closeServiceModal}
                title={serviceMode === "create" ? "Cadastrar serviço" : "Editar serviço"}
                size="lg"
            >
                <form className="space-y-4" onSubmit={handleServiceSubmit}>
                    {serviceError && (
                        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                            {serviceError}
                        </div>
                    )}
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Nome do serviço
                        <input
                            type="text"
                            value={serviceForm.servicoPrestado}
                            onChange={(event) =>
                                setServiceForm((prev) => ({
                                    ...prev,
                                    servicoPrestado: event.target.value,
                                }))
                            }
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <label className="text-sm font-medium text-bolt-neutral-600">
                        Descrição
                        <textarea
                            value={serviceForm.descricao}
                            onChange={(event) =>
                                setServiceForm((prev) => ({
                                    ...prev,
                                    descricao: event.target.value,
                                }))
                            }
                            rows={3}
                            className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                            required
                        />
                    </label>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Valor base (R$)
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={serviceForm.valorBase}
                                onChange={(event) =>
                                    setServiceForm((prev) => ({
                                        ...prev,
                                        valorBase: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Categoria
                            <select
                                value={serviceForm.categoriaServicoId}
                                onChange={(event) =>
                                    setServiceForm((prev) => ({
                                        ...prev,
                                        categoriaServicoId: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            >
                                <option value="">Selecione</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {getCategoriaDisplayName(category)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Tempo médio (min)
                            <input
                                type="number"
                                min={5}
                                step="5"
                                value={serviceForm.tempo}
                                onChange={(event) =>
                                    setServiceForm((prev) => ({
                                        ...prev,
                                        tempo: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeServiceModal}
                            className="rounded-xl border border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={serviceSubmitting}
                            className="rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {serviceSubmitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
