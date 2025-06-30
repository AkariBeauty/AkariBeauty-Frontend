// src/pages/Client/Appointments.tsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  MagnifyingGlass,
  FunnelSimple,
  // DotsThreeVertical, // REMOVIDO: Não é usado no componente
  Clock,
  User,
  Scissors,
  // X, // REMOVIDO: Não é usado no componente (a notificação tem seu próprio XCircle)
  Pencil,
  Trash,
  //XCircle // Adicionado: para o botão de fechar notificação, se for o caso
} from '@phosphor-icons/react';
import { Appointment, AppointmentStatus, NotificationProps } from '../../types'; // Importe do seu arquivo de types
import Modal from '../../components/UI/Modal';
import Notification from '../../components/UI/Notification';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // CORRIGIDO AQUI: Usando isVisible e o tipo NotificationProps completo
  const [notification, setNotification] = useState<NotificationProps>({ isVisible: false, type: 'success', message: '', onClose: () => {} });

  // Dados simulados - conectar com sua API
  const appointments: Appointment[] = [
    {
      id: '1',
      serviceId: '1',
      service: { id: '1', name: 'Corte + Escova', description: 'Corte e escova', duration: 90, price: 120, category: 'Cabelo' },
      professionalId: '1',
      professional: { id: '1', name: 'Ana Silva', specialties: ['Corte', 'Escova'], rating: 4.9 },
      clientId: '1',
      date: '2024-01-15',
      time: '14:00',
      status: AppointmentStatus.CONFIRMADO,
      notes: 'Corte em camadas',
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      serviceId: '7',
      service: { id: '7', name: 'Manicure', description: 'Cuidado das unhas', duration: 60, price: 40, category: 'Unhas' },
      professionalId: '2',
      professional: { id: '2', name: 'Carla Santos', specialties: ['Manicure'], rating: 4.8 },
      clientId: '1',
      date: '2024-01-18',
      time: '10:30',
      status: AppointmentStatus.AGUARDANDO,
      createdAt: '2024-01-12T15:30:00Z'
    },
    {
      id: '3',
      serviceId: '4',
      service: { id: '4', name: 'Coloração', description: 'Mudança de cor', duration: 180, price: 200, category: 'Coloração' },
      professionalId: '1',
      professional: { id: '1', name: 'Ana Silva', specialties: ['Coloração'], rating: 4.9 },
      clientId: '1',
      date: '2024-01-08',
      time: '09:00',
      status: AppointmentStatus.CANCELADO,
      notes: 'Cliente cancelou por motivos pessoais',
      createdAt: '2024-01-05T14:20:00Z'
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.professional.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMADO:
        return 'bg-bolt-green-100 text-bolt-green-800';
      case AppointmentStatus.AGUARDANDO:
        return 'bg-bolt-yellow-100 text-bolt-yellow-800';
      case AppointmentStatus.CANCELADO:
        return 'bg-bolt-red-100 text-bolt-red-800';
      default:
        return 'bg-bolt-neutral-100 text-bolt-neutral-800';
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    // TODO: Conectar com sua API C#
    console.log('Cancelando agendamento:', appointmentId); // 'appointmentId' agora está sendo usado
    // await fetch(`https://sua-api.com/api/appointments/${appointmentId}/cancel`, {
    //   method: 'PATCH'
    // });
    setNotification({
      isVisible: true, // CORRIGIDO AQUI
      type: 'success',
      message: 'Agendamento cancelado com sucesso!',
      onClose: () => setNotification(prev => ({ ...prev, isVisible: false })) // Adicionado onClose
    });
    setShowDetailsModal(false);
  };

  const handleEditAppointment = (appointmentId: string) => {
    // TODO: Navegar para tela de edição
    console.log('Editar agendamento:', appointmentId); // 'appointmentId' agora está sendo usado
    setNotification({
      isVisible: true, // CORRIGIDO AQUI
      type: 'info',
      message: 'Funcionalidade de edição em desenvolvimento',
      onClose: () => setNotification(prev => ({ ...prev, isVisible: false })) // Adicionado onClose
    });
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible} // CORRIGIDO AQUI
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))} // CORRIGIDO AQUI
      />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Meus Agendamentos</h1>
        <p className="text-bolt-neutral-600">Gerencie seus compromissos de beleza</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        {/* Busca */}
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por serviço ou profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-bolt-neutral-300 rounded-xl input-focus"
          />
        </div>

        {/* Filtro por status */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <FunnelSimple size={20} className="text-bolt-neutral-600 flex-shrink-0" />
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'Todos' },
              { value: AppointmentStatus.CONFIRMADO, label: 'Confirmados' },
              { value: AppointmentStatus.AGUARDANDO, label: 'Aguardando' },
              { value: AppointmentStatus.CANCELADO, label: 'Cancelados' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as AppointmentStatus | 'all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  statusFilter === filter.value
                    ? 'bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500 text-white'
                    : 'bg-bolt-neutral-100 text-bolt-neutral-600 hover:bg-bolt-neutral-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de agendamentos */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-bolt-neutral-300" />
            <h3 className="text-lg font-medium text-bolt-neutral-900 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-bolt-neutral-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Você ainda não tem agendamentos'
              }
            </p>
            <button
              onClick={() => window.location.href = '/booking'}
              className="btn-primary text-white px-6 py-3 rounded-xl font-medium"
            >
              Fazer um agendamento
            </button>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-2xl p-6 shadow-sm card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-bolt-neutral-900">{appointment.service.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-bolt-neutral-600">
                      <User size={16} className="mr-2 text-bolt-primary-500" />
                      {appointment.professional.name}
                    </div>
                    <div className="flex items-center text-sm text-bolt-neutral-600">
                      <Calendar size={16} className="mr-2 text-bolt-primary-500" />
                      {format(new Date(appointment.date), "d 'de' MMM")}
                    </div>
                    <div className="flex items-center text-sm text-bolt-neutral-600">
                      <Clock size={16} className="mr-2 text-bolt-primary-500" />
                      {appointment.time} ({appointment.service.duration}min)
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-bolt-primary-600">
                      R$ {appointment.service.price}
                    </div>
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="text-bolt-primary-600 text-sm font-medium hover:text-bolt-primary-700"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de detalhes */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes do Agendamento"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Informações principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-bolt-primary-400 to-bolt-primary-600 rounded-xl flex items-center justify-center mr-4">
                    <Scissors size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-bolt-neutral-900">{selectedAppointment.service.name}</h4>
                    <p className="text-sm text-bolt-neutral-600">{selectedAppointment.service.description}</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-bolt-secondary-400 to-bolt-secondary-600 rounded-xl flex items-center justify-center mr-4">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-bolt-neutral-900">{selectedAppointment.professional.name}</h4>
                    <p className="text-sm text-bolt-neutral-600">Avaliação: ⭐ {selectedAppointment.professional.rating}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-bolt-accent-400 to-bolt-accent-600 rounded-xl flex items-center justify-center mr-4">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-bolt-neutral-900">
                      {format(new Date(selectedAppointment.date), "EEEE, d 'de' MMMM")}
                    </h4>
                    <p className="text-sm text-bolt-neutral-600">Data do agendamento</p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-bolt-neutral-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-bolt-neutral-900">{selectedAppointment.time}</h4>
                    <p className="text-sm text-bolt-neutral-600">Duração: {selectedAppointment.service.duration} minutos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status e valor */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50 rounded-xl">
              <div>
                <h4 className="font-medium text-bolt-neutral-900">Status do agendamento</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(selectedAppointment.status)}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              <div className="text-right">
                <h4 className="font-medium text-bolt-neutral-900">Valor</h4>
                <p className="text-2xl font-bold text-bolt-primary-600">R$ {selectedAppointment.service.price}</p>
              </div>
            </div>

            {/* Observações */}
            {selectedAppointment.notes && (
              <div className="p-4 bg-bolt-neutral-50 rounded-xl">
                <h4 className="font-medium text-bolt-neutral-900 mb-2">Observações</h4>
                <p className="text-sm text-bolt-neutral-600">{selectedAppointment.notes}</p>
              </div>
            )}

            {/* Ações */}
            {selectedAppointment.status !== AppointmentStatus.CANCELADO && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditAppointment(selectedAppointment.id)}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-bolt-neutral-100 text-bolt-neutral-700 rounded-xl font-medium hover:bg-bolt-neutral-200 transition-colors"
                >
                  <Pencil size={16} className="mr-2" />
                  Editar
                </button>
                <button
                  onClick={() => handleCancelAppointment(selectedAppointment.id)}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-bolt-red-50 text-bolt-red-700 rounded-xl font-medium hover:bg-bolt-red-100 transition-colors"
                >
                  <Trash size={16} className="mr-2" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Appointments;