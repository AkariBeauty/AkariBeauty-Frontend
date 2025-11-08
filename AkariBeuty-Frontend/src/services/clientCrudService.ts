import api  from "./api";


export type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  uf: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
  login: string;
  senha: string;
  telefone: string;
};


export type ClienteFormValues = {
  nome: string;
  cpf: string;
  uf: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: number;
  login: string;
  senha: string;
  telefone: string;
};

export type CreateClienteDTO = {
  Nome: string;
  Cpf: string;
  Uf: string;
  Cidade: string;
  Bairro: string;
  Rua: string;
  Numero: number;
  Login: string;
  Senha: string;
  Telefone: string;
};
export type UpdateClienteDTO = CreateClienteDTO;

export const toCreateClienteDTO = (f: ClienteFormValues): CreateClienteDTO => ({
  Nome: f.nome,
  Cpf: f.cpf,
  Uf: f.uf,
  Cidade: f.cidade,
  Bairro: f.bairro,
  Rua: f.rua,
  Numero: f.numero,
  Login: f.login,
  Senha: f.senha,
  Telefone: f.telefone,
});
export const toUpdateClienteDTO = toCreateClienteDTO;

const base = "/Cliente";

export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const { data } = await api.get<Cliente[]>(base);
    return data;
  },

  async getById(id: number): Promise<Cliente> {
    const { data } = await api.get<Cliente>(`${base}/${id}`);
    return data;
  },

  async create(payload: CreateClienteDTO): Promise<Cliente> {
    const { data } = await api.post<Cliente>(base, payload);
    return data;
  },

  async update(id: number, payload: UpdateClienteDTO): Promise<void> {
    await api.put<void>(`${base}/${id}`, payload);
  },

  async delete(id: number): Promise<void> {
    await api.delete<void>(`${base}/${id}`);
  },
};
