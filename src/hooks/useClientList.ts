import { useCallback, useEffect, useState } from 'react';
import { useClientContext } from '../context/ClientContext';
import { ClientFilters } from '../types/client';

export interface UseClientListOptions {
  autoFetch?: boolean;
  initialFilters?: ClientFilters;
}

export const useClientList = (options: UseClientListOptions = {}) => {
  const { autoFetch = true, initialFilters } = options;
  const { clients, total, isLoading, error, listClients } = useClientContext();
  const [filters, setFilters] = useState<ClientFilters>(initialFilters ?? { status: 'all' });

  useEffect(() => {
    if (autoFetch) {
      listClients(filters).catch(() => undefined);
    }
  }, [autoFetch, filters, listClients]);

  const refetch = useCallback(async (overrideFilters?: ClientFilters) => {
    const mergedFilters = {
      ...filters,
      ...(overrideFilters ?? {}),
    };
    setFilters(mergedFilters);
    await listClients(mergedFilters);
  }, [filters, listClients]);

  return {
    clients,
    total,
    filters,
    isLoading,
    error,
    refetch,
    setFilters,
  };
};
