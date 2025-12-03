// src/components/Layout/ClientNavigation.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { House, Calendar, ClockCounterClockwise, User } from '@phosphor-icons/react';

const ClientNavigation: React.FC = () => {
  const navItems = [
    { icon: House, label: 'Início', path: '/cliente/dashboard' },
    { icon: Calendar, label: 'Agendar', path: '/cliente/booking' },
    { icon: ClockCounterClockwise, label: 'Agendamentos', path: '/cliente/agendamentos' },
    { icon: User, label: 'Perfil', path: '/cliente/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-bolt-primary-100 px-4 py-2 z-50"> {/* RENOMEADO AQUI */}
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white shadow-lg' // RENOMEADO AQUI
                  : 'text-bolt-neutral-600 hover:bg-bolt-primary-50' // RENOMEADO AQUI
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} weight={isActive ? 'fill' : 'regular'} />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default ClientNavigation;