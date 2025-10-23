import {
  Client,
  ClientFilters,
  ClientId,
  ClientListResponse,
  CreateClientDTO,
  UpdateClientDTO,
} from '../types/client';
import { httpRequest } from './httpClient';

type ListResponse = ClientListResponse;

const normalizeFilters = (filters?: ClientFilters) => {
  if (!filters) return undefined;

  const params: Record<string, string> = {};

  if (filters.search) {
    params.search = filters.search;
  }

  if (filters.status && filters.status !== 'all') {
    params.status = filters.status;
  }

  return params;
};

export const clientService = {
  async list(filters?: ClientFilters): Promise<ListResponse> {
    return httpRequest<ListResponse>('/clients', {
      method: 'GET',
      params: normalizeFilters(filters),
    });
  },

  async get(id: ClientId): Promise<Client> {
    return httpRequest<Client>(`/clients/${id}`, {
      method: 'GET',
    });
  },

  async create(payload: CreateClientDTO): Promise<Client> {
    return httpRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        status: payload.status ?? 'active',
      }),
    });
  },

  async update(id: ClientId, payload: UpdateClientDTO): Promise<Client> {
    return httpRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async remove(id: ClientId): Promise<void> {
    await httpRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};

export type ClientService = typeof clientService;
