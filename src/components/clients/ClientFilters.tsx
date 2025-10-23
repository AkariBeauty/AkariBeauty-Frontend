import React, { useState } from 'react';
import { ClientFilters } from '../../types/client';

export interface ClientFiltersProps {
  defaultFilters?: ClientFilters;
  onApply: (filters: ClientFilters) => void;
}

export const ClientFiltersForm: React.FC<ClientFiltersProps> = ({ defaultFilters, onApply }) => {
  const [search, setSearch] = useState(defaultFilters?.search ?? '');
  const [status, setStatus] = useState<ClientFilters['status']>(defaultFilters?.status ?? 'all');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply({ search, status });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1">
        <label htmlFor="search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Buscar cliente
        </label>
        <input
          id="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nome, e-mail ou telefone"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="status" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ClientFilters['status'])}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-primary/90"
      >
        Aplicar filtros
      </button>
    </form>
  );
};
