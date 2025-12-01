import BaseService from "./Generic/BaseService";

export type AgendamentoStatus =
  | "PENDENTE"
  | "CONFIRMADO"
  | "CANCELADO"
  | "AUSENTE"
  | "COBRADO"
  | "REALIZADO"
  | "CANCELADO_EMPRESA";

export type AgendamentoServico = {
  id: number;
  nome: string;
  duracao?: number | null;
  duration?: number | null;
  duracaoMinutos?: number | null;
  duracaoMin?: number | null;
  tempoEstimado?: number | null;
  tempo?: number | null;
  tempoServico?: number | null;
};

export type Agendamento = {
  id: number;
  clienteId: number;
  dataHora: string;
  status: AgendamentoStatus;
  valor: number;
  comissao: number;
  servicos: AgendamentoServico[];
  profissional?: {
    id: number;
    nome: string;
    telefone?: string | null;
  } | null;
  profissionalId?: number | null;
  observacao?: string | null;
};

type CriarAgendamentoPayload = {
  clienteId: number;
  servicoId: number;
  profissionalId: number;
  dataHora: string;
  observacao?: string;
};

export const AgendamentoService = {
  async listarMeus(clienteId: number, params?: { inicio?: string; fim?: string }) {
    const query = new URLSearchParams();
    if (params?.inicio) query.set("inicio", params.inicio);
    if (params?.fim) query.set("fim", params.fim);
    const qs = query.toString() ? `?${query.toString()}` : "";
    const response = await new BaseService({
      method: "get",
      url: `agendamento/cliente/${clienteId}${qs}`,
    }).request<Agendamento[]>();

    return response.map((item) => ({
      ...item,
      dataHora: String(item.dataHora),
      profissionalId: item.profissional?.id ?? null,
    }));
  },

  async criar(payload: CriarAgendamentoPayload) {
    return await new BaseService({
      method: "post",
      url: `agendamento`,
      data: payload,
    }).request<Agendamento>();
  },

  async atualizar(id: number, data: Partial<Agendamento>) {
    await new BaseService({
      method: "put",
      url: `agendamento/${id}`,
      data,
    }).request();
  },

  async cancelar(id: number) {
    await new BaseService({
      method: "delete",
      url: `agendamento/${id}`,
    }).request();
  },
};
