// src/pages/Client/Appointments.tsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  MagnifyingGlass,
  FunnelSimple,
  Clock,
  User,
  Scissors,
  Pencil,
  Trash,
} from '@phosphor-icons/react';
import { AppointmentStatus, NotificationProps } from '../../types';
import Modal from '../../components/UI/Modal';
import Notification from '../../components/UI/Notification';
import { clienteService, ClienteAppointment } from '../../services/clienteService';

const Appointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<ClienteAppointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [appointments, setAppointments] = useState<ClienteAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<NotificationProps>({ 
    isVisible: false, 
    type: 'success', 
    message: '', 
    onClose: () => {} 
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const appointmentsData = await clienteService.getAppointments();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Erro ao carregar agendamentos',
        onClose: () => setNotification({ ...notification, isVisible: false })
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.professional.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADO':
        return 'bg-bolt-green-100 text-bolt-green-800';
      case 'AGUARDANDO':
        return 'bg-bolt-yellow-100 text-bolt-yellow-800';
      case 'CANCELADO':
        return 'bg-bolt-red-100 text-bolt-red-800';
      default:
        return 'bg-bolt-neutral-100 text-bolt-neutral-800';
    }
  };

  const handleViewDetails = (appointment: ClienteAppointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await clienteService.cancelAppointment(appointmentId);
      
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Agendamento cancelado com sucesso',
        onClose: () => setNotification({ ...notification, isVisible: false })
      });
      
      // Recarregar lista
      loadAppointments();
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Erro ao cancelar agendamento',
        onClose: () => setNotification({ ...notification, isVisible: false })
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bolt-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-bolt-neutral-900">Meus Agendamentos</h1>
        <button className="bg-bolt-primary-500 text-white px-4 py-2 rounded-lg hover:bg-bolt-primary-600 transition-colors">
          Novo Agendamento
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por serviço ou profissional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-bolt-neutral-300 rounded-lg focus:ring-2 focus:ring-bolt-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FunnelSimple size={20} className="text-bolt-neutral-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
            className="px-3 py-2 border border-bolt-neutral-300 rounded-lg focus:ring-2 focus:ring-bolt-primary-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value={AppointmentStatus.CONFIRMADO}>Confirmado</option>
            <option value={AppointmentStatus.AGUARDANDO}>Aguardando</option>
            <option value={AppointmentStatus.CANCELADO}>Cancelado</option>
          </select>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-bolt-neutral-300" />
            <h3 className="text-lg font-medium text-bolt-neutral-600 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento ainda'}
            </h3>
            <p className="text-bolt-neutral-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Faça seu primeiro agendamento e comece a cuidar da sua beleza!'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button className="bg-bolt-primary-500 text-white px-6 py-2 rounded-lg hover:bg-bolt-primary-600 transition-colors">
                Fazer Agendamento
              </button>
            )}
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-xl p-6 shadow-sm border border-bolt-neutral-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-xl flex items-center justify-center">
                      <Scissors size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-bolt-neutral-900">
                        {appointment.service.name}
                      </h3>
                      <p className="text-sm text-bolt-neutral-600">
                        {appointment.service.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-bolt-neutral-400" />
                      <span className="text-sm text-bolt-neutral-600">
                        {format(new Date(appointment.date), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-bolt-neutral-400" />
                      <span className="text-sm text-bolt-neutral-600">
                        {appointment.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-bolt-neutral-400" />
                      <span className="text-sm text-bolt-neutral-600">
                        {appointment.professional.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="p-2 text-bolt-primary-600 hover:bg-bolt-primary-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Pencil size={16} />
                      </button>
                      {appointment.status === AppointmentStatus.AGUARDANDO && (
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="p-2 text-bolt-red-600 hover:bg-bolt-red-50 rounded-lg transition-colors"
                          title="Cancelar agendamento"
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Detalhes do Agendamento"
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-bolt-neutral-900">Serviço</h3>
              <p className="text-bolt-neutral-600">{selectedAppointment.service.name}</p>
              <p className="text-sm text-bolt-neutral-500">{selectedAppointment.service.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-bolt-neutral-900">Profissional</h3>
              <p className="text-bolt-neutral-600">{selectedAppointment.professional.name}</p>
              <p className="text-sm text-bolt-neutral-500">
                Especialidades: {selectedAppointment.professional.specialties.join(', ')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-bolt-neutral-900">Data e Hora</h3>
              <p className="text-bolt-neutral-600">
                {format(new Date(selectedAppointment.date), 'dd/MM/yyyy')} às {selectedAppointment.time}
              </p>
            </div>
            
            {selectedAppointment.notes && (
              <div>
                <h3 className="font-semibold text-bolt-neutral-900">Observações</h3>
                <p className="text-bolt-neutral-600">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Notificação */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        message={notification.message}
        onClose={notification.onClose}
      />
    </div>
  );
};

export default Appointments;