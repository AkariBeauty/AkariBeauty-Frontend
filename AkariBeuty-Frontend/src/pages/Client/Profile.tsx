import { useEffect, useMemo, useState } from "react";
import {
  CalendarDots,
  Heart,
  IdentificationCard,
  PencilSimpleLine,
  Phone,
  ShieldCheck,
  SignOut,
  Star,
} from "@phosphor-icons/react";
import clienteService, { Cliente, ClienteProfile, ClienteProfileStats } from "../../services/clienteService";
import { useAuth } from "../../contexts/AuthContext";
import { showError, showSuccess } from "../../utils/toast";

type ProfileFormState = ClienteProfile;

const defaultProfile: ProfileFormState = {
  id: 0,
  nome: "",
  cpf: "",
  uf: "",
  cidade: "",
  bairro: "",
  rua: "",
  numero: undefined,
  email: "",
  telefone: "",
  avatarUrl: undefined,
};

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fetchingEditData, setFetchingEditData] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>(defaultProfile);
  const [pristineProfile, setPristineProfile] = useState<ProfileFormState>(defaultProfile);
  const [stats, setStats] = useState<ClienteProfileStats | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const mapClienteToProfile = (cliente: Cliente | null): ProfileFormState | null => {
    if (!cliente) return null;
    return {
      ...defaultProfile,
      id: Number(cliente.id ?? 0),
      nome: cliente.name ?? "",
      email: cliente.email ?? "",
      telefone: cliente.phone ?? "",
      cpf: cliente.document ?? "",
    };
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const statsPromise = clienteService.getProfileStats().catch(() => null);
        const profilePromise = clienteService
          .getProfile()
          .catch(async () => {
            if (!user?.id) return null;
            try {
              const raw = await clienteService.getById(user.id);
              return mapClienteToProfile(raw);
            } catch {
              return null;
            }
          });

        const [profileData, statsData] = await Promise.all([profilePromise, statsPromise]);

        if (profileData) {
          setProfile(profileData);
          setPristineProfile(profileData);
        } else if (user?.id) {
          const byId = await clienteService
            .getById(user.id)
            .then((raw) => mapClienteToProfile(raw))
            .catch(() => null);
          if (byId) {
            setProfile(byId);
            setPristineProfile(byId);
          } else {
            const fallback: ProfileFormState = {
              ...defaultProfile,
              id: Number(user.id) || 0,
              nome: user.name ?? "",
              email: user.email ?? "",
              telefone: user.phone ?? "",
            };
            setProfile(fallback);
            setPristineProfile(fallback);
          }
        }

        if (statsData) setStats(statsData);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user]);

  const memberSinceLabel = useMemo(() => {
    if (!stats?.memberSince) return "—";
    const parsed = new Date(stats.memberSince);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  }, [stats?.memberSince]);

  const hasChanges = useMemo(() => JSON.stringify(profile) !== JSON.stringify(pristineProfile), [profile, pristineProfile]);

  const handleChange = (field: keyof ProfileFormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = field === "numero" ? Number(event.target.value) || undefined : event.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile.nome || !profile.email) {
      showError("Informe nome e e-mail para salvar.");
      return;
    }

    setSaving(true);
    try {
      await clienteService.updateProfile(profile);
      setPristineProfile(profile);
      updateUser({ name: profile.nome, email: profile.email, phone: profile.telefone });
      setEditing(false);
      showSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
      showError("Não foi possível atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setProfile(pristineProfile);
    setEditing(false);
  };

  const handleStartEdit = async () => {
    if (!user?.id) {
      setEditing(true);
      return;
    }
    setFetchingEditData(true);
    try {
      const raw = await clienteService.getById(user.id).catch(() => null);
      const mapped = mapClienteToProfile(raw);
      if (mapped) {
        setProfile((prev) => ({ ...prev, ...mapped }));
        setPristineProfile((prev) => ({ ...prev, ...mapped }));
      }
      setEditing(true);
    } finally {
      setFetchingEditData(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordForm({ current: "", next: "" });
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (changingPassword) return;
    setPasswordModalOpen(false);
  };

  const submitPasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.next) {
      showError("Informe a senha atual e a nova senha.");
      return;
    }

    setChangingPassword(true);
    try {
      await clienteService.changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
      });
      showSuccess("Senha alterada com sucesso.");
      setPasswordModalOpen(false);
    } catch (error) {
      console.error("Erro ao alterar senha", error);
      showError("Não foi possível alterar a senha.");
    } finally {
      setChangingPassword(false);
    }
  };

  const summary = {
    total: stats?.totalAppointments ?? 0,
    favorites: stats?.favoriteServices?.length ?? 0,
    rating: stats?.averageRating ?? 0,
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-bolt-neutral-500">
        Carregando perfil...
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#FEF4FF] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <section className="rounded-3xl bg-gradient-to-br from-[#FDE1F3] to-[#FBE8FF] border border-[#FABADE] shadow-sm p-8 text-center space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F05DA3] to-[#D05CFF] text-white text-3xl font-semibold flex items-center justify-center">
              {profile.nome ? profile.nome[0]?.toUpperCase() : "A"}
            </div>
            <div>
              <p className="text-sm text-[#B0729C]">Meu Perfil</p>
              <h1 className="text-2xl font-semibold text-[#4A235A]">{profile.nome || "Cliente"}</h1>
              <p className="text-base text-[#7A3F73]">{profile.email || "Atualize seu e-mail"}</p>
              <p className="text-sm text-[#B0729C]">Membro desde {memberSinceLabel}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-left">
            {[{
              label: "Agendamentos",
              value: summary.total,
              Icon: CalendarDots,
            }, {
              label: "Avaliação",
              value: summary.rating.toFixed(1),
              Icon: Star,
            }, {
              label: "Favoritos",
              value: summary.favorites,
              Icon: Heart,
            }].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl bg-white/80 border border-white px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF1F8] text-[#F05DA3] flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#B0729C]">{label}</p>
                  <p className="text-2xl font-semibold text-[#4A235A]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-[#F6D9EB] p-6 space-y-6">
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#B0729C]">Informações Pessoais</p>
              <h2 className="text-xl font-semibold text-[#3A1F4F]">Gerencie seus dados na Akari Beauty</h2>
            </div>
            <button
              type="button"
              onClick={editing ? handleCancelEdit : handleStartEdit}
              disabled={fetchingEditData}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-[#F05DA3] border border-[#F05DA3] hover:bg-[#F05DA3] hover:text-white transition disabled:opacity-50"
            >
              <PencilSimpleLine size={16} /> {editing ? "Cancelar" : "Editar"}
            </button>
          </header>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Nome completo
                  <input
                    type="text"
                    value={profile.nome ?? ""}
                    onChange={handleChange("nome")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  CPF
                  <input
                    type="text"
                    value={profile.cpf ?? ""}
                    onChange={handleChange("cpf")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  E-mail
                  <input
                    type="email"
                    value={profile.email ?? ""}
                    onChange={handleChange("email")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                    required
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Telefone
                  <input
                    type="tel"
                    value={profile.telefone ?? ""}
                    onChange={handleChange("telefone")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Estado (UF)
                  <input
                    type="text"
                    value={profile.uf ?? ""}
                    onChange={handleChange("uf")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                    maxLength={2}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Cidade
                  <input
                    type="text"
                    value={profile.cidade ?? ""}
                    onChange={handleChange("cidade")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Bairro
                  <input
                    type="text"
                    value={profile.bairro ?? ""}
                    onChange={handleChange("bairro")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Rua
                  <input
                    type="text"
                    value={profile.rua ?? ""}
                    onChange={handleChange("rua")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Número
                  <input
                    type="number"
                    value={profile.numero ?? ""}
                    onChange={handleChange("numero")}
                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                    min={0}
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                  Complemento
                  <input
                    type="text"
                    disabled
                    placeholder="Em breve"
                    className="rounded-2xl border border-dashed border-[#F3D7EB] px-4 py-2.5 bg-[#FDF6FB] text-[#BEA2B9]"
                  />
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-2xl border border-[#E1B9D1] text-[#7A3F73]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!hasChanges || saving}
                  className="px-6 py-2 rounded-2xl text-white bg-[#F05DA3] shadow disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {[{
                label: "Nome completo",
                value: profile.nome,
              }, {
                label: "Email",
                value: profile.email,
              }, {
                label: "Telefone",
                value: profile.telefone,
              }, {
                label: "CPF",
                value: profile.cpf,
              }, {
                label: "Cidade",
                value: profile.cidade,
              }, {
                label: "Estado (UF)",
                value: profile.uf,
              }].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-2 text-sm text-[#B0729C]">
                  {label}
                  <div className="rounded-2xl border border-[#F3D7EB] px-3 py-2 text-[#4A235A] bg-[#FFF9FD]">
                    {value || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-3xl border border-[#F3D7EB] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#7A3F73]">
              <ShieldCheck size={20} />
              <h3 className="font-semibold">Segurança</h3>
            </div>
            <p className="text-sm text-[#B0729C]">Mantenha sua senha sempre atualizada para proteger sua conta.</p>
            <button
              type="button"
              onClick={openPasswordModal}
              className="px-4 py-2 rounded-2xl text-sm font-medium text-white bg-[#F05DA3]"
            >
              Alterar senha
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#F3D7EB] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#7A3F73]">
              <IdentificationCard size={20} />
              <h3 className="font-semibold">Serviços favoritos</h3>
            </div>
            {stats?.favoriteServices?.length ? (
              <div className="flex flex-wrap gap-2">
                {stats.favoriteServices.map((service) => (
                  <span key={service} className="px-3 py-1 rounded-full bg-[#FDF1F8] text-[#F05DA3] text-sm">
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#B0729C]">Você ainda não marcou serviços como favoritos.</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-[#F3D7EB] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#7A3F73]">
            <SignOut size={20} />
            <h3 className="font-semibold">Conta</h3>
          </div>
          <p className="text-sm text-[#B0729C]">Deseja sair da conta atual?</p>
          <button
            type="button"
            onClick={logout}
            className="self-start px-4 py-2 rounded-2xl bg-[#FFE4EB] text-[#E53F6E] font-medium"
          >
            Sair da conta
          </button>
        </section>

        <section className="bg-white rounded-3xl border border-[#F3D7EB] p-6">
          <div className="flex items-center gap-2 text-[#7A3F73] mb-2">
            <Phone size={20} />
            <h3 className="font-semibold">Precisa de ajuda?</h3>
          </div>
          <p className="text-sm text-[#B0729C]">Fale com nossa equipe caso tenha dúvidas sobre seu perfil ou agendamentos.</p>
        </section>
        </div>
      </div>

      {passwordModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closePasswordModal}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF1F8] text-[#F05DA3]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#3A1F4F]">Alterar senha</h3>
                <p className="text-sm text-[#B0729C]">Informe sua senha atual e defina uma nova senha segura.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                Senha atual
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
                  className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                Nova senha
                <input
                  type="password"
                  value={passwordForm.next}
                  onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
                  className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closePasswordModal}
                className="flex-1 rounded-2xl border border-[#E1B9D1] px-4 py-2.5 text-[#7A3F73]"
                disabled={changingPassword}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={submitPasswordChange}
                className="flex-1 rounded-2xl bg-[#F05DA3] px-4 py-2.5 text-white font-semibold"
                disabled={changingPassword}
              >
                {changingPassword ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
