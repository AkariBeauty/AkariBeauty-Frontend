import api from './api';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoriaId: number;
  empresaId: number;
  ativo: boolean;
}

export interface CategoriaServico {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export const servicoService = {
  // Buscar todos os serviços
  async getAll(): Promise<Servico[]> {
    try {
      const response = await api.get('/servico');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
  },

  // Buscar serviço por ID
  async getById(id: number): Promise<Servico> {
    try {
      const response = await api.get(`/servico/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviço ${id}:`, error);
      throw error;
    }
  },

  // Buscar todas as categorias
  async getCategorias(): Promise<CategoriaServico[]> {
    try {
      const response = await api.get('/categoriaservico');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  // Buscar serviços por categoria
  async getByCategoria(categoriaId: number): Promise<Servico[]> {
    try {
      const response = await api.get(`/servico?categoriaId=${categoriaId}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar serviços da categoria ${categoriaId}:`, error);
      throw error;
    }
  }
};
