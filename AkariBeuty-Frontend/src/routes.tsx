// src/routes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// **SUAS IMPORTAÇÕES ORIGINAIS (MANTIDAS)**
import Home from "./pages/Home";
import Login from "./pages/Login";

// **NOVAS IMPORTAÇÕES DO MÓDULO CLIENTE (ACRESCENTADAS)**
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ClientLayout from './components/Layout/ClientLayout';
import Dashboard from './pages/Client/Dashboard';
import BookingWizard from './pages/Client/Booking/BookingWizard';
import Appointments from './pages/Client/Appointments';
import Profile from './pages/Client/Profile';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Componente auxiliar para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login-bolt" replace />;
};

// Componente auxiliar para rotas públicas
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

export default function Routers() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* **ROTAS PÚBLICAS (SEM AUTENTICAÇÃO)** */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-bolt" element={<PublicRoute><Login /></PublicRoute>} />

          {/* **ROTAS PROTEGIDAS (COM AUTENTICAÇÃO)** */}
          <Route path="/cliente" element={<ProtectedRoute><ClientLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/cliente/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="booking" element={<BookingWizard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* **ROTA CORINGA - REDIRECIONA PARA HOME** */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}