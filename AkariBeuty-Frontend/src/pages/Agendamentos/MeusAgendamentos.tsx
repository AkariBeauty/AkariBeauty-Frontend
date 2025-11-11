/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Agendamento, AgendamentoService } from "../../services/agendamentoService";
import { useAuth } from "../../contexts/AuthContext";

export default function MeusAgendamentos() {
  const { user } = useAuth();
  const [data, setData] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const arr = await AgendamentoService.listarMeus((user as any).id ?? 0);
      setData(arr);
    } catch (e) {
      console.error("Erro ao listar agendamentos", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [load, user]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
        <button onClick={load} className="px-3 py-2 rounded bg-primary text-white">
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Carregando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3">#</th>
                <th className="p-3">Profissional</th>
                <th className="p-3">Serviço</th>
                <th className="p-3">Início</th>
                <th className="p-3">Fim</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{a.id}</td>
                  <td className="p-3">{a.profissionalId}</td>
                  <td className="p-3">{a.servicoId}</td>
                  <td className="p-3">{a.dataHoraInicio}</td>
                  <td className="p-3">{a.dataHoraFim}</td>
                  <td className="p-3">{a.status}</td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={6}>
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
