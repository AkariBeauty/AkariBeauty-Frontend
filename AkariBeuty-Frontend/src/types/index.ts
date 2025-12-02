// Do código fornecido do Bolt.new:
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  clienteId?: string;
  empresaId?: string;
  avatar?: string;
  token?: string; // Adicionar o campo token
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  category: string;
  image?: string;
}

export interface Professional {
  id: number;
  name: string;
  serviceIds?: number[];
  specialties: string[];
  rating: number;
  avatar?: string;
  bio?: string;
}

export enum AppointmentStatus {
  AGUARDANDO = 'Aguardando',
  CONFIRMADO = 'Confirmado',
  CANCELADO = 'Cancelado'
}

export interface Appointment {
  id: number;
  serviceId: number;
  service: Service;
  professionalId: number;
  professional: Professional;
  clientId: number;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingData {
  service?: Service;
  professional?: Professional;
  date?: string;
  time?: string;
  notes?: string;
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export type ClienteCadastroResponse = Service | Professional | string[];

export interface ProfessionalAgendaItem {
  id: number;
  dataHora: string;
  clienteNome: string;
  clienteTelefone?: string;
  servicoPrincipal: string;
  status: string;
  statusCodigo: number;
  valor: number;
  observacao?: string;
  podeConfirmar: boolean;
  podeConcluir: boolean;
}

export interface ProfessionalAgendaDay {
  data: string;
  agendamentos: ProfessionalAgendaItem[];
}

export interface ProfessionalDashboard {
  nome: string;
  pendentesHoje: number;
  confirmadosHoje: number;
  totalSemana: number;
  canceladosSemana: number;
  proximos: ProfessionalAgendaItem[];
}

export interface ProfessionalProfile {
  id: number;
  nome: string;
  login: string;
  telefone?: string;
  empresaId: number;
  empresaNome?: string;
  status: string;
  statusCodigo: number;
}

