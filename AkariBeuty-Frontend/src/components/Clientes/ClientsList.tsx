import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cliente } from "../../services/clientCrudService";
import { clienteService } from "../../services/clientCrudService";
import ConfirmDialog from "../UI/ConfirmDialog";
import { showError, showSuccess } from "../../utils/toast";
export default function ClientsList() {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);
  const nav = useNavigate();

  async function fetchData() {
    setLoading(true);
    try {
      const res = await clienteService.getAll();
      setData(res);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
      showError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const requestDelete = (cliente: Cliente) => {
    setClientToDelete(cliente);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      setDeleting(true);
      await clienteService.delete(clientToDelete.id);
      await fetchData();
      showSuccess("Cliente excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir cliente", error);
      showError("Não foi possível excluir o cliente.");
    } finally {
      setDeleting(false);
      setClientToDelete(null);
    }
  };

  if (loading) return <div className="p-4">Carregando…</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Clientes</h1>
        <button className="px-3 py-2 bg-black text-white rounded" onClick={() => nav("/clientes/novo")}>
          Novo
        </button>
      </div>

      {data.length === 0 ? (
        <div>Nenhum cliente encontrado.</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Nome</th>
              <th className="p-2">CPF</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Cidade</th>
              <th className="p-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.nome}</td>
                <td className="p-2">{c.cpf}</td>
                <td className="p-2">{c.telefone}</td>
                <td className="p-2">{c.cidade}/{c.uf}</td>
                <td className="p-2 text-right space-x-2">
                  <Link className="underline" to={`/clientes/${c.id}`}>Editar</Link>
                  <button className="text-red-600" onClick={() => requestDelete(c)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        open={Boolean(clientToDelete)}
        title="Excluir cliente"
        description={clientToDelete ? `Excluir ${clientToDelete.nome}?` : undefined}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
