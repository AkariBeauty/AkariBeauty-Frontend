import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, X } from "@phosphor-icons/react";
import clienteService, { ClienteAppointment } from "../../services/clienteService";

export default function Appointments() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ClienteAppointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadAppointments() {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.listAppointments();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError("Falha ao carregar seus agendamentos.");
    } finally {
      setLoading(false);
    }
  }

  async function onCancel(id: number | string) {
    if (!confirm("Deseja realmente cancelar este agendamento?")) return;
    try {
      await clienteService.cancelAppointment(id);
      await loadAppointments();
    } catch (err) {
      console.error(err);
      alert("Não foi possível cancelar.");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) return <div>Carregando agendamentos...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Calendar size={22} />
          Meus Agendamentos
        </h1>

        <Link to="/cliente/agendamentos/novo" className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm">
          Novo agendamento
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">Você ainda não possui agendamentos.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="border rounded-md p-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs opacity-80">
                  {new Date(a.startAt).toLocaleString()} — {new Date(a.endAt).toLocaleString()}
                </div>
                <div className="text-xs uppercase mt-1 opacity-70">Status: {a.status}</div>
              </div>
              <button
                onClick={() => onCancel(a.id)}
                className="inline-flex items-center gap-1 text-red-600 border border-red-600 px-2 py-1 rounded-md text-xs"
                title="Cancelar"
              >
                <X size={14} />
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
