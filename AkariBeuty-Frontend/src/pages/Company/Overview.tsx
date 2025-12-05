import { useEffect, useMemo, useState } from "react";
import {
    Buildings,
    IdentificationCard,
    MapPin,
    Clock,
    ShieldCheck,
    CurrencyCircleDollar,
} from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanyProfile } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { CompanyPageHeader, companyCardClass } from "./layout";
import { resolveEmpresaIdFromUser } from "../../utils/company";

const infoCardClasses = `${companyCardClass} flex flex-col gap-2 text-bolt-neutral-900`;

export default function CompanyOverviewPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (authLoading) return;

            const empresaId = resolveEmpresaIdFromUser(user);
            if (!empresaId) {
                setError("Usuario nao possui empresa vinculada ao token.");
                setLoading(false);
                return;
            }

            try {
                const data = await companyService.getProfile(empresaId);
                setProfile(data);
            } catch (err) {
                console.error("Erro ao carregar dados da empresa", err);
                setError("Nao foi possivel carregar os dados cadastrais agora.");
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, [authLoading, user]);

    const workingHours = useMemo(() => {
        if (!profile) return "--";
        const format = (value?: string) => (value ? value.substring(0, 5) : "--");
        return `${format(profile.horaInicial)} as ${format(profile.horaFinal)}`;
    }, [profile]);

    if (loading) {
        return <p className="mt-4 text-bolt-neutral-500">Carregando dados cadastrais...</p>;
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-600">
                {error}
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Resumo cadastral e status operacional"
                title="Minha empresa"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600"
                    >
                        Atualizar cadastro
                    </button>
                }
            />

            <section
                className={`${companyCardClass} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
            >
                <div>
                    <p className="text-sm text-bolt-neutral-500">Razão social</p>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-bolt-neutral-900">
                        <Buildings size={24} className="text-bolt-primary-600" />
                        {profile.razaoSocial}
                    </h2>
                    <p className="text-sm text-bolt-neutral-500">CNPJ {profile.cnpj}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <span className="rounded-2xl border border-bolt-primary-50 bg-white px-4 py-2 text-sm font-semibold text-bolt-neutral-600">
                        ID #{profile.id}
                    </span>
                    <span
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                            profile.adiantamento
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-bolt-primary-50 bg-white text-bolt-neutral-500"
                        }`}
                    >
                        {profile.adiantamento ? "Adiantamento ativo" : "Sem adiantamento"}
                    </span>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <article className={infoCardClasses}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-bolt-neutral-500">
                        <IdentificationCard size={18} />
                        Dados cadastrais
                    </div>
                    <div className="space-y-1 text-sm text-bolt-neutral-600">
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">
                                Razao social:
                            </span>{" "}
                            {profile.razaoSocial}
                        </p>
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">CNPJ:</span>{" "}
                            {profile.cnpj}
                        </p>
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">Registro:</span> #
                            {profile.id}
                        </p>
                    </div>
                </article>
                <article className={infoCardClasses}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-bolt-neutral-500">
                        <MapPin size={18} />
                        Localizacao
                    </div>
                    <div className="space-y-1 text-sm text-bolt-neutral-600">
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">Endereco:</span>{" "}
                            {profile.rua}, {profile.numero}
                        </p>
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">Bairro:</span>{" "}
                            {profile.bairro}
                        </p>
                        <p>
                            <span className="font-semibold text-bolt-neutral-900">Cidade/UF:</span>{" "}
                            {profile.cidade} - {profile.uf}
                        </p>
                    </div>
                </article>
                <article className={infoCardClasses}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-bolt-neutral-500">
                        <Clock size={18} />
                        Horarios de atendimento
                    </div>
                    <p className="text-2xl font-semibold text-bolt-neutral-900">{workingHours}</p>
                    <p className="text-xs text-bolt-neutral-500">
                        Configuracoes podem ser editadas na configuracao da conta.
                    </p>
                </article>
                <article className={infoCardClasses}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-bolt-neutral-500">
                        <ShieldCheck size={18} />
                        Proximos passos
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-sm text-bolt-neutral-600">
                        <li>Atualize o catalogo em Servicos e Catalogo.</li>
                        <li>Convide profissionais para conectarem seus perfis.</li>
                        <li>Configure notificacoes em Comunicacao.</li>
                    </ul>
                </article>
            </section>
            <section className={companyCardClass}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-bolt-neutral-400">
                            Acesso rapido
                        </p>
                        <h2 className="text-lg font-semibold text-bolt-neutral-900">
                            Gerencie financas e agenda corporativa
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-4 py-2 text-sm font-semibold text-bolt-primary-600 hover:bg-bolt-primary-50"
                    >
                        <CurrencyCircleDollar size={18} /> Ir para o financeiro
                    </button>
                </div>
                <p className="mt-3 text-sm text-bolt-neutral-600">
                    Utilize o menu lateral para navegar entre os modulos prioritarios. Este painel
                    consolida seus dados cadastrais diretamente das estruturas do backend (Empresa,
                    Usuario e horarios de operacao).
                </p>
            </section>
        </div>
    );
}
