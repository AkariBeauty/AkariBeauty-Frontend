import { useEffect, useState } from "react";
import { GearSix, UploadSimple } from "@phosphor-icons/react";
import companyService from "../../services/companyService";
import type { CompanySettingsData } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { resolveEmpresaIdFromUser } from "../../utils/company";
import { CompanyPageHeader, companyCardClass } from "./layout";

export default function CompanySettingsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [data, setData] = useState<CompanySettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (authLoading) return;

            const empresaId = resolveEmpresaIdFromUser(user);
            if (!empresaId) {
                setError("Não foi possível identificar a empresa do usuário.");
                setLoading(false);
                return;
            }

            try {
                const response = await companyService.getSettings(empresaId);
                setData(response);
            } catch (err) {
                console.error("Erro ao carregar configurações da empresa", err);
                setError("Não foi possível carregar as configurações agora.");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, [authLoading, user]);

    if (loading || !data) {
        if (error) {
            return (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                    {error}
                </div>
            );
        }
        return <p className="mt-4 text-bolt-neutral-500">Carregando configurações...</p>;
    }

    return (
        <div className="space-y-6">
            <CompanyPageHeader
                subtitle="Dados oficiais"
                title="Configurações da empresa"
                actions={
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-bolt-primary-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Salvar alterações
                    </button>
                }
            />

            <section className="grid gap-4 md:grid-cols-2">
                <article className={`${companyCardClass} space-y-4`}>
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-bolt-primary-600/10 p-3 text-bolt-primary-600">
                            <GearSix size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-bolt-neutral-500">Dados legais</p>
                            <h2 className="text-lg font-semibold text-bolt-neutral-900">
                                Identificação e responsáveis
                            </h2>
                        </div>
                    </div>
                    <div className="grid gap-3 text-sm text-bolt-neutral-600">
                        <label className="space-y-1">
                            <span>Razao social</span>
                            <input
                                type="text"
                                value={data.legal.razaoSocial}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <label className="space-y-1">
                            <span>CNPJ</span>
                            <input
                                type="text"
                                value={data.legal.cnpj}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <label className="space-y-1">
                            <span>Inscrição estadual</span>
                            <input
                                type="text"
                                value={data.legal.ie}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <label className="space-y-1">
                            <span>Responsável legal</span>
                            <input
                                type="text"
                                value={data.legal.responsavel}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                    </div>
                </article>

                <article className={`${companyCardClass} space-y-4`}>
                    <p className="text-sm text-bolt-neutral-500">Contato e marca</p>
                    <div className="grid gap-3 text-sm text-bolt-neutral-600">
                        <label className="space-y-1">
                            <span>Email</span>
                            <input
                                type="email"
                                value={data.contact.email}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <label className="space-y-1">
                            <span>Telefone</span>
                            <input
                                type="text"
                                value={data.contact.phone}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <label className="space-y-1">
                            <span>WhatsApp</span>
                            <input
                                type="text"
                                value={data.contact.whatsapp}
                                readOnly
                                className="w-full rounded-2xl border border-bolt-primary-100 px-3 py-2 bg-bolt-primary-50/30"
                            />
                        </label>
                        <div className="rounded-2xl border border-dashed border-bolt-primary-100 p-4 text-center text-sm text-bolt-neutral-500">
                            <p>Logo atual</p>
                            <img
                                src={data.brand.logoUrl}
                                alt="Logo da empresa"
                                className="mx-auto mt-3 h-16 w-40 rounded-2xl border border-bolt-primary-50 object-contain"
                            />
                            <p className="mt-2 text-xs">{data.brand.updatedAt}</p>
                            <button
                                type="button"
                                className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-bolt-primary-200 px-3 py-2 text-xs font-semibold text-bolt-primary-600"
                            >
                                <UploadSimple size={14} /> Trocar logotipo
                            </button>
                        </div>
                    </div>
                </article>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                <article className={`${companyCardClass} space-y-3`}>
                    <p className="text-sm font-semibold text-bolt-neutral-900">Endereço</p>
                    <div className="grid gap-2 text-sm text-bolt-neutral-600">
                        <p>
                            {data.address.rua}, {data.address.numero} - {data.address.bairro}
                        </p>
                        <p>
                            {data.address.cidade}/{data.address.uf} · CEP {data.address.cep}
                        </p>
                    </div>
                </article>
                <article className={`${companyCardClass} space-y-3`}>
                    <p className="text-sm font-semibold text-bolt-neutral-900">Horários</p>
                    <ul className="space-y-2 text-sm text-bolt-neutral-600">
                        <li>Seg a Sex: {data.hours.segundaSexta}</li>
                        <li>Sábado: {data.hours.sabado}</li>
                        <li>Domingo: {data.hours.domingo}</li>
                    </ul>
                </article>
            </section>

            <section className={`${companyCardClass} space-y-3`}>
                <p className="text-sm font-semibold text-bolt-neutral-900">
                    Preferências de notificação
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm text-bolt-neutral-600">
                        <input
                            type="checkbox"
                            checked={data.notifications.emailFinanceiro}
                            readOnly
                        />
                        Email financeiro
                    </label>
                    <label className="flex items-center gap-2 text-sm text-bolt-neutral-600">
                        <input type="checkbox" checked={data.notifications.smsClientes} readOnly />
                        SMS para clientes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-bolt-neutral-600">
                        <input type="checkbox" checked={data.notifications.pushEquipe} readOnly />
                        Push para equipe
                    </label>
                </div>
            </section>
        </div>
    );
}
