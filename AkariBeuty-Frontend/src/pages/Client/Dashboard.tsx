/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Heart, Star, ArrowRight } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import { AgendamentoService, type Agendamento } from "../../services/agendamentoService";

const DEFAULT_SERVICE_DURATION_MINUTES = 60;
const COMPLETED_STATUSES = new Set(["REALIZADO", "DONE", "CONCLUIDO", "COMPLETED"]);

/**
 * Tipos de UI (o que ESTA tela espera para renderizar)
 * Mantém os nomes exatamente como seu componente usa atualmente.
 */
type UIStats = {
  totalAgendamentos: number;
  totalHoras: number;
  totalFavoritos: number;
};

type UIAppointment = {
  id: string | number;
  service: { name: string };
  professional: { name: string };
  date: string; // "YYYY-MM-DD" ou similar
  time: string; // "HH:mm"
  status: string; // "CONFIRMADO" | "PENDENTE" | ...
};

type UIFavorite = {
  name: string;
  count: number;
  rating?: number;
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const clienteId = useMemo(() => {
    const parsed = Number(user?.id);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [user?.id]);

  // Estado com o shape esperado pela UI (mantido)
  const [stats, setStats] = useState<UIStats>({
    totalAgendamentos: 0,
    totalHoras: 0,
    totalFavoritos: 0,
  });
  const [nextAppointments, setNextAppointments] = useState<UIAppointment[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<UIFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!clienteId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const agendamentos = await AgendamentoService.listarMeus(clienteId);

        const favorites = buildFavoriteServices(agendamentos);
        setFavoriteServices(favorites);

        setStats({
          totalAgendamentos: agendamentos.length,
          totalHoras: calculateBeautyHours(agendamentos),
          totalFavoritos: favorites.length,
        });

        setNextAppointments(buildUpcomingAppointments(agendamentos));
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setStats({ totalAgendamentos: 0, totalHoras: 0, totalFavoritos: 0 });
        setNextAppointments([]);
        setFavoriteServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [clienteId]);

  function buildFavoriteServices(list: Agendamento[]): UIFavorite[] {
    const counter = new Map<string, number>();
    list.forEach((appointment) => {
      appointment.servicos.forEach((service) => {
        const name = service.nome ?? "Serviço";
        counter.set(name, (counter.get(name) ?? 0) + 1);
      });
    });

    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }

  function buildUpcomingAppointments(list: Agendamento[]): UIAppointment[] {
    const now = Date.now();
    return list
      .map((appointment) => ({
        raw: appointment,
        date: new Date(appointment.dataHora),
      }))
      .filter(({ date }) => !Number.isNaN(date.getTime()) && date.getTime() >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3)
      .map(({ raw, date }) => ({
        id: raw.id,
        service: { name: raw.servicos[0]?.nome ?? "Serviço" },
        professional: { name: "Equipe Akari" },
        date: date.toISOString(),
        time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        status: raw.status === "CONFIRMADO" ? "CONFIRMADO" : "PENDENTE",
      }));
  }

  function calculateBeautyHours(list: Agendamento[]): number {
    const totalMinutes = list.reduce((minutesAcc, appointment) => {
      if (!isCompletedStatus(appointment.status)) {
        return minutesAcc;
      }

      const appointmentMinutes = appointment.servicos.reduce((serviceAcc, service) => {
        return serviceAcc + extractServiceDuration(service);
      }, 0);

      const effectiveMinutes = appointmentMinutes > 0 ? appointmentMinutes : DEFAULT_SERVICE_DURATION_MINUTES;
      return minutesAcc + effectiveMinutes;
    }, 0);

    if (totalMinutes === 0) {
      return 0;
    }

    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  function extractServiceDuration(service: Agendamento["servicos"][number]): number {
    const rawDuration =
      service.duracao ??
      service.duration ??
      service.duracaoMinutos ??
      service.duracaoMin ??
      service.tempoEstimado ??
      service.tempo ??
      service.tempoServico;

    if (typeof rawDuration === "number" && Number.isFinite(rawDuration) && rawDuration > 0) {
      return rawDuration;
    }

    return 0;
  }

  function isCompletedStatus(status: string | undefined): boolean {
    if (!status) {
      return false;
    }

    return COMPLETED_STATUSES.has(status.toUpperCase());
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bolt-primary-500" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-bolt-neutral-900 mb-2">
          Olá, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-bolt-neutral-600">Como podemos cuidar da sua beleza hoje?</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 card-hover shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-bolt-primary-400 to-bolt-primary-600 rounded-xl flex items-center justify-center mb-3">
            <Calendar size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-bolt-neutral-900">{stats.totalAgendamentos}</p>
          <p className="text-sm text-bolt-neutral-600">Agendamentos</p>
        </div>

        <div className="bg-white rounded-2xl p-4 card-hover shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-bolt-secondary-400 to-bolt-secondary-600 rounded-xl flex items-center justify-center mb-3">
            <Clock size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-bolt-neutral-900">{stats.totalHoras}h</p>
          <p className="text-sm text-bolt-neutral-600">Horas de Beleza</p>
        </div>

        <div className="bg-white rounded-2xl p-4 card-hover shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-bolt-accent-400 to-bolt-accent-600 rounded-xl flex items-center justify-center mb-3">
            <Heart size={20} className="text-white" />
          </div>
          <p className="text-2xl font-bold text-bolt-neutral-900">{stats.totalFavoritos}</p>
          <p className="text-sm text-bolt-neutral-600">Favoritos</p>
        </div>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/cliente/booking")}
          className="bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white p-6 rounded-2xl card-hover shadow-lg"
        >
          <Calendar size={32} className="mb-3" />
          <h3 className="font-semibold text-lg mb-1">Novo Agendamento</h3>
          <p className="text-sm text-white/80">Agende seu próximo serviço</p>
        </button>

        <button
          onClick={() => navigate("/cliente/agendamentos")}
          className="bg-white p-6 rounded-2xl card-hover shadow-sm border border-bolt-neutral-100"
        >
          <Clock size={32} className="text-bolt-primary-500 mb-3" />
          <h3 className="font-semibold text-lg mb-1 text-bolt-neutral-900">Meus Agendamentos</h3>
          <p className="text-sm text-bolt-neutral-600">Veja seus compromissos</p>
        </button>
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-bolt-neutral-900">Próximos Agendamentos</h2>
          <button
            onClick={() => navigate("/cliente/agendamentos")}
            className="text-bolt-primary-600 text-sm font-medium flex items-center"
          >
            Ver todos <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {nextAppointments.length === 0 ? (
            <div className="text-center py-8 text-bolt-neutral-500">
              <Calendar size={48} className="mx-auto mb-3 text-bolt-neutral-300" />
              <p>Nenhum agendamento próximo</p>
              <button
                onClick={() => navigate("/cliente/booking")}
                className="text-bolt-primary-600 font-medium mt-2"
              >
                Fazer um agendamento
              </button>
            </div>
          ) : (
            nextAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-xl flex items-center justify-center mr-4">
                  <Calendar size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-bolt-neutral-900">
                    {appointment.service.name}
                  </h3>
                    <p className="text-sm text-bolt-neutral-600">
                      {appointment.professional.name}
                    </p>
                    <p className="text-sm text-bolt-neutral-500">
                      {new Date(appointment.date).toLocaleDateString("pt-BR")} às{" "}
                      {appointment.time}
                    </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "CONFIRMADO"
                      ? "bg-bolt-green-100 text-bolt-green-800"
                      : "bg-bolt-yellow-100 text-bolt-yellow-800"
                  }`}
                >
                  {appointment.status === "CONFIRMADO" ? "Confirmado" : "Pendente"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Favoritos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Seus Favoritos</h2>
        <div className="space-y-3">
          {favoriteServices.length === 0 ? (
            <div className="text-center py-8 text-bolt-neutral-500">
              <Heart size={48} className="mx-auto mb-3 text-bolt-neutral-300" />
              <p>Nenhum serviço favorito ainda</p>
              <button
                onClick={() => navigate("/cliente/booking")}
                className="text-bolt-primary-600 font-medium mt-2"
              >
                Descobrir serviços
              </button>
            </div>
          ) : (
            favoriteServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-bolt-neutral-50 rounded-xl"
              >
                <div>
                  <h3 className="font-medium text-bolt-neutral-900">{service.name}</h3>
                  <p className="text-sm text-bolt-neutral-600">{service.count} vezes</p>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 mr-1" weight="fill" />
                  <span className="text-sm font-medium text-bolt-neutral-700">
                    {service.rating ?? "-"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
