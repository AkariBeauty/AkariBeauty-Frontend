// src/components/Clientes/ClientCreate.tsx
import ClientForm from "./ClientForm";
import {
  clienteService,
  type ClienteFormValues,
  toCreateClienteDTO,
} from "../../services/clientCrudService";
import { useNavigate } from "react-router-dom";

export default function ClientCreate() {
  const nav = useNavigate();

  async function onSubmit(form: ClienteFormValues) {
    const payload = toCreateClienteDTO(form);
    await clienteService.create(payload);
    nav("/clientes");
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Novo Cliente</h1>
      <ClientForm initial={null} onSubmit={onSubmit} />
    </div>
  );
}
