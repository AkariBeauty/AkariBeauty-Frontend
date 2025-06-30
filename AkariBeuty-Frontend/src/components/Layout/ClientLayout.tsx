// src/components/Layout/ClientLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from './ClientHeader';
import ClientNavigation from './ClientNavigation';

const ClientLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50"> {/* RENOMEADO AQUI */}
      <ClientHeader />
      <main className="pb-20">
        <Outlet />
      </main>
      <ClientNavigation />
    </div>
  );
};

export default ClientLayout;