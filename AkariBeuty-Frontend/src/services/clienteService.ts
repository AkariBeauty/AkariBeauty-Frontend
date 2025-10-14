import api from './api';
import { Service, Professional } from '../types';

export interface ClienteStats {
  totalAgendamentos: number;
  totalHoras: number;
  totalFavoritos: number;
}

export interface ClienteAppointment {
  id: number;
  serviceId: number;
  service: {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
  };
  professionalId: number;
  professional: {
    id: number;
    name: string;
    specialties: string[];
    rating: number;
  };
  clientId: number;
  date: string;
  time: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface ClienteFavoriteService {
  name: string;
  count: number;
  rating: number;
}

export interface ClienteProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  totalAppointments: number;
  favoriteServices: string[];
  averageRating: number;
}

export const clienteService = {
  // Dashboard
  async getDashboardStats(): Promise<ClienteStats> {
    try {
      const response = await api.get('/cliente/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  },

  // Agendamentos
  async getAppointments(): Promise<ClienteAppointment[]> {
    try {
      const response = await api.get('/cliente/agendamentos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  async getUpcomingAppointments(): Promise<ClienteAppointment[]> {
    try {
      const response = await api.get('/cliente/agendamentos/proximos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      throw error;
    }
  },

  async cancelAppointment(appointmentId: number): Promise<void> {
    try {
      await api.patch(`/agendamento/${appointmentId}/cancelar`);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      throw error;
    }
  },

  // Serviços Favoritos
  async getFavoriteServices(): Promise<ClienteFavoriteService[]> {
    try {
      const response = await api.get('/cliente/servicos/favoritos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços favoritos:', error);
      throw error;
    }
  },

  // Perfil
  async getProfileStats(): Promise<ClienteProfile> {
    try {
      const response = await api.get('/cliente/perfil/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do perfil:', error);
      throw error;
    }
  },

  async updateProfile(profileData: Partial<ClienteProfile>): Promise<void> {
    try {
      await api.put('/cliente/perfil', profileData);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      await api.put('/cliente/perfil/senha', passwordData);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  // Agendamento de Novos Serviços
  async getAvailableServices(): Promise<Service[]> {
    try {
      const response = await api.get('/cliente/servicos/disponiveis');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar serviços disponíveis:', error);
      throw error;
    }
  },

  async getAvailableProfessionals(serviceId: number): Promise<Professional[]> {
    try {
      const response = await api.get(`/cliente/servicos/${serviceId}/profissionais`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar profissionais disponíveis:', error);
      throw error;
    }
  },

  async getAvailableSlots(serviceId: number, professionalId: number, date: string): Promise<string[]> {
    try {
      const response = await api.get(`/cliente/servicos/${serviceId}/profissionais/${professionalId}/horarios`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      throw error;
    }
  },

  async createAppointment(appointmentData: {
    serviceId: number;
    professionalId: number;
    date: string;
    time: string;
    notes?: string;
  }): Promise<void> {
    try {
      // Converter os dados para o formato esperado pelo backend
      const backendData = {
        ServiceId: appointmentData.serviceId,
        ProfessionalId: appointmentData.professionalId,
        Date: appointmentData.date,
        Time: appointmentData.time,
        Notes: appointmentData.notes
      };
      await api.post('/agendamento', backendData);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  }
};
