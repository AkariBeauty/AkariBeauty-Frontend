import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import professionalPortalService from "../../services/professionalPortalService";
import { ProfessionalAgendaDay, ProfessionalAgendaItem } from "../../types";
import { CheckCircle, Clock, XCircle } from "@phosphor-icons/react";

const STATUS_COLORS: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  CONFIRMADO: "bg-emerald-100 text-emerald-700",
  REALIZADO: "bg-blue-100 text-blue-700",
  CANCELADO: "bg-rose-100 text-rose-700",
  CANCELADO_EMPRESA: "bg-rose-100 text-rose-700",
  COBRADO: "bg-violet-100 text-violet-700",
  AUSENTE: "bg-gray-200 text-gray-700",
};
//a
const STATUS_CODES: Record<keyof typeof STATUS_COLORS, number> = {
  PENDENTE: 1,
  CONFIRMADO: 2,
  CANCELADO: 3,
  AUSENTE: 4,
  COBRADO: 5,
  REALIZADO: 6,
  CANCELADO_EMPRESA: 7,
};

export default function ProfessionalAgendaPage() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [dayAgenda, setDayAgenda] = useState<ProfessionalAgendaDay | null>(null);
  const [weekAgenda, setWeekAgenda] = useState<ProfessionalAgendaDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAgenda = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const [day, week] = await Promise.all([
        professionalPortalService.getAgendaDia(date),
        professionalPortalService.getAgendaSemana(date),
      ]);
      setDayAgenda(day);
      setWeekAgenda(week);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar a agenda");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgenda(selectedDate);
  }, [selectedDate]);

  const handleStatusChange = async (appointment: ProfessionalAgendaItem, novoStatus: keyof typeof STATUS_CODES) => {
    setActionLoading(appointment.id);
    try {
      await professionalPortalService.updateStatus(appointment.id, { novoStatus: STATUS_CODES[novoStatus] });
      await fetchAgenda(selectedDate);
    } catch (err) {
      console.error(err);
      setError("Não foi possível atualizar o status do agendamento");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <section className="space-y-6 py-6">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-bolt-primary-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs text-bolt-neutral-500">Selecione o dia</p>
            <h2 className="text-lg font-semibold text-bolt-neutral-900">Agenda diária</h2>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="border border-bolt-primary-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-bolt-neutral-500">Carregando agenda…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : dayAgenda && dayAgenda.agendamentos.length > 0 ? (
        <div className="space-y-3">
          {dayAgenda.agendamentos.map((item) => {
            const data = new Date(item.dataHora);
            const color = STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700";
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-bolt-primary-50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-bolt-neutral-900">{item.clienteNome}</h3>
                    <p className="text-xs text-bolt-neutral-500">{item.servicoPrincipal}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full block ${color}`}>
                      {item.status}
                    </span>
                    <Link
                      to={`/profissional/agendamentos/${item.id}`}
                      className="text-xs text-bolt-primary-600 hover:underline mt-1 inline-flex"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-sm text-bolt-neutral-600">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-bolt-neutral-900">
                      {data.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}
                    </span>
                    <span className="text-bolt-primary-600 font-semibold">
                      R$ {item.valor.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {item.podeConfirmar && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item, "CONFIRMADO")}
                      disabled={actionLoading === item.id}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> Confirmar
                    </button>
                  )}
                  {item.podeConcluir && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item, "REALIZADO")}
                      disabled={actionLoading === item.id}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold disabled:opacity-50"
                    >
                      <CheckCircle size={16} /> Concluir
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item, "CANCELADO")}
                    disabled={actionLoading === item.id}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold disabled:opacity-50"
                  >
                    <XCircle size={16} /> Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-bolt-neutral-500">Nenhum agendamento para o dia selecionado.</p>
      )}

      {!loading && weekAgenda.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-bolt-primary-50">
          <h3 className="text-base font-semibold text-bolt-neutral-900 mb-4">Resumo semanal</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weekAgenda.map((day) => (
              <div key={day.data} className="border border-bolt-primary-50 rounded-2xl p-3">
                <p className="text-xs text-bolt-neutral-500">
                  {new Date(day.data).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" })}
                </p>
                <p className="text-2xl font-bold text-bolt-neutral-900">{day.agendamentos.length}</p>
                <p className="text-xs text-bolt-neutral-500">agendamentos</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
