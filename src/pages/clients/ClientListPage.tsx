import React, { useCallback, useState } from 'react';
import { ClientProvider, useClientContext } from '../../context/ClientContext';
import { Client } from '../../types/client';
import { useClientList } from '../../hooks/useClientList';
import { ClientList } from '../../components/clients/ClientList';
import { ClientModal } from '../../components/clients/ClientModal';
import { ClientFiltersForm } from '../../components/clients/ClientFilters';

const ClientListView: React.FC = () => {
  const { clients, isLoading, error, refetch, filters } = useClientList();
  const { removeClient } = useClientContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);

  const openCreateModal = () => {
    setSelectedClient(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = useCallback(
    async (client: Client) => {
      const confirmed =
        typeof window === 'undefined' ? true : window.confirm(`Deseja remover ${client.firstName}?`);
      if (!confirmed) {
        return;
      }

      await removeClient(client.id);
      await refetch();
    },
    [refetch, removeClient],
  );

  const handleSuccess = useCallback(async () => {
    setIsModalOpen(false);
    await refetch();
  }, [refetch]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os cadastros de clientes, histórico de contato e preferências.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-primary/90"
        >
          Novo cliente
        </button>
      </header>

      <ClientFiltersForm defaultFilters={filters} onApply={refetch} />

      <ClientList
        clients={clients}
        isLoading={isLoading}
        error={error ?? undefined}
        onRefresh={() => refetch(filters)}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <ClientModal
        isOpen={isModalOpen}
        client={selectedClient}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export const ClientListPage: React.FC = () => (
  <ClientProvider>
    <ClientListView />
  </ClientProvider>
);

export default ClientListPage;
