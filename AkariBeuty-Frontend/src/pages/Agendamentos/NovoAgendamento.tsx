/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { AgendamentoService } from "../../services/agendamentoService";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { servicoService, type Servico } from "../../services/servicoService";
import profissionalService, { type ProfissionalApi } from "../../services/profissionalService";
import { availabilityService } from "../../services/availabilityService";
import { showError, showSuccess } from "../../utils/toast";

const BLOCKED_KEYWORDS = ["administrador", "funcionário", "funcionario", "recepcionista"];

const INITIAL_FORM = {
  servicoId: "",
  profissionalId: "",
  data: "",
  hora: "",
  observacao: "",
};

export default function NovoAgendamento() {
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [professionals, setProfessionals] = useState<ProfissionalApi[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [availability, setAvailability] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const clienteId = useMemo(() => {
    if (!user) return 0;
    const raw = (user as any)?.id;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [user]);

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        setLoadingServicos(true);
        const lista = await servicoService.getAll();
        setServicos(lista);
      } catch (error) {
        console.error("Falha ao carregar serviços", error);
        showError("Não foi possível carregar os serviços.");
      } finally {
        setLoadingServicos(false);
      }
    };

    void carregarServicos();
  }, []);

  useEffect(() => {
    const carregarProfissionais = async () => {
      setProfessionals([]);
      setAvailability([]);
      setAvailabilityError(null);
      setForm((prev) => ({ ...prev, profissionalId: "", hora: "" }));

      if (!form.servicoId) {
        return;
      }

      try {
        setLoadingProfessionals(true);
        const lista = await profissionalService.listar({ servicoId: Number(form.servicoId) });
        const filtrados = lista.filter((item) => {
          const nome = item.nome?.toLowerCase() ?? "";
          return !BLOCKED_KEYWORDS.some((keyword) => nome.includes(keyword));
        });
        setProfessionals(filtrados);
        setForm((prev) => {
          if (filtrados.length === 1) {
            return { ...prev, profissionalId: String(filtrados[0].id) };
          }
          if (prev.profissionalId && filtrados.some((prof) => prof.id === Number(prev.profissionalId))) {
            return prev;
          }
          return { ...prev, profissionalId: "" };
        });
      } catch (error) {
        console.error("Falha ao carregar profissionais", error);
        showError("Não foi possível carregar os profissionais.");
        setForm((prev) => ({ ...prev, profissionalId: "" }));
      } finally {
        setLoadingProfessionals(false);
      }
    };

    void carregarProfissionais();
  }, [form.servicoId]);

  useEffect(() => {
    const carregarDisponibilidade = async () => {
      setAvailability([]);
      setAvailabilityError(null);
      setForm((prev) => ({ ...prev, hora: "" }));

      if (!form.servicoId || !form.profissionalId || !form.data) {
        return;
      }

      try {
        setLoadingAvailability(true);
        const resposta = await availabilityService.fetch({
          servicoId: Number(form.servicoId),
          profissionalId: Number(form.profissionalId),
          startDate: form.data,
          endDate: form.data,
        });
        const dia = resposta.find((item) => item.date === form.data);
        const slots = dia?.slots ?? [];
        setAvailability(slots);
        setAvailabilityError(slots.length === 0 ? "Sem horários disponíveis para esta data." : null);
      } catch (error) {
        console.error("Falha ao carregar disponibilidade", error);
        setAvailability([]);
        setAvailabilityError("Não foi possível carregar os horários disponíveis.");
      } finally {
        setLoadingAvailability(false);
      }
    };

    void carregarDisponibilidade();
  }, [form.servicoId, form.profissionalId, form.data]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setProfessionals([]);
    setAvailability([]);
    setAvailabilityError(null);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clienteId) {
      showError("Faça login primeiro.");
      return;
    }
    if (!form.servicoId || !form.profissionalId || !form.data || !form.hora) {
      showError("Selecione serviço, profissional, data e horário.");
      return;
    }

    const dataHora = new Date(`${form.data}T${form.hora}`);
    if (isNaN(dataHora.getTime())) {
      showError("Data ou horário inválido.");
      return;
    }

    setSaving(true);
    try {
      await AgendamentoService.criar({
        clienteId,
        servicoId: parseInt(form.servicoId),
        profissionalId: parseInt(form.profissionalId),
        dataHora: dataHora.toISOString(),
        observacao: form.observacao?.trim() ? form.observacao.trim() : undefined,
      });
      showSuccess("Agendamento criado com sucesso!");
      resetForm();
    } catch (error) {
      console.error(error);
      showError("Falha ao agendar.");
    } finally {
      setSaving(false);
    }
  }

  const formatCurrency = (value: number) =>
    Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Novo Agendamento</h1>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Serviço</span>
            <select
              value={form.servicoId}
              onChange={(e) => setForm((prev) => ({ ...prev, servicoId: e.target.value }))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loadingServicos}
            >
              <option value="" disabled>
                {loadingServicos ? "Carregando serviços..." : "Selecione um serviço"}
              </option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.servicoPrestado} — {formatCurrency(servico.valorBase)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Profissional</span>
            <select
              value={form.profissionalId}
              onChange={(e) => setForm((prev) => ({ ...prev, profissionalId: e.target.value }))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!form.servicoId || loadingProfessionals || professionals.length === 0}
            >
              <option value="">
                {loadingProfessionals
                  ? "Buscando profissionais..."
                  : professionals.length === 0
                  ? "Nenhum profissional disponível"
                  : "Selecione um profissional"}
              </option>
              {professionals.map((profissional) => (
                <option key={profissional.id} value={profissional.id}>
                  {profissional.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Data</span>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm((prev) => ({ ...prev, data: e.target.value }))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              min={new Date().toISOString().split("T")[0]}
              disabled={!form.servicoId || !form.profissionalId}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Horário</span>
            <select
              value={form.hora}
              onChange={(e) => setForm((prev) => ({ ...prev, hora: e.target.value }))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={!form.data || loadingAvailability || availability.length === 0}
            >
              <option value="">
                {!form.data
                  ? "Selecione uma data"
                  : loadingAvailability
                  ? "Carregando horários..."
                  : availability.length === 0
                  ? "Nenhum horário disponível"
                  : "Selecione um horário"}
              </option>
              {availability.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {availabilityError ? (
              <span className="text-xs text-red-500">{availabilityError}</span>
            ) : null}
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Observação (opcional)</span>
            <textarea
              value={form.observacao}
              onChange={(e) => setForm((prev) => ({ ...prev, observacao: e.target.value }))}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Detalhes importantes para o profissional"
            />
          </label>
        </div>
        <div className="flex gap-3">
          <Button label="Limpar" background="bg-gray-200" color="text-gray-700" action={resetForm} />
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={saving}>
            {saving ? "Salvando..." : "Agendar"}
          </button>
        </div>
      </form>
    </div>
  );
}
