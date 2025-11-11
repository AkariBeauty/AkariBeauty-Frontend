/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Heart, Star, ArrowRight } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";

// Tipos do serviço (o que a API realmente retorna)
import {
  ClienteService,
  type ClienteStats as ApiStats,          // (ex.: { totalAppointments, doneCount, ... })
  type ClienteAppointment as ApiAppointment, // (ex.: { startAt, endAt, title, status })
  type ClienteFavorite as ApiFavorite,       // se não existir, mapearemos mesmo assim
} from "../../services/clienteService";

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

  // Estado com o shape esperado pela UI (mantido)
  const [stats, setStats] = useState<UIStats>({
    totalAgendamentos: 0,
    totalHoras: 0,
    totalFavoritos: 0,
  });
  const [nextAppointments, setNextAppointments] = useState<UIAppointment[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<UIFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Helpers de mapeamento: convertem o retorno do serviço (API)
   * para o formato que a tela já usa (sem alterar UI/UX).
   */
  function mapStatsToUI(apiStats: ApiStats | null, favs: UIFavorite[]): UIStats {
    // tente mapear por múltiplos nomes para ser resiliente a contratos
    const totalAgend =
      (apiStats as any)?.totalAgendamentos ??
      (apiStats as any)?.totalAppointments ??
      0;

    // Se a API não trouxer horas, mantemos 0 (ou calcule pela diferença de horários se quiser)
    const totalHours =
      (apiStats as any)?.totalHoras ?? 0;

    // Favoritos = quantidade de itens favoritos (ou use campo da API se existir)
    const totalFavs =
      (apiStats as any)?.totalFavoritos ?? favs.length ?? 0;

    return {
      totalAgendamentos: Number(totalAgend) || 0,
      totalHoras: Number(totalHours) || 0,
      totalFavoritos: Number(totalFavs) || 0,
    };
  }

  function mapAppointmentToUI(a: ApiAppointment): UIAppointment {
    // Tenta extrair de vários formatos
    const start =
      (a as any).startAt ??
      (a as any).start ??
      (a as any).date ?? null;

    const status =
      (a as any).status ??
      (a as any).situation ??
      "PENDENTE";

    // service/professional/title -> mantém compatibilidade
    const serviceName =
      (a as any).service?.name ??
      (a as any).serviceName ??
      (a as any).title ??
      "Serviço";

    const professionalName =
      (a as any).professional?.name ??
      (a as any).professionalName ??
      "—";

    // Gera "date" e "time" que a UI já usa
    let dateStr = "";
    let timeStr = "";
    if (start) {
      const d = new Date(start);
      if (!isNaN(d.getTime())) {
        // "YYYY-MM-DD"
        dateStr = d.toISOString().slice(0, 10);
        // "HH:mm" (pt-BR)
        timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      }
    }

    return {
      id: (a as any).id ?? (a as any).appointmentId ?? String(Math.random()),
      service: { name: String(serviceName) },
      professional: { name: String(professionalName) },
      date: dateStr,
      time: timeStr,
      status: String(status).toUpperCase().includes("CONFIRM")
        ? "CONFIRMADO"
        : "PENDENTE",
    };
  }

  function mapFavoriteToUI(f: ApiFavorite): UIFavorite {
    return {
      name: (f as any).name ?? (f as any).serviceName ?? "Serviço",
      count: Number((f as any).count ?? (f as any).timesUsed ?? 0),
      rating: (f as any).rating ?? undefined,
    };
  }

  useEffect(() => {
    // userId é opcional; se não existir, o serviço envia sem query param
    const userId = user?.id ? Number(user.id) : undefined;

    const load = async () => {
      try {
        setIsLoading(true);

        const [apiStats, apiAppts, apiFavs] = await Promise.all([
          ClienteService.getDashboardStats(userId as any),
          ClienteService.getUpcomingAppointments(userId as any),
          // Se seu serviço não aceitar userId aqui, tudo bem — enviamos e ele ignora.
          (ClienteService as any).getFavoriteServices(userId as any) ?? ClienteService.getFavoriteServices(),
        ]);

        const favsUI = (apiFavs ?? []).map(mapFavoriteToUI);
        setFavoriteServices(favsUI);

        const apptsUI = (apiAppts ?? []).map(mapAppointmentToUI);
        setNextAppointments(apptsUI);

        setStats(mapStatsToUI(apiStats ?? null, favsUI));
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        // Mantém UI estável mesmo com erro
        setStats({ totalAgendamentos: 0, totalHoras: 0, totalFavoritos: 0 });
        setNextAppointments([]);
        setFavoriteServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
    // NÃO dependa estritamente de user?.id para não travar o loading
  }, [user?.id]);

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
