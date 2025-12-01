// src/components/Layout/ClientHeader.tsx
import React from 'react';
import { Bell, User } from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext';

const ClientHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-bolt-primary-100 px-4 py-4 sticky top-0 z-40"> {/* RENOMEADO AQUI */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-bolt-primary-600 to-bolt-secondary-600 bg-clip-text text-transparent"> {/* RENOMEADO AQUI */}
              AkariBeauty
            </h1>
            <p className="text-xs text-bolt-neutral-500">Olá, {user?.name?.split(' ')[0] || 'Cliente'}!</p> {/* RENOMEADO AQUI */}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-xl hover:bg-bolt-primary-50 transition-colors relative"> {/* RENOMEADO AQUI */}
            <Bell size={20} className="text-bolt-neutral-600" /> {/* RENOMEADO AQUI */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-bolt-primary-500 rounded-full"></span> {/* RENOMEADO AQUI */}
          </button>

          <div className="w-8 h-8 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-full flex items-center justify-center"> {/* RENOMEADO AQUI */}
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;