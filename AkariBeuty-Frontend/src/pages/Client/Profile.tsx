import { useEffect, useState } from "react";
import clienteService, { ClienteProfileStats } from "../../services/clienteService";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ClienteProfileStats>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    memberSince: "",
    totalAppointments: 0,
    favoriteServices: [],
    averageRating: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await clienteService.getProfileStats();
        setStats(data);
      } catch (err) {
        console.error("Falha ao carregar estatísticas do perfil", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChangePassword = async () => {
    try {
      await clienteService.changePassword({
        currentPassword: "123456", // troque por valores vindos do seu formulário
        newPassword: "654321",
      });
      alert("Senha alterada com sucesso.");
    } catch (err) {
      console.error("Erro ao alterar senha", err);
      alert("Não foi possível alterar a senha.");
    }
  };

  if (loading) return <div>Carregando perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Meu Perfil</h1>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium">Dados</h2>
        <div className="mt-2 space-y-1 text-sm">
          <div><strong>Nome:</strong> {stats.name}</div>
          <div><strong>E-mail:</strong> {stats.email}</div>
          <div><strong>Telefone:</strong> {stats.phone}</div>
          <div><strong>Membro desde:</strong> {new Date(stats.memberSince).toLocaleString()}</div>
        </div>
      </section>

      <section className="rounded-lg border p-4 mb-6">
        <h2 className="font-medium">Resumo</h2>
        <div className="mt-2 text-sm">
          <div><strong>Total de agendamentos:</strong> {stats.totalAppointments}</div>
          <div><strong>Serviços favoritos:</strong> {stats.favoriteServices.join(", ") || "—"}</div>
          <div><strong>Avaliação média:</strong> {stats.averageRating.toFixed(1)}</div>
        </div>
      </section>

      <div className="flex gap-2">
        <button
          className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm"
          onClick={onChangePassword}
        >
          Alterar senha (exemplo)
        </button>
      </div>
    </div>
  );
}
