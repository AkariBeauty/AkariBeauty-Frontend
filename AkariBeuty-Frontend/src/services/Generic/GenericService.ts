import api from '../api';

export interface GenericEntity {
  id: number;
  [key: string]: any;
}

export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export class GenericService<T extends GenericEntity> {
  private modelUrl: string;

  constructor(modelUrl: string) {
    this.modelUrl = modelUrl;
  }

  /**
   * Buscar todos os registros
   */
  async getAll(): Promise<T[]> {
    try {
      const response = await api.get(`/${this.modelUrl}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${this.modelUrl}:`, error);
      throw error;
    }
  }

  /**
   * Buscar registro por ID
   */
  async getById(id: number): Promise<T> {
    try {
      const response = await api.get(`/${this.modelUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${this.modelUrl} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Buscar registros com filtros
   */
  async getByFilter(filters: Record<string, any>): Promise<T[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/${this.modelUrl}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${this.modelUrl} com filtros:`, error);
      throw error;
    }
  }

  /**
   * Criar novo registro
   */
  async create(entity: Omit<T, 'id'>): Promise<T> {
    try {
      const response = await api.post(`/${this.modelUrl}`, entity);
      return response.data;
    } catch (error) {
      console.error(`Erro ao criar ${this.modelUrl}:`, error);
      throw error;
    }
  }

  /**
   * Atualizar registro existente
   */
  async update(id: number, entity: Partial<T>): Promise<T> {
    try {
      const response = await api.put(`/${this.modelUrl}/${id}`, entity);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar ${this.modelUrl} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletar registro
   */
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/${this.modelUrl}/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar ${this.modelUrl} ${id}:`, error);
      throw error;
    }
  }

  /**
   * Buscar registros paginados
   */
  async getPaginated(page: number = 1, pageSize: number = 10, filters?: Record<string, any>): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...filters
      });
      
      const response = await api.get(`/${this.modelUrl}/paginated?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${this.modelUrl} paginado:`, error);
      throw error;
    }
  }

  /**
   * Buscar registros por campo específico
   */
  async getByField(field: string, value: any): Promise<T[]> {
    try {
      const response = await api.get(`/${this.modelUrl}/${field}/${value}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar ${this.modelUrl} por ${field}:`, error);
      throw error;
    }
  }

  /**
   * Contar registros
   */
  async count(filters?: Record<string, any>): Promise<number> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const response = await api.get(`/${this.modelUrl}/count?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao contar ${this.modelUrl}:`, error);
      throw error;
    }
  }
}

/**
 * Factory function para criar serviços específicos
 */
export function createService<T extends GenericEntity>(modelUrl: string): GenericService<T> {
  return new GenericService<T>(modelUrl);
}
