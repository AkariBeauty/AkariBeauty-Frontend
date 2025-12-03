import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import professionalPortalService from "../../services/professionalPortalService";
import { ProfessionalAgendaItem } from "../../types";
import { ArrowLeft, CheckCircle, Phone, XCircle } from "@phosphor-icons/react";

interface AppointmentDetail extends ProfessionalAgendaItem {
    clienteId: number;
    servicos: { id: number; nome: string }[];
}

const STATUS_CODES = {
    PENDENTE: 1,
    CONFIRMADO: 2,
    CANCELADO: 3,
    AUSENTE: 4,
    COBRADO: 5,
    REALIZADO: 6,
    CANCELADO_EMPRESA: 7,
} as const;

type StatusKey = keyof typeof STATUS_CODES;

const STATUS_TRANSITIONS: Partial<Record<StatusKey, StatusKey[]>> = {
    PENDENTE: ["CONFIRMADO", "CANCELADO", "CANCELADO_EMPRESA"],
    CONFIRMADO: ["REALIZADO", "CANCELADO", "AUSENTE"],
};

const normalizeStatus = (value: string): StatusKey | undefined =>
    Object.prototype.hasOwnProperty.call(STATUS_CODES, value) ? (value as StatusKey) : undefined;

const canTransition = (fromStatus: StatusKey | undefined, toStatus: StatusKey) =>
    !!fromStatus && (STATUS_TRANSITIONS[fromStatus]?.includes(toStatus) ?? false);

export default function ProfessionalAppointmentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchDetail = async () => {
            try {
                const data = await professionalPortalService.getAgendamentoDetalhe(Number(id));
                setAppointment(data);
            } catch (err) {
                console.error(err);
                setError("Não foi possível carregar o agendamento");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const handleStatus = async (novoStatus: StatusKey) => {
        if (!appointment) return;
        setActionLoading(true);
        setError(null);

        const currentStatusKey = normalizeStatus(appointment.status);
        if (!canTransition(currentStatusKey, novoStatus)) {
            setError("Status atual não permite essa ação.");
            setActionLoading(false);
            return;
        }

        try {
            await professionalPortalService.updateStatus(appointment.id, {
                novoStatus: STATUS_CODES[novoStatus],
            });
            const updated = await professionalPortalService.getAgendamentoDetalhe(appointment.id);
            setAppointment(updated);
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                const responseMessage =
                    typeof err.response?.data === "string"
                        ? err.response.data
                        : (err.response?.data as { message?: string } | undefined)?.message;
                setError(responseMessage ?? "Não foi possível atualizar o status");
            } else {
                setError("Não foi possível atualizar o status");
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <p className="text-bolt-neutral-500 mt-10">Carregando…</p>;
    }

    if (error || !appointment) {
        return <p className="text-red-500 mt-10">{error ?? "Agendamento não encontrado"}</p>;
    }

    const data = new Date(appointment.dataHora);

    return (
        <section className="py-6 space-y-6">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-bolt-neutral-600 hover:text-bolt-neutral-900"
            >
                <ArrowLeft size={18} /> Voltar
            </button>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-bolt-primary-50 space-y-4">
                <div>
                    <p className="text-xs text-bolt-neutral-500">Cliente</p>
                    <h1 className="text-xl font-semibold text-bolt-neutral-900">
                        {appointment.clienteNome}
                    </h1>
                    <p className="text-sm text-bolt-neutral-500">ID #{appointment.clienteId}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-bolt-primary-600">
                    <Phone size={18} /> {appointment.clienteTelefone ?? "Telefone não informado"}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-bolt-neutral-600">
                    <div>
                        <p className="text-xs text-bolt-neutral-500">Data</p>
                        <p className="font-semibold">
                            {data.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                            })}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-bolt-neutral-500">Horário</p>
                        <p className="font-semibold">
                            {data.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-bolt-neutral-500">Serviços</p>
                    <ul className="text-sm text-bolt-neutral-700 list-disc list-inside">
                        {appointment.servicos.map((servico) => (
                            <li key={servico.id}>{servico.nome}</li>
                        ))}
                    </ul>
                </div>
                {appointment.observacao && (
                    <div>
                        <p className="text-xs text-bolt-neutral-500">Observações</p>
                        <p className="text-sm text-bolt-neutral-700">{appointment.observacao}</p>
                    </div>
                )}
                <div className="flex gap-2 flex-wrap">
                    {appointment.podeConfirmar && (
                        <button
                            type="button"
                            onClick={() => handleStatus("CONFIRMADO")}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-semibold disabled:opacity-50"
                        >
                            <CheckCircle size={18} /> Confirmar
                        </button>
                    )}
                    {appointment.podeConcluir && (
                        <button
                            type="button"
                            onClick={() => handleStatus("REALIZADO")}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold disabled:opacity-50"
                        >
                            <CheckCircle size={18} /> Concluir
                        </button>
                    )}
                    {canTransition(normalizeStatus(appointment.status), "CANCELADO") && (
                        <button
                            type="button"
                            onClick={() => handleStatus("CANCELADO")}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-sm font-semibold disabled:opacity-50"
                        >
                            <XCircle size={18} /> Cancelar
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
