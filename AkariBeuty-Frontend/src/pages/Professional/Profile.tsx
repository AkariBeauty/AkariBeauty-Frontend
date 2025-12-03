import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Buildings,
    IdentificationCard,
    PencilSimpleLine,
    Phone,
    ShieldCheck,
    SignOut,
    UserCircle,
} from "@phosphor-icons/react";
import professionalPortalService from "../../services/professionalPortalService";
import { ProfessionalProfile } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfessionalProfilePage() {
    const navigate = useNavigate();
    const { updateUser, logout } = useAuth();
    const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
    const [formState, setFormState] = useState({ nome: "", login: "", telefone: "" });
    const [pristineForm, setPristineForm] = useState({ nome: "", login: "", telefone: "" });
    const [editing, setEditing] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ nova: "", confirmacao: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await professionalPortalService.getPerfil();
                setProfile(data);
                setFormState({
                    nome: data.nome,
                    login: data.login,
                    telefone: data.telefone ?? "",
                });
                setPristineForm({
                    nome: data.nome,
                    login: data.login,
                    telefone: data.telefone ?? "",
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
            });
            updateUser({ name: formState.nome, email: formState.login, phone: formState.telefone });
            setPristineForm(formState);
            setEditing(false);
            setMessage("Perfil atualizado com sucesso.");
        } catch (err) {
            console.error(err);
            setMessage("Erro ao salvar perfil. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    const openPasswordModal = () => {
        setPasswordForm({ nova: "", confirmacao: "" });
        setPasswordMessage(null);
        setPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        if (changingPassword) return;
        setPasswordModalOpen(false);
    };

    const submitPasswordChange = async (event: FormEvent) => {
        event.preventDefault();
        if (!profile) return;

        if (passwordForm.nova.length < 6) {
            setPasswordMessage("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        if (passwordForm.nova !== passwordForm.confirmacao) {
            setPasswordMessage("As senhas informadas não conferem.");
            return;
        }

        setChangingPassword(true);
        setPasswordMessage(null);

        try {
            await professionalPortalService.updatePerfil({
                nome: formState.nome,
                login: formState.login,
                telefone: formState.telefone || undefined,
                senha: passwordForm.nova,
            });
            setPasswordModalOpen(false);
        } catch (err) {
            console.error(err);
            setPasswordMessage("Não foi possível atualizar a senha. Tente novamente.");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const hasChanges = useMemo(
        () => JSON.stringify(formState) !== JSON.stringify(pristineForm),
        [formState, pristineForm]
    );

    if (loading) {
        return <p className="text-bolt-neutral-500 mt-10">Carregando perfil…</p>;
    }

    if (!profile) {
        return <p className="text-red-500 mt-10">{message ?? "Perfil não encontrado"}</p>;
    }

    const summaryCards = [
        {
            label: "Status",
            value: profile.status,
            Icon: ShieldCheck,
        },
        {
            label: "Empresa",
            value: profile.empresaNome ?? "—",
            Icon: Buildings,
        },
        {
            label: "Login",
            value: profile.login,
            Icon: IdentificationCard,
        },
    ];

    return (
        <div className="bg-[#FEF4FF] min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
                <section className="rounded-3xl bg-gradient-to-br from-[#FDE1F3] to-[#FBE8FF] border border-[#FABADE] shadow-sm p-8 text-center space-y-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F05DA3] to-[#D05CFF] text-white text-3xl font-semibold flex items-center justify-center">
                            {profile.nome ? profile.nome[0]?.toUpperCase() : "P"}
                        </div>
                        <div>
                            <p className="text-sm text-[#B0729C]">Perfil profissional</p>
                            <h1 className="text-2xl font-semibold text-[#4A235A]">
                                {profile.nome}
                            </h1>
                            <p className="text-base text-[#7A3F73]">{profile.login}</p>
                            <p className="text-sm text-[#B0729C]">
                                {profile.empresaNome ?? "Empresa não definida"}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 text-left">
                        {summaryCards.map(({ label, value, Icon }) => (
                            <div
                                key={label}
                                className="rounded-2xl bg-white/80 border border-white px-5 py-4 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-[#FDF1F8] text-[#F05DA3] flex items-center justify-center">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-[#B0729C]">
                                        {label}
                                    </p>
                                    <p className="text-xl font-semibold text-[#4A235A]">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-3xl shadow-sm border border-[#F6D9EB] p-6 space-y-6">
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-[#B0729C]">Informações do profissional</p>
                            <h2 className="text-xl font-semibold text-[#3A1F4F]">
                                Mantenha seus dados sempre atualizados
                            </h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (editing) {
                                    setFormState(pristineForm);
                                    setEditing(false);
                                    setMessage(null);
                                } else {
                                    setEditing(true);
                                }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium text-[#F05DA3] border border-[#F05DA3] hover:bg-[#F05DA3] hover:text-white transition"
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
                                        value={formState.nome}
                                        onChange={(event) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                nome: event.target.value,
                                            }))
                                        }
                                        className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                                    Telefone
                                    <input
                                        type="tel"
                                        value={formState.telefone}
                                        onChange={(event) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                telefone: event.target.value,
                                            }))
                                        }
                                        className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                                    />
                                </label>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                                    Email / Login
                                    <input
                                        type="email"
                                        value={formState.login}
                                        onChange={(event) =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                login: event.target.value,
                                            }))
                                        }
                                        className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                                        required
                                    />
                                </label>
                                <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                                    Empresa atual
                                    <input
                                        type="text"
                                        value={profile.empresaNome ?? ""}
                                        disabled
                                        className="rounded-2xl border border-dashed border-[#F3D7EB] px-4 py-2.5 bg-[#FDF6FB] text-[#BEA2B9]"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-wrap justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormState(pristineForm);
                                        setEditing(false);
                                    }}
                                    className="px-4 py-2 rounded-2xl border border-[#E1B9D1] text-[#7A3F73]"
                                >
                                    Descartar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!hasChanges || saving}
                                    className="px-6 py-2 rounded-2xl text-white bg-[#F05DA3] shadow disabled:opacity-50"
                                >
                                    {saving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                            {message && <p className="text-sm text-[#5E3F63]">{message}</p>}
                        </form>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2">
                            {[
                                {
                                    label: "Nome",
                                    value: formState.nome,
                                },
                                {
                                    label: "Email / Login",
                                    value: formState.login,
                                },
                                {
                                    label: "Telefone",
                                    value: formState.telefone,
                                },
                                {
                                    label: "Status",
                                    value: profile.status,
                                },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex flex-col gap-2 text-sm text-[#B0729C]"
                                >
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
                        <p className="text-sm text-[#B0729C]">
                            Mantenha sua senha sempre atualizada para proteger sua conta.
                        </p>
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
                            <UserCircle size={20} />
                            <h3 className="font-semibold">Acesso rápido</h3>
                        </div>
                        <p className="text-sm text-[#B0729C]">
                            Faça logout com segurança sempre que precisar trocar de conta.
                        </p>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-2xl bg-[#FFE4EB] text-[#E53F6E] font-medium"
                        >
                            Sair da conta
                        </button>
                    </div>
                </section>

                <section className="bg-white rounded-3xl border border-[#F3D7EB] p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-[#7A3F73]">
                        <Phone size={20} />
                        <h3 className="font-semibold">Precisa de ajuda?</h3>
                    </div>
                    <p className="text-sm text-[#B0729C]">
                        Fale com nossa equipe caso tenha dúvidas sobre seus agendamentos ou perfil
                        profissional.
                    </p>
                </section>
            </div>

            {passwordModalOpen && (
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
                                <h3 className="text-lg font-semibold text-[#3A1F4F]">
                                    Alterar senha
                                </h3>
                                <p className="text-sm text-[#B0729C]">
                                    Defina uma nova senha segura para continuar protegendo sua
                                    conta.
                                </p>
                            </div>
                        </div>

                        <form className="mt-6 space-y-4" onSubmit={submitPasswordChange}>
                            <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                                Nova senha
                                <input
                                    type="password"
                                    value={passwordForm.nova}
                                    onChange={(event) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            nova: event.target.value,
                                        }))
                                    }
                                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                                    minLength={6}
                                    required
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-[#5E3F63]">
                                Confirmar nova senha
                                <input
                                    type="password"
                                    value={passwordForm.confirmacao}
                                    onChange={(event) =>
                                        setPasswordForm((prev) => ({
                                            ...prev,
                                            confirmacao: event.target.value,
                                        }))
                                    }
                                    className="rounded-2xl border border-[#F3D7EB] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F05DA3]"
                                    minLength={6}
                                    required
                                />
                            </label>
                            {passwordMessage && (
                                <p className="text-sm text-[#B0729C]">{passwordMessage}</p>
                            )}

                            <div className="mt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closePasswordModal}
                                    className="flex-1 rounded-2xl border border-[#E1B9D1] px-4 py-2.5 text-[#7A3F73]"
                                    disabled={changingPassword}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-2xl bg-[#F05DA3] px-4 py-2.5 text-white font-semibold disabled:opacity-50"
                                    disabled={changingPassword}
                                >
                                    {changingPassword ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
