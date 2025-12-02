import BaseService from "./Generic/BaseService";
import {
  ProfessionalAgendaDay,
  ProfessionalDashboard,
  ProfessionalAgendaItem,
  ProfessionalProfile,
} from "../types";

export interface UpdateStatusPayload {
  novoStatus: number;
  justificativa?: string;
}

export interface UpdateProfessionalProfilePayload {
  nome: string;
  login: string;
  telefone?: string;
  senha?: string;
}

const professionalPortalService = {
  async getDashboard() {
    return new BaseService({ method: "get", url: "profissional/me/dashboard" }).request<ProfessionalDashboard>();
  },
  async getAgendaDia(date: string) {
    return new BaseService({
      method: "get",
      url: "profissional/me/agenda-dia",
      params: { data: date },
    }).request<ProfessionalAgendaDay>();
  },
  async getAgendaSemana(start: string) {
    return new BaseService({
      method: "get",
      url: "profissional/me/agenda-semana",
      params: { inicio: start },
    }).request<ProfessionalAgendaDay[]>();
  },
  async getAgendamentoDetalhe(id: number) {
    return new BaseService({
      method: "get",
      url: `profissional/me/agendamentos/${id}`,
    }).request<ProfessionalAgendaItem & { clienteId: number; servicos: { id: number; nome: string }[] }>();
  },
  async updateStatus(id: number, payload: UpdateStatusPayload) {
    await new BaseService({
      method: "patch",
      url: `profissional/me/agendamentos/${id}/status`,
      data: payload,
    }).request<void>();
  },
  async getPerfil() {
    return new BaseService({ method: "get", url: "profissional/me/perfil" }).request<ProfessionalProfile>();
  },
  async updatePerfil(payload: UpdateProfessionalProfilePayload) {
    await new BaseService({ method: "put", url: "profissional/me/perfil", data: payload }).request<void>();
  },
};

export default professionalPortalService;
