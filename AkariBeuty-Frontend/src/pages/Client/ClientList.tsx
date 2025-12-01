import { useEffect, useState } from "react";
import { Cliente, ClienteService } from "../../services/clienteService";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import { showError, showSuccess } from "../../utils/toast";

export default function ClientesList() {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await ClienteService.list();
      setData(res);
    } catch (e) {
      console.error("Erro ao listar clientes", e);
      showError("Não foi possível carregar os clientes.");
    } finally {
      setLoading(false);
    }
  }

  const requestDelete = (cliente: Cliente) => {
    setClientToDelete(cliente);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      setDeleting(true);
      await ClienteService.remove(clientToDelete.id);
      await fetchAll();
      showSuccess("Cliente removido com sucesso.");
    } catch (e) {
      console.error("Erro ao remover", e);
      showError("Não foi possível remover o cliente.");
    } finally {
      setDeleting(false);
      setClientToDelete(null);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button label="Atualizar" action={fetchAll} background="bg-primary" color="text-white" />
      </div>

      {loading ? (
        <div className="text-gray-500">Carregando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-md shadow">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">#</th>
                <th className="p-3">Nome</th>
                <th className="p-3">CPF</th>
                <th className="p-3">Cidade/UF</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3">{c.cpf}</td>
                  <td className="p-3">
                    {c.cidade}/{c.uf}
                  </td>
                  <td className="p-3">{c.telefone}</td>
                  <td className="p-3 space-x-2">
                    <a href={`/clientes/editar/${c.id}`} className="px-3 py-1 rounded bg-blue-600 text-white">
                      Editar
                    </a>
                    <button
                      onClick={() => requestDelete(c)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={6}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(clientToDelete)}
        title="Remover cliente"
        description={clientToDelete ? `Remover ${clientToDelete.nome}?` : undefined}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
