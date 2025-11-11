/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AgendamentoService } from "../../services/agendamentoService";
import InputLogin from "../../components/InputLogin";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";

export default function NovoAgendamento() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    empresaId: "",
    profissionalId: "",
    servicoId: "",
    dataHoraInicio: "",
    dataHoraFim: "",
    observacao: "",
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert("Faça login primeiro.");
    setSaving(true);
    try {
      await AgendamentoService.criar({
        clienteId: (user as any).id ?? 0, 
        empresaId: parseInt(form.empresaId),
        profissionalId: parseInt(form.profissionalId),
        servicoId: parseInt(form.servicoId),
        dataHoraInicio: form.dataHoraInicio,
        dataHoraFim: form.dataHoraFim,
        observacao: form.observacao || undefined,
      } as any);
      alert("Agendado com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Falha ao agendar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Novo Agendamento</h1>
      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputLogin id="empresaId" label="Empresa Id" type="text" value={form.empresaId} action={(v) => setForm({ ...form, empresaId: v })}/>
          <InputLogin id="profissionalId" label="Profissional Id" type="text" value={form.profissionalId} action={(v) => setForm({ ...form, profissionalId: v })}/>
          <InputLogin id="servicoId" label="Serviço Id" type="text" value={form.servicoId} action={(v) => setForm({ ...form, servicoId: v })}/>
          <InputLogin id="inicio" label="Início (ISO)" type="text" placeholder="2025-11-10T14:00:00Z" value={form.dataHoraInicio} action={(v) => setForm({ ...form, dataHoraInicio: v })}/>
          <InputLogin id="fim" label="Fim (ISO)" type="text" placeholder="2025-11-10T15:00:00Z" value={form.dataHoraFim} action={(v) => setForm({ ...form, dataHoraFim: v })}/>
        </div>
        <InputLogin id="obs" label="Observação" type="text" value={form.observacao} action={(v) => setForm({ ...form, observacao: v })}/>
        <div className="flex gap-3">
          <Button label="Salvar" background="bg-primary" color="text-white" action={() => {}} />
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white" disabled={saving}>
            {saving ? "Salvando..." : "Agendar"}
          </button>
        </div>
      </form>
    </div>
  );
}
