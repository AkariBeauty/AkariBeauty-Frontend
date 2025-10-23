import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { useClientContext } from '../context/ClientContext';
import { Client, CreateClientDTO, UpdateClientDTO } from '../types/client';

const clientSchema = z.object({
  firstName: z.string().min(2, 'Nome deve possuir ao menos 2 caracteres.'),
  lastName: z.string().min(2, 'Sobrenome deve possuir ao menos 2 caracteres.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z
    .string()
    .regex(/^[0-9()+\-\s]*$/, 'Telefone deve conter apenas números e caracteres especiais.' )
    .optional(),
  birthDate: z.string().optional(),
  document: z.string().min(5, 'Documento deve possuir ao menos 5 caracteres.').optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  notes: z.string().max(500, 'Notas devem ter no máximo 500 caracteres.').optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

export interface UseClientFormOptions {
  initialData?: Client;
  onSuccess?: (client: Client) => void;
}

export const useClientForm = ({ initialData, onSuccess }: UseClientFormOptions = {}) => {
  const { createClient, updateClient } = useClientContext();
  const [values, setValues] = useState<ClientFormValues>(() => {
    if (!initialData) {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        document: '',
        status: 'active',
        notes: '',
      };
    }

    const { firstName, lastName, email, phone, birthDate, document, status, notes } = initialData;
    return {
      firstName,
      lastName,
      email,
      phone: phone ?? '',
      birthDate: birthDate ?? '',
      document: document ?? '',
      status,
      notes: notes ?? '',
    };
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ClientFormValues, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = Boolean(initialData?.id);

  const handleChange = useCallback(<K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validate = useCallback((data: ClientFormValues) => {
    const result = clientSchema.safeParse(data);
    if (result.success) {
      setValidationErrors({});
      return result.data;
    }

    const fieldErrors: Partial<Record<keyof ClientFormValues, string>> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ClientFormValues;
      fieldErrors[field] = issue.message;
    });
    setValidationErrors(fieldErrors);
    return null;
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const parsed = validate(values);
      if (!parsed) {
        throw new Error('Dados inválidos. Verifique os campos destacados.');
      }

      let result: Client;
      if (isEditMode && initialData) {
        const payload: UpdateClientDTO = parsed;
        result = await updateClient(initialData.id, payload);
      } else {
        const payload: CreateClientDTO = parsed;
        result = await createClient(payload);
        setValues({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          document: '',
          status: 'active',
          notes: '',
        });
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      setSubmitError((error as Error).message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [createClient, initialData, isEditMode, onSuccess, updateClient, validate, values]);

  const helpers = useMemo(() => ({
    isEditMode,
    values,
    setValues,
    handleChange,
    submit,
    isSubmitting,
    submitError,
    validationErrors,
  }), [handleChange, isEditMode, submit, isSubmitting, submitError, validationErrors, values]);

  return helpers;
};
