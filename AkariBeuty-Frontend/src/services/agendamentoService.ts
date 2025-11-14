import BaseService from "./Generic/BaseService";

export type Agendamento = {
  id: number;
  clienteId: number;
  dataHora: string;
  status: "PENDENTE" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";
  valor: number;
  comissao: number;
  servicos: { id: number; nome: string }[];
};

type CriarAgendamentoPayload = {
  clienteId: number;
  servicoId: number;
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
