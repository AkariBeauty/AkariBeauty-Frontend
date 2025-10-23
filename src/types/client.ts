export type ClientId = string;

export interface Client {
  id: ClientId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  document?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ClientFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

export interface CreateClientDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  document?: string;
  status?: 'active' | 'inactive';
  notes?: string;
}

export interface UpdateClientDTO extends Partial<CreateClientDTO> {}

export interface ClientListResponse {
  items: Client[];
  total: number;
}
