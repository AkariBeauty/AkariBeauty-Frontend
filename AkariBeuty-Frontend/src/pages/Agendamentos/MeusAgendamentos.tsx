import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowsClockwise,
  CaretDown,
  CalendarBlank,
  CalendarX,
  Clock,
  Funnel,
  MagnifyingGlass,
  PlusCircle,
  Trash,
} from "@phosphor-icons/react";
import {
  Agendamento,
  AgendamentoService,
  AgendamentoStatus,
} from "../../services/agendamentoService";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import { showError, showSuccess } from "../../utils/toast";

const statusLabels: Record<AgendamentoStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  AUSENTE: "Ausente",
  COBRADO: "Cobrado",
  REALIZADO: "Realizado",
  CANCELADO_EMPRESA: "Cancelado pela empresa",
};

const statusStyles: Record<AgendamentoStatus, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  CONFIRMADO: "bg-emerald-100 text-emerald-700",
  CANCELADO: "bg-rose-100 text-rose-700",
  AUSENTE: "bg-orange-100 text-orange-700",
  COBRADO: "bg-indigo-100 text-indigo-700",
  REALIZADO: "bg-sky-100 text-sky-700",
  CANCELADO_EMPRESA: "bg-rose-100 text-rose-700",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

type StatusFilter = "TODOS" | AgendamentoStatus;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "TODOS", label: "Todos os status" },
  ...Object.entries(statusLabels).map(([value, label]) => ({
    value: value as AgendamentoStatus,
    label,
  })),
];

