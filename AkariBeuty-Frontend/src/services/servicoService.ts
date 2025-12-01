/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericService, createService } from './Generic/GenericService';

export interface Servico {
  id: number;
  servicoPrestado: string;
  descricao: string;
  valorBase: number;
  categoriaServicoId: number;
  empresaId: number;
  tempo?: number;
  categoriaServico?: CategoriaServico;
  empresa?: {
    id: number;
    nome: string;
  };
}

export interface CategoriaServico {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}

// Criar instâncias dos serviços usando o GenericService
const servicoGenericService = createService<Servico>('servico');
const categoriaServicoGenericService = createService<CategoriaServico>('categoriaservico');

export const servicoService = {
  // Métodos básicos do CRUD
  getAll: () => servicoGenericService.getAll(),
  getById: (id: number) => servicoGenericService.getById(id),
  create: (servico: Omit<Servico, 'id'>) => servicoGenericService.create(servico),
  update: (id: number, servico: Partial<Servico>) => servicoGenericService.update(id, servico),
  delete: (id: number) => servicoGenericService.delete(id),

  // Métodos específicos para serviços
  getByCategoria: (categoriaId: number) => 
    servicoGenericService.getByFilter({ categoriaServicoId: categoriaId }),
  
  getByEmpresa: (empresaId: number) => 
    servicoGenericService.getByFilter({ empresaId: empresaId }),

  // Métodos para categorias
  getCategorias: () => categoriaServicoGenericService.getAll(),
  getCategoriaById: (id: number) => categoriaServicoGenericService.getById(id),
  createCategoria: (categoria: Omit<CategoriaServico, 'id'>) => 
    categoriaServicoGenericService.create(categoria),
  updateCategoria: (id: number, categoria: Partial<CategoriaServico>) => 
    categoriaServicoGenericService.update(id, categoria),
  deleteCategoria: (id: number) => categoriaServicoGenericService.delete(id),

  // Métodos avançados
  getPaginated: (page: number = 1, pageSize: number = 10, filters?: Record<string, any>) =>
    servicoGenericService.getPaginated(page, pageSize, filters),
  
  count: (filters?: Record<string, any>) => servicoGenericService.count(filters),
  
  search: (searchTerm: string) => 
    servicoGenericService.getByFilter({ search: searchTerm }),
};
