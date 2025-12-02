import { Navigate, Route, Routes } from "react-router-dom";

// Layout/Proteção (ajuste os paths se necessário no seu projeto)
import ProtectedRoute from "./ProtectedRoute";
import ClientLayout from "./components/Layout/ClientLayout";
import ProfessionalLayout from "./components/Layout/ProfessionalLayout";

// Páginas (ajuste os paths se o seu projeto usar outros nomes/pastas)
import Dashboard from "./pages/Client/Dashboard";
import Profile from "./pages/Client/Profile";
import BookingWizard from "./pages/Client/Booking/BookingWizard";
import Login from "./pages/Login";
import ProfessionalDashboard from "./pages/Professional/Dashboard";
import ProfessionalAgenda from "./pages/Professional/Agenda";
import ProfessionalProfile from "./pages/Professional/Profile";
import ProfessionalAppointmentDetail from "./pages/Professional/AppointmentDetail";

// Clientes
import ClientesList from "./pages/Client/ClientList";
import ClienteEdit from "./pages/Client/ClientEdit";

// Agendamentos
import MeusAgendamentos from "./pages/Agendamentos/MeusAgendamentos";
import NovoAgendamento from "./pages/Agendamentos/NovoAgendamento";

export default function Routers() {
  return (
    <Routes>
      {/* Login público */}
      <Route path="/login" element={<Login />} />

      {/* Redireciona raiz para a área do cliente */}
      <Route path="/" element={<Navigate to="/cliente" replace />} />

      {/* Área autenticada do cliente */}
      <Route
        path="/cliente"
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        {/* IMPORTANTE: filhos sem barra inicial (rotas relativas) */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="booking" element={<BookingWizard />} />

        {/* Clientes */}
        <Route path="clientes" element={<ClientesList />} />
        <Route path="clientes/editar/:id" element={<ClienteEdit />} />

        {/* Agendamentos */}
        <Route path="agendamentos" element={<MeusAgendamentos />} />
        <Route path="agendamentos/novo" element={<NovoAgendamento />} />
      </Route>

      <Route
        path="/profissional"
        element={
          <ProtectedRoute allowedRoles={["Profissional"]}>
            <ProfessionalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ProfessionalDashboard />} />
        <Route path="agenda" element={<ProfessionalAgenda />} />
        <Route path="agendamentos/:id" element={<ProfessionalAppointmentDetail />} />
        <Route path="perfil" element={<ProfessionalProfile />} />
      </Route>

      {/* 404 simples (opcional) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
