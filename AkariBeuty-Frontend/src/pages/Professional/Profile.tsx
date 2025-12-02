import { FormEvent, useEffect, useState } from "react";
import professionalPortalService from "../../services/professionalPortalService";
import { ProfessionalProfile } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfessionalProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [formState, setFormState] = useState({ nome: "", login: "", telefone: "", senha: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await professionalPortalService.getPerfil();
        setProfile(data);
        setFormState({
          nome: data.nome,
          login: data.login,
          telefone: data.telefone ?? "",
          senha: "",
        });
      } catch (err) {
        console.error(err);
        setMessage("Não foi possível carregar o perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await professionalPortalService.updatePerfil({
        nome: formState.nome,
        login: formState.login,
        telefone: formState.telefone || undefined,
        senha: formState.senha || undefined,
      });
      updateUser({ name: formState.nome, email: formState.login, phone: formState.telefone });
      setFormState((prev) => ({ ...prev, senha: "" }));
      setMessage("Perfil atualizado com sucesso.");
    } catch (err) {
      console.error(err);
      setMessage("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-bolt-neutral-500 mt-10">Carregando perfil…</p>;
  }

  if (!profile) {
    return <p className="text-red-500 mt-10">{message ?? "Perfil não encontrado"}</p>;
  }

  return (
    <section className="py-6 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-bolt-primary-50">
        <header className="mb-6">
          <p className="text-xs text-bolt-neutral-500">Empresa</p>
          <h1 className="text-2xl font-semibold text-bolt-neutral-900">{profile.empresaNome ?? "-"}</h1>
          <p className="text-xs text-bolt-neutral-500 mt-1">Status: {profile.status}</p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-bolt-neutral-500">Nome completo</label>
            <input
              type="text"
              value={formState.nome}
              onChange={(event) => setFormState((prev) => ({ ...prev, nome: event.target.value }))}
              className="w-full border border-bolt-primary-100 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
              required
            />
          </div>

          <div>
            <label className="text-sm text-bolt-neutral-500">Email/Login</label>
            <input
              type="email"
              value={formState.login}
              onChange={(event) => setFormState((prev) => ({ ...prev, login: event.target.value }))}
              className="w-full border border-bolt-primary-100 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
              required
            />
          </div>

          <div>
            <label className="text-sm text-bolt-neutral-500">Telefone</label>
            <input
              type="tel"
              value={formState.telefone}
              onChange={(event) => setFormState((prev) => ({ ...prev, telefone: event.target.value }))}
              className="w-full border border-bolt-primary-100 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
            />
          </div>

          <div>
            <label className="text-sm text-bolt-neutral-500">Nova senha (opcional)</label>
            <input
              type="password"
              value={formState.senha}
              onChange={(event) => setFormState((prev) => ({ ...prev, senha: event.target.value }))}
              className="w-full border border-bolt-primary-100 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-bolt-primary-200"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-bolt-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-bolt-primary-500 transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </form>
        {message && <p className="text-xs text-bolt-neutral-500 mt-4">{message}</p>}
      </div>
    </section>
  );
}
