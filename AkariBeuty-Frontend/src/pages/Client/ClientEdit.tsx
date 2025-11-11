/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Cliente, ClienteService } from "../../services/clienteService";
import InputLogin from "../../components/InputLogin";
import Button from "../../components/Button";

export default function ClienteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const cli = await ClienteService.getById(Number(id));
        setCliente(cli);
      } catch (e) {
        console.error("Erro ao carregar cliente", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cliente) return;
    try {
      const payload = { ...cliente };
      delete (payload as any).senha;
      await ClienteService.update(cliente.id, payload);
      navigate("/clientes");
    } catch (e) {
      console.error("Erro ao atualizar", e);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
        <Button label="Voltar" action={() => navigate("/clientes")} background="bg-gray-600" color="text-white" />
      </div>

      {loading || !cliente ? (
        <div className="text-gray-500">Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-md p-4 shadow max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputLogin id="nome" label="Nome" type="text" value={cliente.nome} action={(v) => setCliente({ ...cliente, nome: v })}/>
            <InputLogin id="cpf" label="CPF" type="text" value={cliente.cpf} action={(v) => setCliente({ ...cliente, cpf: v })}/>
            <InputLogin id="uf" label="UF" type="text" value={cliente.uf} action={(v) => setCliente({ ...cliente, uf: v })}/>
            <InputLogin id="cidade" label="Cidade" type="text" value={cliente.cidade} action={(v) => setCliente({ ...cliente, cidade: v })}/>
            <InputLogin id="bairro" label="Bairro" type="text" value={cliente.bairro} action={(v) => setCliente({ ...cliente, bairro: v })}/>
            <InputLogin id="rua" label="Rua" type="text" value={cliente.rua} action={(v) => setCliente({ ...cliente, rua: v })}/>
            <InputLogin id="numero" label="Número" type="text" value={String(cliente.numero)} action={(v) => setCliente({ ...cliente, numero: parseInt(v || "0") })}/>
            <InputLogin id="telefone" label="Telefone" type="text" value={cliente.telefone} action={(v) => setCliente({ ...cliente, telefone: v })}/>
            <InputLogin id="login" label="Email/Login" type="email" value={cliente.login} action={(v) => setCliente({ ...cliente, login: v })}/>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/clientes")} className="px-4 py-2 rounded bg-gray-500 text-white">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Salvar</button>
          </div>
        </form>
      )}
    </div>
  );
}
