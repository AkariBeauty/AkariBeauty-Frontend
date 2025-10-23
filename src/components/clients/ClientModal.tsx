import React from 'react';
import { Client } from '../../types/client';
import { ClientForm } from './ClientForm';

export interface ClientModalProps {
  isOpen: boolean;
  client?: Client;
  onClose: () => void;
  onSuccess?: (client: Client) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, client, onClose, onSuccess }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {client ? 'Editar cliente' : 'Novo cliente'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Preencha as informações abaixo para {client ? 'atualizar' : 'cadastrar'} o cliente.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <ClientForm client={client} onSuccess={onSuccess} onCancel={onClose} />
      </div>
    </div>
  );
};
