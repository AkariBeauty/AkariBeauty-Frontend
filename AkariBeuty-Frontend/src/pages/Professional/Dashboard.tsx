import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle } from "@phosphor-icons/react";
import professionalPortalService from "../../services/professionalPortalService";
import { ProfessionalDashboard } from "../../types";

export default function ProfessionalDashboardPage() {
  const [dashboard, setDashboard] = useState<ProfessionalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      try {
        const data = await professionalPortalService.getDashboard();
        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Não foi possível carregar o dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-bolt-neutral-500 mt-10">Carregando dados…</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-10">{error}</p>;
  }

  if (!dashboard) {
    return null;
  }

  const cards = [
    { label: "Pendentes hoje", value: dashboard.pendentesHoje, icon: Clock, color: "bg-bolt-primary-100 text-bolt-primary-700" },
    { label: "Confirmados hoje", value: dashboard.confirmadosHoje, icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
    { label: "Semana ativa", value: dashboard.totalSemana, icon: Clock, color: "bg-blue-100 text-blue-700" },
    { label: "Cancelados", value: dashboard.canceladosSemana, icon: XCircle, color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <section className="space-y-6 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-4 shadow-sm border border-bolt-primary-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon size={22} />
            </div>
            <p className="text-sm text-bolt-neutral-500">{card.label}</p>
            <p className="text-2xl font-bold text-bolt-neutral-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-bolt-primary-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-bolt-neutral-500">Próximos atendimentos</p>
            <h2 className="text-lg font-semibold text-bolt-neutral-900">Agenda das próximas horas</h2>
          </div>
          <Link
            to="/profissional/agenda"
            className="text-sm font-medium text-bolt-primary-600 hover:text-bolt-primary-500"
          >
            Ver agenda completa →
          </Link>
        </div>
        {dashboard.proximos.length === 0 ? (
          <p className="text-bolt-neutral-500 text-sm">Nenhum atendimento futuro encontrado.</p>
        ) : (
          <ul className="space-y-3">
            {dashboard.proximos.map((item) => {
              const data = new Date(item.dataHora);
              return (
                <li key={item.id} className="flex items-center justify-between border border-bolt-primary-50 rounded-2xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-bolt-neutral-900">{item.clienteNome}</p>
                    <p className="text-xs text-bolt-neutral-500">{item.servicoPrincipal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-bolt-primary-600">
                      {data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-xs text-bolt-neutral-500">
                      {data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
