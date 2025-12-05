import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ArrowsClockwise,
    FunnelSimple,
    Gear,
    LinkSimpleHorizontal,
    MagnifyingGlass,
    Trash,
    UserCircle,
    UserPlus,
    UsersThree,
} from "@phosphor-icons/react";
import Modal from "../../components/UI/Modal";
import { useAuth } from "../../contexts/AuthContext";
import { useCompanySearch } from "../../contexts/CompanySearchContext";
import companyService from "../../services/companyService";
import professionalManagementService from "../../services/professionalManagementService";
import type {
    CompanyServiceCatalogItem,
    ProfessionalManagementPayload,
    ProfessionalManagementRecord,
    ProfessionalServiceSummary,
    ProfessionalStatusCode,
} from "../../types";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

type AssignmentFormState = {
    servicoId: string;
    comissao: string;
    tempo: string; // HH:mm
};

const assignmentInitialState: AssignmentFormState = {
    servicoId: "",
    comissao: "",
    tempo: "00:30",
};

const statusOptions: Array<{ value: ProfessionalStatusCode; label: string }> = [
    { value: 1, label: "Ativo" },
    { value: 2, label: "Inativo" },
    { value: 3, label: "Afastado" },
];

const statusStyles: Record<ProfessionalStatusCode, string> = {
    1: "bg-emerald-50 text-emerald-600",
    2: "bg-rose-50 text-rose-600",
    3: "bg-amber-50 text-amber-700",
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

const extractErrorMessage = (err: unknown): string => {
    if (!err) return "Não foi possível completar a ação.";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message;
    if (typeof err === "object") {
        const response = (err as { response?: { data?: unknown } }).response;
        if (response?.data) {
            if (typeof response.data === "string") return response.data;
            if (typeof response.data === "object" && "message" in response.data) {
                const value = (response.data as { message?: unknown }).message;
                if (typeof value === "string") return value;
            }
        }
    }
    return "Não foi possível completar a ação.";
};

const isHttpStatus = (err: unknown, status: number): boolean => {
    if (!err || typeof err !== "object") return false;
    const response = (err as { response?: { status?: number } }).response;
    return response?.status === status;
};

const buildDefaultPayload = (empresaId?: number): ProfessionalManagementPayload => ({
    nome: "",
    cpf: "",
    salario: 0,
    login: "",
    senha: "",
    telefone: "",
    empresaId: empresaId ?? 0,
    status: 1,
});

const sanitizeDigits = (value: string) => value.replace(/\D/g, "");

const isValidCpf = (value: string) => {
    const digits = sanitizeDigits(value);
    if (digits.length !== 11) return false;
    if (digits.split("").every((digit) => digit === digits[0])) return false;

    const calculateCheckDigit = (length: number) => {
        let sum = 0;
        for (let i = 0; i < length; i += 1) {
            sum += Number(digits[i]) * (length + 1 - i);
        }
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateCheckDigit(9);
    if (firstDigit !== Number(digits[9])) return false;

    const secondDigit = calculateCheckDigit(10);
    return secondDigit === Number(digits[10]);
};

const normalizeProfessionalPayload = (
    payload: ProfessionalManagementPayload
): ProfessionalManagementPayload => ({
    ...payload,
    nome: payload.nome.trim(),
    login: payload.login.trim(),
    cpf: sanitizeDigits(payload.cpf),
    telefone: sanitizeDigits(payload.telefone),
});

const validateProfessionalPayload = (
    payload: ProfessionalManagementPayload,
    mode: "create" | "edit"
): string | null => {
    if (!payload.nome) return "Informe o nome do profissional.";

    if (!payload.login) return "Informe o login de acesso.";

    const cpfDigits = payload.cpf;
    if (cpfDigits.length !== 11 || cpfDigits.split("").every((digit) => digit === cpfDigits[0])) {
        return "CPF inválido. Digite 11 dígitos válidos.";
    }

    if (!isValidCpf(cpfDigits)) {
        return "CPF inválido. Informe um CPF válido.";
    }

    const phoneDigits = payload.telefone;
    if (
        phoneDigits.length !== 11 ||
        phoneDigits.split("").every((digit) => digit === phoneDigits[0])
    ) {
        return "Telefone inválido. Digite 11 dígitos válidos (DDD + número).";
    }

    if (!Number.isFinite(Number(payload.salario)) || Number(payload.salario) <= 0) {
        return "Informe um salário válido.";
    }

    const password = payload.senha ?? "";
    if (!password) {
        return "Informe uma senha para o profissional.";
    }

    if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
    ) {
        return "A senha precisa ter 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.";
    }

    if (!payload.empresaId) {
        return "Empresa não identificada.";
    }

    return null;
};

export default function CompanyProfessionalsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const empresaId = useMemo(() => resolveEmpresaIdFromUser(user), [user]);
    const { query: globalSearch } = useCompanySearch();

    const [professionals, setProfessionals] = useState<ProfessionalManagementRecord[]>([]);
    const [services, setServices] = useState<CompanyServiceCatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [formState, setFormState] = useState<ProfessionalManagementPayload>(() =>
        buildDefaultPayload(empresaId)
    );
    const [formMode, setFormMode] = useState<"create" | "edit">("create");
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [editingProfessional, setEditingProfessional] =
        useState<ProfessionalManagementRecord | null>(null);

    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [assignmentSubmitting, setAssignmentSubmitting] = useState(false);
    const [assignmentError, setAssignmentError] = useState<string | null>(null);
    const [assignmentForm, setAssignmentForm] =
        useState<AssignmentFormState>(assignmentInitialState);
    const [assignedServices, setAssignedServices] = useState<ProfessionalServiceSummary[]>([]);
    const [assignmentTarget, setAssignmentTarget] = useState<ProfessionalManagementRecord | null>(
        null
    );

    const loadData = useCallback(async () => {
        if (!empresaId) return;
        setLoading(true);
        setPageError(null);
        try {
            const [listResponse, servicesResponse] = await Promise.all([
                professionalManagementService.list(),
                companyService.getServices(empresaId),
            ]);

            const filtered = listResponse.filter(
                (item) => Number(item.empresaId) === Number(empresaId)
            );
            setProfessionals(filtered);
            setServices(servicesResponse.catalog ?? []);
        } catch (err) {
            setPageError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [empresaId]);

    useEffect(() => {
        if (authLoading) return;
        if (!empresaId) {
            setPageError("Não foi possível identificar a empresa do usuário.");
            setLoading(false);
            return;
        }
        void loadData();
    }, [authLoading, empresaId, loadData]);

    useEffect(() => {
        if (empresaId && formState.empresaId !== empresaId) {
            setFormState((prev) => ({ ...prev, empresaId }));
        }
    }, [empresaId, formState.empresaId]);

    const handleRefresh = () => {
        if (!empresaId || loading) return;
        void loadData();
    };

    const highlightCards = useMemo(() => {
        const total = professionals.length;
        const active = professionals.filter((item) => item.status === 1).length;
        const awayOrInactive = professionals.filter((item) => item.status !== 1).length;
        const salarySum = professionals.reduce((sum, item) => sum + (item.salario ?? 0), 0);
        const averageSalary = total ? salarySum / total : 0;

        return [
            {
                label: "Total de profissionais",
                value: String(total),
                helper: total === 1 ? "1 cadastro ativo" : `${total} cadastros ativos`,
                positive: true,
            },
            {
                label: "Na escala hoje",
                value: String(active),
                helper:
                    total === 0
                        ? "Sem profissionais"
                        : `${Math.round((active / total) * 100)}% da equipe ativa`,
                positive: active >= awayOrInactive,
            },
            {
                label: "Custo médio mensal",
                value: formatCurrency(averageSalary),
                helper: "Baseado no salário informado",
                positive: true,
            },
        ];
    }, [professionals]);

    const filteredProfessionals = useMemo(() => {
        const mergedTerm = (search || globalSearch).trim().toLowerCase();
        if (!mergedTerm) return professionals;
        return professionals.filter((item) => {
            return (
                item.nome.toLowerCase().includes(mergedTerm) ||
                item.cpf.toLowerCase().includes(mergedTerm) ||
                item.login.toLowerCase().includes(mergedTerm) ||
                item.telefone.toLowerCase().includes(mergedTerm)
            );
        });
    }, [professionals, search, globalSearch]);

    const statusDistribution = useMemo(() => {
        return professionals.reduce(
            (acc, item) => ({
                ...acc,
                [item.status]: (acc[item.status] ?? 0) + 1,
            }),
            {} as Record<ProfessionalStatusCode, number>
        );
    }, [professionals]);

    const openCreateModal = () => {
        setFormMode("create");
        setEditingProfessional(null);
        setFormState(buildDefaultPayload(empresaId));
        setFormModalOpen(true);
        setActionError(null);
        setFormError(null);
    };

    const openEditModal = (record: ProfessionalManagementRecord) => {
        setFormMode("edit");
        setEditingProfessional(record);
        setFormState({
            nome: record.nome,
            cpf: record.cpf,
            salario: record.salario,
            login: record.login,
            senha: "",
            telefone: record.telefone,
            empresaId: record.empresaId,
            status: record.status,
        });
        setFormModalOpen(true);
        setActionError(null);
        setFormError(null);
    };

    const closeFormModal = () => {
        if (formSubmitting) return;
        setFormModalOpen(false);
        setFormState(buildDefaultPayload(empresaId));
        setEditingProfessional(null);
        setFormError(null);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!empresaId) {
            setActionError("Empresa não identificada para concluir a operação.");
            return;
        }

        const normalizedPayload = normalizeProfessionalPayload({ ...formState, empresaId });
        const validationError = validateProfessionalPayload(normalizedPayload, formMode);
        if (validationError) {
            setFormError(validationError);
            setActionError(validationError);
            return;
        }

        setFormSubmitting(true);
        setActionError(null);
        setActionMessage(null);
        setFormError(null);
        try {
            if (formMode === "create") {
                await professionalManagementService.create(normalizedPayload);
                setActionMessage("Profissional cadastrado com sucesso.");
            } else if (editingProfessional) {
                const updatePayload = normalizeProfessionalPayload({
                    ...formState,
                    empresaId: editingProfessional.empresaId,
                });
                await professionalManagementService.update(editingProfessional.id, {
                    ...updatePayload,
                    id: editingProfessional.id,
                });
                setActionMessage("Dados do profissional atualizados.");
            }
            setFormModalOpen(false);
            setFormState(buildDefaultPayload(empresaId));
            setFormError(null);
            await loadData();
        } catch (err) {
            const message = extractErrorMessage(err);
            setFormError(message);
            setActionError(message);
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleDelete = async (record: ProfessionalManagementRecord) => {
        const confirmation = window.confirm(
            `Remover ${record.nome}? Esta ação não poderá ser desfeita.`
        );
        if (!confirmation) return;
        setActionError(null);
        setActionMessage(null);
        try {
            await professionalManagementService.remove(record.id);
            setActionMessage("Profissional removido.");
            await loadData();
        } catch (err) {
            setActionError(extractErrorMessage(err));
        }
    };

    const openAssignmentModal = async (record: ProfessionalManagementRecord) => {
        setAssignmentTarget(record);
        setAssignmentModalOpen(true);
        setAssignmentLoading(true);
        setAssignmentError(null);
        setAssignmentForm(assignmentInitialState);
        try {
            const response = await professionalManagementService.getServices(record.id);
            setAssignedServices(response);
        } catch (err) {
            if (isHttpStatus(err, 404)) {
                setAssignedServices([]);
                setAssignmentError(null);
            } else {
                setAssignmentError(extractErrorMessage(err));
                setAssignedServices([]);
            }
        } finally {
            setAssignmentLoading(false);
        }
    };

    const closeAssignmentModal = () => {
        if (assignmentSubmitting) return;
        setAssignmentModalOpen(false);
        setAssignmentTarget(null);
        setAssignedServices([]);
        setAssignmentForm(assignmentInitialState);
    };

    const handleAssignService = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!assignmentTarget) return;
        if (!assignmentForm.servicoId || !assignmentForm.comissao) {
            setAssignmentError("Preencha serviço e comissão para continuar.");
            return;
        }

        setAssignmentSubmitting(true);
        setAssignmentError(null);
        try {
            await professionalManagementService.assignService({
                profissionalId: assignmentTarget.id,
                servicoId: Number(assignmentForm.servicoId),
                comissao: Number(assignmentForm.comissao),
                tempo:
                    assignmentForm.tempo && assignmentForm.tempo.length === 5
                        ? `${assignmentForm.tempo}:00`
                        : assignmentForm.tempo,
            });
            try {
                const refreshed = await professionalManagementService.getServices(
                    assignmentTarget.id
                );
                setAssignedServices(refreshed);
            } catch (refetchError) {
                if (isHttpStatus(refetchError, 404)) {
                    setAssignedServices([]);
                    setAssignmentError(null);
                } else {
                    setAssignmentError(extractErrorMessage(refetchError));
                }
            }
            setAssignmentForm(assignmentInitialState);
        } catch (err) {
            setAssignmentError(extractErrorMessage(err));
        } finally {
            setAssignmentSubmitting(false);
        }
    };

    const handleRemoveService = async (serviceId: number) => {
        if (!assignmentTarget) return;
        setAssignmentError(null);
        try {
            await professionalManagementService.removeService(assignmentTarget.id, serviceId);
            try {
                const refreshed = await professionalManagementService.getServices(
                    assignmentTarget.id
                );
                setAssignedServices(refreshed);
            } catch (refetchError) {
                if (isHttpStatus(refetchError, 404)) {
                    setAssignedServices([]);
                    setAssignmentError(null);
                } else {
                    setAssignmentError(extractErrorMessage(refetchError));
                }
            }
        } catch (err) {
            setAssignmentError(extractErrorMessage(err));
        }
    };

    const availableServices = useMemo(() => {
        if (!assignedServices.length) return services;
        const assignedIds = new Set(assignedServices.map((item) => item.id));
        return services.filter((service) => !assignedIds.has(service.id));
    }, [services, assignedServices]);

    if (loading && professionals.length === 0) {
        return <p className="mt-4 text-bolt-neutral-500">Carregando profissionais...</p>;
    }

    if (pageError) {
        return (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                {pageError}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Equipe e performance"
                title="Profissionais"
                actions={
                    <>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600 disabled:opacity-60"
                            disabled={loading}
                        >
                            <ArrowsClockwise
                                size={16}
                                className={loading ? "animate-spin" : undefined}
                            />
                            Atualizar
                        </button>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            <UserPlus size={16} /> Novo profissional
                        </button>
                    </>
                }
            />

            {(actionError || actionMessage) && (
                <div
                    className={`rounded-2xl border p-4 text-sm ${
                        actionError
                            ? "border-rose-200 bg-rose-50 text-rose-600"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                >
                    {actionError ?? actionMessage}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-3">
                {highlightCards.map((item) => (
                    <article key={item.label} className={`${companyCardClass} space-y-2`}>
                        <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                            {item.label}
                        </p>
                        <p className="text-2xl font-semibold text-bolt-neutral-900">{item.value}</p>
                        <p
                            className={`text-sm font-medium ${
                                item.positive ? "text-emerald-600" : "text-rose-500"
                            }`}
                        >
                            {item.helper}
                        </p>
                    </article>
                ))}
            </section>

            <section className={`${companyCardClass} space-y-4`}>
                <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                        <UsersThree size={20} />
                    </div>
                    <div>
                        <p className="text-sm text-bolt-neutral-500">Pipeline de talentos</p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Cadastros, disponibilidade e serviços
                        </h2>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-bolt-primary-100 bg-white px-3 py-2">
                        <MagnifyingGlass size={16} className="text-bolt-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar por nome, CPF, login ou telefone"
                            className="flex-1 border-none bg-transparent text-sm text-bolt-neutral-700 placeholder:text-bolt-neutral-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                        >
                            <FunnelSimple size={16} /> Filtros avançados
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl border border-dashed border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-neutral-500"
                        >
                            Exportar relatório
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                    {statusOptions.map((option) => (
                        <span
                            key={option.value}
                            className="rounded-full border border-bolt-primary-100 bg-bolt-primary-50 px-3 py-1 font-semibold text-bolt-neutral-600"
                        >
                            {option.label}: {statusDistribution[option.value] ?? 0}
                        </span>
                    ))}
                    <span className="rounded-full border border-dashed border-bolt-primary-100 px-3 py-1 font-semibold text-bolt-neutral-500">
                        Serviços ativos: {services.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-bolt-neutral-600">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                                <th className="px-4 py-2">Profissional</th>
                                <th className="px-4 py-2">CPF</th>
                                <th className="px-4 py-2">Telefone</th>
                                <th className="px-4 py-2">Login</th>
                                <th className="px-4 py-2">Salário</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfessionals.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-6 text-center text-sm text-bolt-neutral-500"
                                    >
                                        {search
                                            ? "Nenhum profissional corresponde ao filtro aplicado."
                                            : "Nenhum profissional cadastrado."}
                                    </td>
                                </tr>
                            ) : (
                                filteredProfessionals.map((professional) => (
                                    <tr
                                        key={professional.id}
                                        className="border-t border-bolt-primary-50"
                                    >
                                        <td className="px-4 py-3 text-bolt-neutral-900">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-bolt-primary-50 text-bolt-primary-600">
                                                    <UserCircle size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-bolt-neutral-900">
                                                        {professional.nome}
                                                    </p>
                                                    <p className="text-xs text-bolt-neutral-400">
                                                        ID #{professional.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-bolt-neutral-500">
                                            {professional.cpf}
                                        </td>
                                        <td className="px-4 py-3">{professional.telefone}</td>
                                        <td className="px-4 py-3">{professional.login}</td>
                                        <td className="px-4 py-3">
                                            {formatCurrency(professional.salario)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[professional.status]
                                                }`}
                                            >
                                                {statusOptions.find(
                                                    (option) => option.value === professional.status
                                                )?.label ?? "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2 text-bolt-neutral-500">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openAssignmentModal(professional)
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-xl border border-bolt-primary-100 px-3 py-1 text-xs font-semibold text-bolt-primary-600"
                                                >
                                                    <LinkSimpleHorizontal size={14} /> Serviços
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(professional)}
                                                    className="rounded-xl border border-bolt-primary-100 p-2 text-bolt-primary-600"
                                                >
                                                    <Gear size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(professional)}
                                                    className="rounded-xl border border-rose-100 p-2 text-rose-500"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <Modal
                isOpen={formModalOpen}
                onClose={closeFormModal}
                title={formMode === "create" ? "Cadastrar profissional" : "Editar profissional"}
                size="lg"
            >
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    {formError && (
                        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                            {formError}
                        </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Nome completo
                            <input
                                type="text"
                                value={formState.nome}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, nome: event.target.value }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            CPF
                            <input
                                type="text"
                                value={formState.cpf}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, cpf: event.target.value }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Telefone
                            <input
                                type="tel"
                                value={formState.telefone}
                                onChange={(event) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        telefone: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Login
                            <input
                                type="text"
                                value={formState.login}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, login: event.target.value }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Senha
                            <input
                                type="password"
                                value={formState.senha}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, senha: event.target.value }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                placeholder={
                                    formMode === "edit" ? "Informe uma nova senha" : undefined
                                }
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Salário base (R$)
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={formState.salario ?? 0}
                                onChange={(event) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        salario: Number(event.target.value),
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            />
                        </label>
                        <label className="text-sm font-medium text-bolt-neutral-600">
                            Status
                            <select
                                value={formState.status}
                                onChange={(event) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        status: Number(
                                            event.target.value
                                        ) as ProfessionalStatusCode,
                                    }))
                                }
                                className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                required
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {formMode === "edit" && (
                        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
                            Ao editar um profissional, é necessário informar uma nova senha para
                            manter o acesso seguro.
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={closeFormModal}
                            className="rounded-xl border border-bolt-primary-100 px-4 py-2 text-sm font-semibold text-bolt-neutral-600"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={formSubmitting}
                            className="rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {formSubmitting ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={assignmentModalOpen}
                onClose={closeAssignmentModal}
                title={assignmentTarget ? `Serviços de ${assignmentTarget.nome}` : "Serviços"}
                size="lg"
            >
                {assignmentTarget ? (
                    <div className="space-y-4">
                        <form className="space-y-3" onSubmit={handleAssignService}>
                            <div className="grid gap-4 md:grid-cols-3">
                                <label className="text-sm font-medium text-bolt-neutral-600">
                                    Serviço
                                    <select
                                        value={assignmentForm.servicoId}
                                        onChange={(event) =>
                                            setAssignmentForm((prev) => ({
                                                ...prev,
                                                servicoId: event.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                    >
                                        <option value="">Selecione</option>
                                        {availableServices.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name ?? `Serviço #${service.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="text-sm font-medium text-bolt-neutral-600">
                                    Comissão (%)
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step="0.5"
                                        value={assignmentForm.comissao}
                                        onChange={(event) =>
                                            setAssignmentForm((prev) => ({
                                                ...prev,
                                                comissao: event.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                    />
                                </label>
                                <label className="text-sm font-medium text-bolt-neutral-600">
                                    Tempo médio
                                    <input
                                        type="time"
                                        value={assignmentForm.tempo}
                                        onChange={(event) =>
                                            setAssignmentForm((prev) => ({
                                                ...prev,
                                                tempo: event.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full rounded-xl border border-bolt-primary-100 px-3 py-2 text-sm focus:border-bolt-primary-400 focus:outline-none"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={assignmentSubmitting}
                                    className="inline-flex items-center gap-2 rounded-xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    <LinkSimpleHorizontal size={16} />
                                    {assignmentSubmitting ? "Vinculando..." : "Vincular serviço"}
                                </button>
                            </div>
                        </form>

                        {assignmentError && (
                            <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                                {assignmentError}
                            </div>
                        )}

                        {assignmentLoading ? (
                            <p className="text-sm text-bolt-neutral-500">Carregando serviços...</p>
                        ) : assignedServices.length === 0 ? (
                            <p className="text-sm text-bolt-neutral-500">
                                Nenhum serviço vinculado a este profissional.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {assignedServices.map((service) => (
                                    <div
                                        key={`${assignmentTarget.id}-${service.id}`}
                                        className="flex items-center justify-between rounded-xl border border-bolt-primary-50 px-4 py-3"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-bolt-neutral-900">
                                                {service.nome}
                                            </p>
                                            {service.descricao ? (
                                                <p className="text-xs text-bolt-neutral-500">
                                                    {service.descricao}
                                                </p>
                                            ) : null}
                                            {service.valorBase ? (
                                                <p className="text-xs text-bolt-neutral-400">
                                                    Valor base: {service.valorBase}
                                                </p>
                                            ) : null}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveService(service.id)}
                                            className="rounded-xl border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-500"
                                        >
                                            <Trash size={14} /> Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}
