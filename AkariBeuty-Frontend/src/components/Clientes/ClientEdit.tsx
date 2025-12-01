// src/components/Clientes/ClientEdit.tsx
import { useEffect, useState } from "react";
import ClientForm from "./ClientForm";
import {
  clienteService,
  type Cliente,
  type ClienteFormValues,
  toUpdateClienteDTO,
} from "../../services/clientCrudService";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<Cliente | null>(null);

  useEffect(() => {
    (async () => {
      if (id) setData(await clienteService.getById(Number(id)));
    })();
  }, [id]);

  async function onSubmit(form: ClienteFormValues) {
    if (!id) return;
    const payload = toUpdateClienteDTO(form);
    await clienteService.update(Number(id), payload);
    nav("/clientes");
  }

  if (!data) return <div className="p-4">Carregando…</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Editar Cliente</h1>
      <ClientForm initial={data} onSubmit={onSubmit} />
    </div>
  );
}
