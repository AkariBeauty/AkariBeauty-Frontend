import { Navigate, Route, Routes } from "react-router-dom";

// Layout/Proteção (ajuste os paths se necessário no seu projeto)
import ProtectedRoute from "./ProtectedRoute";
import ClientLayout from "./components/Layout/ClientLayout";
import ProfessionalLayout from "./components/Layout/ProfessionalLayout";
import CompanyLayout from "./components/Layout/CompanyLayout";

// Páginas (ajuste os paths se o seu projeto usar outros nomes/pastas)
import Dashboard from "./pages/Client/Dashboard";
import Profile from "./pages/Client/Profile";
import BookingWizard from "./pages/Client/Booking/BookingWizard";
import Login from "./pages/Login";
import ProfessionalDashboard from "./pages/Professional/Dashboard";
import ProfessionalAgenda from "./pages/Professional/Agenda";
import ProfessionalProfile from "./pages/Professional/Profile";
import ProfessionalAppointmentDetail from "./pages/Professional/AppointmentDetail";
import CompanyDashboardPage from "./pages/Company/Dashboard";
import CompanyOverviewPage from "./pages/Company/Overview";
import CompanyProfessionalsPage from "./pages/Company/Professionals";
import CompanyServicesPage from "./pages/Company/ServicesCatalog";
import CompanyAgendaPage from "./pages/Company/Agenda";
import CompanyClientsPage from "./pages/Company/Clients";
import CompanyFinancePage from "./pages/Company/Finance";
import CompanySettingsPage from "./pages/Company/Settings";
import CompanyCommunicationPage from "./pages/Company/Communication";
import CompanyAuditPage from "./pages/Company/Audit";

// Clientes
import ClientesList from "./pages/Client/ClientList";
import ClienteEdit from "./pages/Client/ClientEdit";

// Agendamentos
import MeusAgendamentos from "./pages/Agendamentos/MeusAgendamentos";
import NovoAgendamento from "./pages/Agendamentos/NovoAgendamento";

export default function Routers() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/cliente" replace />} />

            <Route
                path="/cliente"
                element={
                    <ProtectedRoute>
                        <ClientLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="booking" element={<BookingWizard />} />
                <Route path="clientes" element={<ClientesList />} />
                <Route path="clientes/editar/:id" element={<ClienteEdit />} />

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

            <Route
                path="/empresa"
                element={
                    <ProtectedRoute allowedRoles={["Empresa", "ADMIN", "RECEPCIONISTA"]}>
                        <CompanyLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="resumo" replace />} />
                <Route path="resumo" element={<CompanyOverviewPage />} />
                <Route path="dashboard" element={<CompanyDashboardPage />} />
                <Route path="profissionais" element={<CompanyProfessionalsPage />} />
                <Route path="servicos" element={<CompanyServicesPage />} />
                <Route path="agenda" element={<CompanyAgendaPage />} />
                <Route path="clientes" element={<CompanyClientsPage />} />
                <Route path="financeiro" element={<CompanyFinancePage />} />
                <Route path="configuracoes" element={<CompanySettingsPage />} />
                <Route path="comunicacao" element={<CompanyCommunicationPage />} />
                <Route path="auditoria" element={<CompanyAuditPage />} />
            </Route>

            {/* 404 simples (opcional) */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
