import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clientService, ClientService } from '../services/clientService';
import { Client, ClientFilters, ClientId, CreateClientDTO, UpdateClientDTO } from '../types/client';

export interface ClientContextValue {
  clients: Client[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  filters: ClientFilters;
  listClients: (filters?: ClientFilters) => Promise<void>;
  createClient: (payload: CreateClientDTO) => Promise<Client>;
  updateClient: (id: ClientId, payload: UpdateClientDTO) => Promise<Client>;
  removeClient: (id: ClientId) => Promise<void>;
  service: ClientService;
}

const defaultFilters: ClientFilters = {
  status: 'all',
};

const ClientContext = createContext<ClientContextValue | undefined>(undefined);

export const ClientProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<ClientFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const listClients = useCallback(async (overrideFilters?: ClientFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = overrideFilters ?? filters;
      const { items, total } = await clientService.list(params);
      setClients(items);
      setTotal(total);
      if (overrideFilters) {
        setFilters({ ...defaultFilters, ...overrideFilters });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createClient = useCallback(async (payload: CreateClientDTO) => {
    const result = await clientService.create(payload);
    setClients((prev) => [result, ...prev]);
    setTotal((prev) => prev + 1);
    return result;
  }, []);

  const updateClient = useCallback(async (id: ClientId, payload: UpdateClientDTO) => {
    const result = await clientService.update(id, payload);
    setClients((prev) => prev.map((item) => (item.id === id ? result : item)));
    return result;
  }, []);

  const removeClient = useCallback(async (id: ClientId) => {
    await clientService.remove(id);
    setClients((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(prev - 1, 0));
  }, []);

  const value = useMemo<ClientContextValue>(() => ({
    clients,
    total,
    filters,
    isLoading,
    error,
    listClients,
    createClient,
    updateClient,
    removeClient,
    service: clientService,
  }), [clients, total, filters, isLoading, error, listClients, createClient, updateClient, removeClient]);

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};

export const useClientContext = (): ClientContextValue => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }

  return context;
};
