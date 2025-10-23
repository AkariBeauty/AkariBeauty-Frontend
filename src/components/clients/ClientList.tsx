import React from 'react';
import { Client } from '../../types/client';

export interface ClientListProps {
  clients: Client[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  isLoading = false,
  error = null,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-destructive">
        <p className="font-semibold">Não foi possível carregar os clientes.</p>
        <p className="text-sm opacity-80">{error.message}</p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-white shadow-sm transition hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-muted p-12 text-center">
        <h3 className="text-lg font-semibold">Nenhum cliente encontrado</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Cadastre um cliente para começar a acompanhar as interações.
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-white shadow-sm transition hover:bg-primary/90"
          >
            Recarregar
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-muted bg-white shadow-sm">
      <table className="min-w-full divide-y divide-muted/40">
        <thead className="bg-muted/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Contato</th>
            <th className="px-6 py-3">Documento</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted/30">
          {clients.map((client) => (
            <tr key={client.id} className="transition hover:bg-muted/10">
              <td className="px-6 py-4">
                <div className="font-medium text-foreground">
                  {client.firstName} {client.lastName}
                </div>
                <p className="text-sm text-muted-foreground">Cadastro em {new Date(client.createdAt).toLocaleDateString()}</p>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-muted-foreground">{client.email}</div>
                {client.phone && <div className="text-sm text-muted-foreground">{client.phone}</div>}
              </td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{client.document || '—'}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    client.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-3">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(client)}
                      className="text-primary transition hover:text-primary/80"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(client)}
                      className="text-destructive transition hover:text-destructive/80"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
