import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { AgendamentoService } from "../../../services/agendamentoService";
import ServiceSelection from "./steps/ServiceSelection";
import ProfessionalSelection from "./steps/ProfessionalSelection";
import DateTimeSelection from "./steps/DateTimeSelection";
import BookingConfirmation from "./steps/BookingConfirmation";
import type { BookingData, Professional, Service } from "../../../types";
import { showError, showSuccess } from "../../../utils/toast";

const steps = ["Serviço", "Profissional", "Data e horário", "Confirmação"] as const;

export default function BookingWizard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const clienteId = useMemo(() => {
    if (!user?.id) return 0;
    const parsed = Number(user.id);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [user]);

  const bookingData: BookingData = {
    service: selectedService ?? undefined,
    professional: selectedProfessional ?? undefined,
    date: date || undefined,
    time: time || undefined,
    notes: undefined,
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedProfessional(null);
    goNext();
  };

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional);
    goNext();
  };

  const handleDateTimeSelect = (selectedDate: string, selectedTime: string) => {
    setDate(selectedDate);
    setTime(selectedTime);
    goNext();
  };

  const handleConfirm = async () => {
    if (!clienteId) {
      showError("Não foi possível identificar o cliente logado. Faça login novamente.");
      logout();
      navigate("/login", { replace: true });
      return;
    }

    if (!selectedService || !date || !time) {
      showError("Informe serviço, profissional, data e horário antes de confirmar.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}:00`);
    if (Number.isNaN(selectedDateTime.getTime()) || selectedDateTime <= new Date()) {
      showError("Selecione um horário futuro para concluir o agendamento.");
      return;
    }

    const iso = selectedDateTime.toISOString();

    try {
      await AgendamentoService.criar({
        clienteId,
        servicoId: Number(selectedService.id),
        dataHora: iso,
        observacao: undefined,
      });

      showSuccess("Agendamento criado com sucesso!");
      navigate("/cliente/agendamentos");
    } catch (error) {
      console.error("Erro ao criar agendamento", error);

      const message =
        (error as { response?: { data?: unknown } })?.response?.data ??
        "Não foi possível criar o agendamento.";
      showError(typeof message === "string" ? message : "Não foi possível criar o agendamento.");
    }
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return <ServiceSelection onServiceSelect={handleServiceSelect} />;
      case 1:
        if (!selectedService) return null;
        return (
          <ProfessionalSelection
            selectedService={selectedService}
            onProfessionalSelect={handleProfessionalSelect}
          />
        );
      case 2:
        if (!selectedService || !selectedProfessional) return null;
        return (
          <DateTimeSelection
            selectedService={selectedService}
            selectedProfessional={selectedProfessional}
            onDateTimeSelect={handleDateTimeSelect}
          />
        );
      case 3:
        return <BookingConfirmation bookingData={bookingData} onConfirm={handleConfirm} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {steps.map((label, index) => (
          <span key={label} className={index === stepIndex ? "font-semibold text-primary" : "opacity-70"}>
            {index + 1}. {label}
            {index < steps.length - 1 ? " /" : ""}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[420px]">
        {renderStep()}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40"
        >
          Voltar
        </button>

        {stepIndex < 3 && (
          <button
            type="button"
            onClick={goNext}
            disabled={(stepIndex === 0 && !selectedService) || (stepIndex === 1 && !selectedProfessional) || (stepIndex === 2 && (!date || !time))}
            className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
          >
            Avançar
          </button>
        )}
      </div>
    </div>
  );
}
