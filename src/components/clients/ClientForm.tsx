import React from 'react';
import { Client } from '../../types/client';
import { useClientForm } from '../../hooks/useClientForm';

export interface ClientFormProps {
  client?: Client;
  onSuccess?: (client: Client) => void;
  onCancel?: () => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSuccess, onCancel }) => {
  const {
    values,
    handleChange,
    submit,
    validationErrors,
    isSubmitting,
    submitError,
    isEditMode,
  } = useClientForm({ initialData: client, onSuccess });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await submit();
    } catch (error) {
      // handled in hook state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">
            Nome
          </label>
          <input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={(event) => handleChange('firstName', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ex.: Maria"
            required
          />
          {validationErrors.firstName && (
            <p className="text-xs text-destructive">{validationErrors.firstName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">
            Sobrenome
          </label>
          <input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={(event) => handleChange('lastName', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ex.: Oliveira"
            required
          />
          {validationErrors.lastName && (
            <p className="text-xs text-destructive">{validationErrors.lastName}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="contato@exemplo.com"
            required
          />
          {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefone
          </label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="(11) 91234-5678"
          />
          {validationErrors.phone && <p className="text-xs text-destructive">{validationErrors.phone}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="birthDate" className="text-sm font-medium text-foreground">
            Data de nascimento
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={values.birthDate}
            onChange={(event) => handleChange('birthDate', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {validationErrors.birthDate && (
            <p className="text-xs text-destructive">{validationErrors.birthDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="document" className="text-sm font-medium text-foreground">
            Documento
          </label>
          <input
            id="document"
            name="document"
            value={values.document}
            onChange={(event) => handleChange('document', event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="CPF ou documento"
          />
          {validationErrors.document && (
            <p className="text-xs text-destructive">{validationErrors.document}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={(event) => handleChange('status', event.target.value as 'active' | 'inactive')}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          {validationErrors.status && <p className="text-xs text-destructive">{validationErrors.status}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium text-foreground">
          Observações
        </label>
        <textarea
          id="notes"
          name="notes"
          value={values.notes}
          onChange={(event) => handleChange('notes', event.target.value)}
          className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Histórico de preferências, alergias ou observações gerais"
        />
        {validationErrors.notes && <p className="text-xs text-destructive">{validationErrors.notes}</p>}
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Salvando...' : isEditMode ? 'Atualizar cliente' : 'Cadastrar cliente'}
        </button>
      </div>
    </form>
  );
};
