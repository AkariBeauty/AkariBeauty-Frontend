import BaseService from "./Generic/BaseService";

export type ProfissionalEspecialidade = {
  servicoId?: number;
  servicoNome?: string;
};

export type ProfissionalApi = {
  id: number;
  nome: string;
  telefone?: string;
  rating?: number;
  totalAvaliacoes?: number;
  profissionalServicos?: Array<{
    servicoId: number;
    servico?: { servicoPrestado?: string };
  }>;
};

export type ListProfissionaisParams = {
  servicoId?: number;
  categoriaId?: number;
};

export const profissionalService = {
  async listar(params?: ListProfissionaisParams) {
    const hasServicoFilter = Boolean(params?.servicoId);
    const response = await new BaseService({
      method: "get",
      url: hasServicoFilter
        ? `profissional/por-servico/${params?.servicoId}`
        : "profissional",
      params: hasServicoFilter ? undefined : params,
    }).request<ProfissionalApi[]>();

    return response;
  },
};

export default profissionalService;
