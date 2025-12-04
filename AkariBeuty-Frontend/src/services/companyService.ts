import BaseService from "./Generic/BaseService";
import { servicoService } from "./servicoService";
import type { Servico } from "./servicoService";
import type {
    CompanyAgendaResponse,
    CompanyAuditResponse,
    CompanyClientsResponse,
    CompanyCommunicationResponse,
    CompanyDashboardData,
    CompanyFinanceResponse,
    CompanyProfile,
    CompanyProfessionalsResponse,
    CompanyServiceCatalogItem,
    CompanyServiceHistoryEntry,
    CompanySettingsData,
} from "../types";
import { normalizeEmpresaIdentifier, resolveEmpresaIdFromStorage } from "../utils/company";

type AgendaRequestFilters = {
    start?: string;
    end?: string;
    empresaId?: string | number;
};

type CompanyServicesResponse = {
    catalog: CompanyServiceCatalogItem[];
    history: CompanyServiceHistoryEntry[];
};

const formatCurrencyValue = (value: string | number | null | undefined) => {
    const numeric = typeof value === "string" ? Number(value) : value ?? 0;
    const target = Number.isFinite(numeric) ? Number(numeric) : 0;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(target);
};

const mapServicoToCatalogItem = (servico: Servico): CompanyServiceCatalogItem => ({
    id: servico.id,
    name: servico.servicoPrestado ?? `Serviço #${servico.id}`,
    category: servico.categoriaServico?.nome ?? "Serviço",
    price: formatCurrencyValue(servico.valorBase),
    duration: servico.tempo ? `${servico.tempo} min` : "60 min",
    status: "ativo",
    updatedAt: "Catálogo base",
    version: "v1",
    updatedBy: servico.empresa?.nome ?? "Equipe",
});

const buildFallbackHistory = (catalog: CompanyServiceCatalogItem[]): CompanyServiceHistoryEntry[] =>
    catalog.slice(0, 5).map((item) => ({
        id: item.id,
        name: item.name,
        changes: `Registro sincronizado por ${item.updatedBy}`,
        updatedAt: item.updatedAt,
    }));

const fetchServicesFallback = async (
    empresaId?: string | number
): Promise<CompanyServicesResponse> => {
    const resolved = resolveEmpresaId(empresaId);
    if (!hasValue(resolved)) {
        return { catalog: [], history: [] };
    }

    try {
        const servicos = await servicoService.getAll();
        const filtered = servicos.filter((item) => Number(item.empresaId) === Number(resolved));
        const catalog = filtered.map(mapServicoToCatalogItem);
        return {
            catalog,
            history: buildFallbackHistory(catalog),
        };
    } catch (fallbackError) {
        console.warn("Fallback de serviços indisponível", fallbackError);
        return { catalog: [], history: [] };
    }
};

const hasValue = (value: string | number | undefined | null): value is string | number =>
    value !== undefined && value !== null && value !== "";

const resolveEmpresaId = (empresaId?: string | number) =>
    normalizeEmpresaIdentifier(empresaId ?? null) ?? resolveEmpresaIdFromStorage();

const ensureEmpresaId = (empresaId?: string | number) => {
    const resolved = resolveEmpresaId(empresaId);
    if (!hasValue(resolved)) {
        throw new Error("Empresa não identificada no token");
    }
    return resolved;
};

const buildEmpresaParams = (empresaId?: string | number) => {
    const resolved = resolveEmpresaId(empresaId);
    return hasValue(resolved) ? { empresaId: resolved } : undefined;
};

const buildAgendaParams = (filters?: AgendaRequestFilters) => {
    const params: Record<string, string | number> = {};
    const resolvedEmpresaId = resolveEmpresaId(filters?.empresaId);

    if (hasValue(resolvedEmpresaId)) params.empresaId = resolvedEmpresaId;
    if (filters?.start) params.inicio = filters.start;
    if (filters?.end) params.fim = filters.end;

    if (Object.keys(params).length) return params;

    const fallbackEmpresa = resolveEmpresaId();
    return hasValue(fallbackEmpresa) ? { empresaId: fallbackEmpresa } : undefined;
};

const companyService = {
    async getDashboard(empresaId?: string | number): Promise<CompanyDashboardData> {
        return await new BaseService({
            method: "get",
            url: "empresa/dashboard",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyDashboardData>();
    },
    async getProfile(empresaId?: string | number): Promise<CompanyProfile> {
        const targetId = ensureEmpresaId(empresaId);
        return await new BaseService({
            method: "get",
            url: `empresa/${targetId}`,
        }).request<CompanyProfile>();
    },
    async getProfessionals(empresaId?: string | number): Promise<CompanyProfessionalsResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/profissionais",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyProfessionalsResponse>();
    },
    async getServices(empresaId?: string | number): Promise<CompanyServicesResponse> {
        try {
            return await new BaseService({
                method: "get",
                url: "empresa/servicos",
                params: buildEmpresaParams(empresaId),
            }).request<CompanyServicesResponse>();
        } catch (error) {
            console.warn(
                "Serviços corporativos avançados indisponíveis, usando fallback simplificado.",
                error
            );
            return await fetchServicesFallback(empresaId);
        }
    },
    async getAgenda(filters?: AgendaRequestFilters): Promise<CompanyAgendaResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/agenda",
            params: buildAgendaParams(filters),
        }).request<CompanyAgendaResponse>();
    },
    async getClients(empresaId?: string | number): Promise<CompanyClientsResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/clientes",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyClientsResponse>();
    },
    async getFinance(empresaId?: string | number): Promise<CompanyFinanceResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/financeiro",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyFinanceResponse>();
    },
    async getSettings(empresaId?: string | number): Promise<CompanySettingsData> {
        return await new BaseService({
            method: "get",
            url: "empresa/config",
            params: buildEmpresaParams(empresaId),
        }).request<CompanySettingsData>();
    },
    async getCommunication(empresaId?: string | number): Promise<CompanyCommunicationResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/comunicacao",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyCommunicationResponse>();
    },
    async getAuditLogs(empresaId?: string | number): Promise<CompanyAuditResponse> {
        return await new BaseService({
            method: "get",
            url: "empresa/auditoria",
            params: buildEmpresaParams(empresaId),
        }).request<CompanyAuditResponse>();
    },
};

export default companyService;
