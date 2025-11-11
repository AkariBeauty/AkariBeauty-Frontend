// Do código fornecido do Bolt.new:
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
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

