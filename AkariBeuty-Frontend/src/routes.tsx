// src/routes.tsx
import React from 'react'; // Certifique-se de que o React está importado
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// **SUAS IMPORTAÇÕES ORIGINAIS (MANTIDAS)**
import Home from "./pages/Home";
import Login from "./pages/Login"; // Seu componente Login original, mantido

// **NOVAS IMPORTAÇÕES DO MÓDULO CLIENTE (ACRESCENTADAS)**
import { AuthProvider, useAuth } from './contexts/AuthContext'; // O provedor de autenticação
import ClientLayout from './components/Layout/ClientLayout'; // O layout principal para o cliente
import BoltLogin from './pages/Auth/LoginClient'; // O componente de Login do Cliente
import Dashboard from './pages/Client/Dashboard';
import BookingWizard from './pages/Client/Booking/BookingWizard';
import Appointments from './pages/Client/Appointments';
import Profile from './pages/Client/Profile';
import LoadingSpinner from './components/UI/LoadingSpinner'; // O spinner para rotas protegidas/públicas

// Componente auxiliar para rotas protegidas (para as novas rotas do cliente)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login-bolt" replace />; // Redireciona para o login do Bolt.new
};

// Componente auxiliar para rotas públicas (do Bolt.new, que precisam de um login específico)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};


export default function Routers() { // Mantido o nome original "Routers"
  return (
    <AuthProvider> {/* O provedor de autenticação deve envolver todas as rotas que o utilizam */}
      <Router>
        <Routes>
          {/* **SUAS ROTAS ORIGINAIS (MANTIDAS INTACTAS)** */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* **NOVAS ROTAS DO MÓDULO CLIENTE (ACRESCENTADAS)** */}

          {/* Rota de Login para o módulo cliente (com um novo path para não conflitar com seu /login original) */}
          <Route
            path="/login-bolt" // Novo PATH para o Login do Bolt.new
            element={
              <PublicRoute>
                <BoltLogin /> {/* Usando o Login do Bolt.new */}
              </PublicRoute>
            }
          />

          {/* Rotas Protegidas do Módulo Cliente (exigem autenticação do AuthProvider) */}
          {/* Note que o path aqui é "/cliente", você pode mudar se quiser que seja direto na raiz após o login */}
          <Route
            path="/" // Esta rota agora será o ponto de entrada para o ClientLayout após autenticação
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            {/* Página inicial do cliente após o login: redireciona para /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} /> {/* Agora o index vai para /dashboard se logado */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="booking" element={<BookingWizard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Rota Coringa para qualquer caminho não correspondido - pode ser ajustada se necessário */}
          {/* Ela vai redirecionar para /login-bolt se não houver rota específica e o usuário não estiver logado */}
          <Route path="*" element={<Navigate to="/login-bolt" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}