/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { AgendamentoService } from "../../services/agendamentoService";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { servicoService, type Servico } from "../../services/servicoService";
import { showError, showSuccess } from "../../utils/toast";

export default function NovoAgendamento() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    servicoId: "",
    data: "",
    hora: "",
    observacao: "",
  });
  const [saving, setSaving] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const clienteId = useMemo(() => {
    if (!user) return 0;
    const raw = (user as any)?.id;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [user]);

  useEffect(() => {
    const carregarServicos = async () => {
      try {
        const lista = await servicoService.getAll();
        setServicos(lista);
      } catch (error) {
        console.error("Falha ao carregar serviços", error);
      }
    };

    carregarServicos();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clienteId) {
      showError("Faça login primeiro.");
      return;
    }
    if (!form.servicoId || !form.data || !form.hora) {
      showError("Selecione um serviço, data e horário.");
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
        dataHora: dataHora.toISOString(),
        observacao: form.observacao || undefined,
      });
      showSuccess("Agendamento criado com sucesso!");
      setForm({ servicoId: "", data: "", hora: "", observacao: "" });
    } catch (e) {
      console.error(e);
      showError("Falha ao agendar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Novo Agendamento</h1>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Serviço</span>
            <select
              value={form.servicoId}
              onChange={(e) => setForm({ ...form, servicoId: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.servicoPrestado} — R$ {servico.valorBase.toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Data</span>
            <input
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Horário</span>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium text-gray-700">Observação (opcional)</span>
            <textarea
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </label>
        </div>
        <div className="flex gap-3">
          <Button label="Limpar" background="bg-gray-200" color="text-gray-700" action={() => setForm({ servicoId: "", data: "", hora: "", observacao: "" })} />
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={saving}>
            {saving ? "Salvando..." : "Agendar"}
          </button>
        </div>
      </form>
    </div>
  );
}
