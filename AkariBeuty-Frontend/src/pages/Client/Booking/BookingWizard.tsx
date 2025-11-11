import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ClienteService } from "../../../services/clienteService";



async function handleConfirm() {
  try {
    setIsConfirming(true);

    await ClienteService.createAppointmentFromUI({
      clientId: String(user?.id ?? ""),                 // mantenha conforme seu AuthContext
      serviceId: String(selectedService?.id ?? ""),     // seus estados atuais
      professionalId: String(selectedProfessional?.id ?? ""),
      date,                                             // "YYYY-MM-DD"
      time,                                             // "HH:mm"
      notes,                                            // opcional
    });

    toast.success("Agendamento criado com sucesso!");
    navigate("/cliente/agendamentos");
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    toast.error("Não foi possível criar o agendamento.");
  } finally {
    setIsConfirming(false);
  }
}
