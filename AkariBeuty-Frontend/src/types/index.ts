// Do código fornecido do Bolt.new:
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  category: string;
  image?: string;
}

export interface Professional {
  id: string;
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
  id: string;
  serviceId: string;
  service: Service;
  professionalId: string;
  professional: Professional;
  clientId: string;
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
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}