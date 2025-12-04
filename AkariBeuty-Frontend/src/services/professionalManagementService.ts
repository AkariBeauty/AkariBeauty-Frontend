import BaseService from "./Generic/BaseService";
import type {
    ProfessionalAssignServicePayload,
    ProfessionalManagementPayload,
    ProfessionalManagementRecord,
    ProfessionalServiceSummary,
} from "../types";

const professionalManagementService = {
    async list(): Promise<ProfessionalManagementRecord[]> {
        return await new BaseService({ method: "get", url: "profissional" }).request();
    },
    async create(payload: ProfessionalManagementPayload): Promise<ProfessionalManagementRecord> {
        return await new BaseService({
            method: "post",
            url: "profissional",
            data: payload,
        }).request();
    },
    async update(
        id: number,
        payload: ProfessionalManagementPayload & { id: number }
    ): Promise<ProfessionalManagementRecord> {
        return await new BaseService({
            method: "put",
            url: `profissional/${id}`,
            data: payload,
        }).request();
    },
    async remove(id: number): Promise<void> {
        await new BaseService({ method: "delete", url: `profissional/${id}` }).request();
    },
    async getServices(professionalId: number): Promise<ProfessionalServiceSummary[]> {
        const response = await new BaseService({
            method: "get",
            url: `profissional/${professionalId}/servicos`,
        }).request<Array<Record<string, unknown>>>();

        return response.map((item) => {
            const idSource = item.id ?? item.Id ?? item.servicoId ?? item.ServicoId ?? 0;
            const rawName =
                item.nome ??
                item.Nome ??
                item.servicoPrestado ??
                item.ServicoPrestado ??
                `Serviço #${idSource}`;
            return {
                id: Number(idSource),
                nome: String(rawName),
                descricao: (item.descricao as string) ?? (item.Descricao as string) ?? undefined,
                valorBase: (item.valorBase as number | string | undefined) ?? item.ValorBase,
            } satisfies ProfessionalServiceSummary;
        });
    },
    async assignService(payload: ProfessionalAssignServicePayload): Promise<void> {
        await new BaseService({
            method: "post",
            url: "profissional/add-servico",
            data: payload,
        }).request();
    },
    async removeService(professionalId: number, serviceId: number): Promise<void> {
        await new BaseService({
            method: "delete",
            url: `profissional/${professionalId}/remove-servico/${serviceId}`,
        }).request();
    },
};

export default professionalManagementService;
