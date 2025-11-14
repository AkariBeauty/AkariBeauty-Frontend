/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Agendamento, AgendamentoService } from "../../services/agendamentoService";
import { useAuth } from "../../contexts/AuthContext";

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const [data, setData] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const clienteId = useMemo(() => {
    if (!user) return 0;
    const raw = (user as any)?.id;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [user]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    if (!clienteId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const arr = await AgendamentoService.listarMeus(clienteId);
      setData(arr);
    } catch (e) {
      console.error("Erro ao listar agendamentos", e);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    load();
  }, [load, user]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        <button onClick={load} className="px-3 py-2 rounded bg-primary text-white" disabled={loading || !clienteId}>
          Atualizar
        </button>
      </div>

      {!clienteId ? (
        <div className="text-gray-500">Faça login novamente para visualizar seus agendamentos.</div>
      ) : loading ? (
        <div className="text-gray-500">Carregando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">#</th>
                <th className="p-3">Serviço</th>
                <th className="p-3">Data e Hora</th>
                <th className="p-3">Status</th>
                <th className="p-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.id}</td>
                  <td className="p-3">{a.servicos.map((s) => s.nome).join(", ") || "-"}</td>
                  <td className="p-3">{new Date(a.dataHora).toLocaleString()}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">R$ {a.valor.toFixed(2)}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={5}>
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