export default function MeusAgendamentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Agendamento | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement | null>(null);

  const clienteId = useMemo(() => {
    const raw = user?.id;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [user?.id]);

  const load = useCallback(async () => {
    if (!clienteId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const arr = await AgendamentoService.listarMeus(clienteId);
      setAppointments(arr);
    } catch (error) {
      console.error("Erro ao listar agendamentos", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!statusDropdownRef.current) return;
      if (!statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const now = useMemo(() => Date.now(), []);

  const filteredAppointments = useMemo(() => {
    const start = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

    return appointments
      .filter((item) => {
        const matchesStatus =
          statusFilter === "TODOS" || item.status === statusFilter;

        const matchesSearch =
          searchTerm.trim().length === 0 ||
          item.servicos.some((service) =>
            service.nome.toLowerCase().includes(searchTerm.toLowerCase())
          );

        const appointmentTime = new Date(item.dataHora).getTime();
        const matchesStart = start === null || appointmentTime >= start;
        const matchesEnd = end === null || appointmentTime <= end;

        return matchesStatus && matchesSearch && matchesStart && matchesEnd;
      })
      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }, [appointments, endDate, searchTerm, startDate, statusFilter]);

  const totals = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((item) => new Date(item.dataHora).getTime() >= now).length;
    const canceled = appointments.filter((item) => item.status === "CANCELADO" || item.status === "CANCELADO_EMPRESA").length;

    return { total, upcoming, canceled };
  }, [appointments, now]);

  const requestCancel = (appointment: Agendamento) => {
    if (!clienteId) return;
    const canCancel = appointment.status === "PENDENTE" || appointment.status === "CONFIRMADO";
    if (!canCancel) return;
    setAppointmentToCancel(appointment);
  };

  const confirmCancel = async () => {
    if (!appointmentToCancel) return;

    try {
      setCancelingId(appointmentToCancel.id);
      await AgendamentoService.cancelar(appointmentToCancel.id);
      await load();
      showSuccess("Agendamento cancelado com sucesso.");
    } catch (error) {
      console.error("Erro ao cancelar agendamento", error);
      showError("Não foi possível cancelar o agendamento.");
    } finally {
      setCancelingId(null);
      setAppointmentToCancel(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("TODOS");
    setStatusDropdownOpen(false);
    setStartDate("");
    setEndDate("");
  };

  if (!clienteId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-rose-100 text-rose-700 rounded-2xl p-6 text-center">
          Faça login novamente para visualizar seus agendamentos.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bolt-neutral-50 min-h-[calc(100vh-120px)]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-bolt-primary-600 hover:text-bolt-primary-700"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-bolt-neutral-900">Meus agendamentos</h1>
              <p className="text-bolt-neutral-500">
                Acompanhe seus compromissos, filtre por status e organize sua agenda com facilidade.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/cliente/booking")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 shadow-sm hover:shadow-md transition"
            >
              <PlusCircle size={20} />
              Novo agendamento
            </button>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-bolt-neutral-200 text-bolt-neutral-600 hover:text-bolt-primary-600 hover:border-bolt-primary-200 disabled:opacity-40"
            >
              <ArrowsClockwise size={20} className={loading ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <CalendarBlank size={28} className="text-bolt-primary-500" />
            <div>
              <span className="text-sm text-bolt-neutral-500">Total de agendamentos</span>
              <p className="text-2xl font-semibold text-bolt-neutral-900">{totals.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <Clock size={28} className="text-bolt-secondary-500" />
            <div>
              <span className="text-sm text-bolt-neutral-500">Próximos compromissos</span>
              <p className="text-2xl font-semibold text-bolt-neutral-900">{totals.upcoming}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-3">
            <CalendarX size={28} className="text-rose-500" />
            <div>
              <span className="text-sm text-bolt-neutral-500">Cancelados</span>
              <p className="text-2xl font-semibold text-bolt-neutral-900">{totals.canceled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[220px]">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-bolt-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Busque por serviço"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-bolt-neutral-200 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-bolt-neutral-500">Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="px-3 py-2 rounded-lg border border-bolt-neutral-200 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-bolt-neutral-500">Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="px-3 py-2 rounded-lg border border-bolt-neutral-200 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
                />
              </div>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-bolt-neutral-200 bg-white text-bolt-neutral-700 shadow-sm hover:border-bolt-primary-200 hover:text-bolt-primary-600 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
                >
                  <span className="text-sm font-medium">
                    {statusOptions.find((option) => option.value === statusFilter)?.label ?? "Todos os status"}
                  </span>
                  <CaretDown size={16} className={`transition ${statusDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {statusDropdownOpen ? (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-bolt-neutral-100 bg-white shadow-xl">
                    <div className="max-h-64 overflow-y-auto py-2">
                      {statusOptions.map((option) => {
                        const isActive = statusFilter === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option.value);
                              setStatusDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between ${
                              isActive
                                ? "text-bolt-primary-700 bg-bolt-primary-50"
                                : "text-bolt-neutral-600 hover:bg-bolt-neutral-50"
                            }`}
                          >
                            {option.label}
                            {isActive ? (
                              <span className="text-xs font-semibold text-bolt-primary-600">Selecionado</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-bolt-neutral-200 text-bolt-neutral-500 hover:text-bolt-primary-600 hover:border-bolt-primary-200"
              >
                <Funnel size={18} />
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-bolt-neutral-500">Carregando agendamentos...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CalendarBlank size={42} className="mx-auto text-bolt-neutral-300" />
              <p className="text-bolt-neutral-500">Nenhum agendamento encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-bolt-neutral-50 text-bolt-neutral-500 text-sm uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Serviço</th>
                  <th className="px-6 py-3 text-left">Data e horário</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Valor</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bolt-neutral-100 text-bolt-neutral-700">
                {filteredAppointments.map((appointment) => {
                  const formattedDate = dateFormatter.format(new Date(appointment.dataHora));
                  const services = appointment.servicos.map((service) => service.nome).join(", ") || "Serviço";
                  const statusLabel = statusLabels[appointment.status] ?? appointment.status;
                  const statusClass = statusStyles[appointment.status] ?? "bg-bolt-neutral-100 text-bolt-neutral-600";
                  const canCancel =
                    appointment.status === "PENDENTE" || appointment.status === "CONFIRMADO";

                  return (
                    <tr key={appointment.id} className="hover:bg-bolt-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-bolt-neutral-900">#{appointment.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-bolt-neutral-900">{services}</div>
                        <div className="text-xs text-bolt-neutral-400">
                          {appointment.servicos.length} serviço(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{formattedDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        R$ {appointment.valor.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => requestCancel(appointment)}
                          disabled={!canCancel || cancelingId === appointment.id}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                        >
                          <Trash size={16} />
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={Boolean(appointmentToCancel)}
        title="Cancelar agendamento"
        description={
          appointmentToCancel
            ? `Deseja cancelar o agendamento #${appointmentToCancel.id}?`
            : undefined
        }
        confirmLabel="Cancelar agendamento"
        cancelLabel="Voltar"
        loading={cancelingId === appointmentToCancel?.id}
        onConfirm={confirmCancel}
        onCancel={() => setAppointmentToCancel(null)}
      />
    </div>
  );
}
