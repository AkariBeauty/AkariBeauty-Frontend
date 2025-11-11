import BaseService from "./Generic/BaseService";

export type Agendamento = {
  id: number;
  clienteId: number;
  empresaId: number;
  profissionalId: number;
  servicoId: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
  observacao?: string;
};

export const AgendamentoService = {
  async listarMeus(clienteId: number, params?: { inicio?: string; fim?: string }) {
    const query = new URLSearchParams();
    if (params?.inicio) query.set("inicio", params.inicio);
    if (params?.fim) query.set("fim", params.fim);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return await new BaseService({
      method: "get",
      url: `agendamento/cliente/${clienteId}${qs}`,
    }).request<Agendamento[]>();
  },

  async criar(payload: Omit<Agendamento, "id" | "status">) {
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
