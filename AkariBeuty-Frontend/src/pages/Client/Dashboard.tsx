// src/pages/Client/Dashboard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Heart, Star, ArrowRight } from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext'; // Verifique o caminho aqui

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dados simulados - conectar com sua API
  const stats = [
    { label: 'Agendamentos', value: '12', icon: Calendar, color: 'from-bolt-primary-400 to-bolt-primary-600' }, // RENOMEADO AQUI
    { label: 'Horas de Beleza', value: '24h', icon: Clock, color: 'from-bolt-secondary-400 to-bolt-secondary-600' }, // RENOMEADO AQUI
    { label: 'Favoritos', value: '8', icon: Heart, color: 'from-bolt-accent-400 to-bolt-accent-600' }, // RENOMEADO AQUI
  ];

  const nextAppointments = [
    {
      id: '1',
      service: 'Corte + Escova',
      professional: 'Ana Silva',
      date: '2024-01-15',
      time: '14:00',
      status: 'Confirmado'
    },
    {
      id: '2',
      service: 'Manicure',
      professional: 'Carla Santos',
      date: '2024-01-18',
      time: '10:30',
      status: 'Aguardando'
    }
  ];

  const favoriteServices = [
    { name: 'Corte de Cabelo', count: 5, rating: 4.9 },
    { name: 'Manicure', count: 3, rating: 4.8 },
    { name: 'Escova', count: 4, rating: 4.7 },
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header de boas-vindas */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-bolt-neutral-900 mb-2"> {/* RENOMEADO AQUI */}
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-bolt-neutral-600">Como podemos cuidar da sua beleza hoje?</p> {/* RENOMEADO AQUI */}
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 card-hover shadow-sm">
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-bolt-neutral-900">{stat.value}</p> {/* RENOMEADO AQUI */}
            <p className="text-sm text-bolt-neutral-600">{stat.label}</p> {/* RENOMEADO AQUI */}
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/cliente/booking')}
          className="bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 text-white p-6 rounded-2xl card-hover shadow-lg" // RENOMEADO AQUI
        >
          <Calendar size={32} className="mb-3" />
          <h3 className="font-semibold text-lg mb-1">Novo Agendamento</h3>
          <p className="text-sm text-white/80">Agende seu próximo serviço</p>
        </button>

        <button
          onClick={() => navigate('/cliente/appointments')}
          className="bg-white p-6 rounded-2xl card-hover shadow-sm border border-bolt-neutral-100" // RENOMEADO AQUI
        >
          <Clock size={32} className="text-bolt-primary-500 mb-3" /> {/* RENOMEADO AQUI */}
          <h3 className="font-semibold text-lg mb-1 text-bolt-neutral-900">Meus Agendamentos</h3> {/* RENOMEADO AQUI */}
          <p className="text-sm text-bolt-neutral-600">Veja seus compromissos</p> {/* RENOMEADO AQUI */}
        </button>
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-bolt-neutral-900">Próximos Agendamentos</h2> {/* RENOMEADO AQUI */}
          <button
            onClick={() => navigate('/cliente/appointments')}
            className="text-bolt-primary-600 text-sm font-medium flex items-center" // RENOMEADO AQUI
          >
            Ver todos <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="space-y-3">
          {nextAppointments.length === 0 ? (
            <div className="text-center py-8 text-bolt-neutral-500"> {/* RENOMEADO AQUI */}
              <Calendar size={48} className="mx-auto mb-3 text-bolt-neutral-300" /> {/* RENOMEADO AQUI */}
              <p>Nenhum agendamento próximo</p>
              <button
                onClick={() => navigate('/booking')}
                className="text-bolt-primary-600 font-medium mt-2" // RENOMEADO AQUI
              >
                Fazer um agendamento
              </button>
            </div>
          ) : (
            nextAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
                <div className="w-12 h-12 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-xl flex items-center justify-center mr-4"> {/* RENOMEADO AQUI */}
                  <Calendar size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-bolt-neutral-900">{appointment.service}</h3> {/* RENOMEADO AQUI */}
                  <p className="text-sm text-bolt-neutral-600">{appointment.professional}</p> {/* RENOMEADO AQUI */}
                  <p className="text-sm text-bolt-neutral-500"> {/* RENOMEADO AQUI */}
                    {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Confirmado'
                    ? 'bg-bolt-green-100 text-bolt-green-800' // RENOMEADO AQUI
                    : 'bg-bolt-yellow-100 text-bolt-yellow-800' // RENOMEADO AQUI
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Serviços favoritos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Seus Favoritos</h2> {/* RENOMEADO AQUI */}

        <div className="space-y-3">
          {favoriteServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-bolt-neutral-50 rounded-xl"> {/* RENOMEADO AQUI */}
              <div>
                <h3 className="font-medium text-bolt-neutral-900">{service.name}</h3> {/* RENOMEADO AQUI */}
                <p className="text-sm text-bolt-neutral-600">{service.count} vezes</p> {/* RENOMEADO AQUI */}
              </div>
              <div className="flex items-center">
                <Star size={16} className="text-yellow-500 mr-1" weight="fill" />
                <span className="text-sm font-medium text-bolt-neutral-700">{service.rating}</span> {/* RENOMEADO AQUI */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;