import api from './api';

export interface AvailabilityDay {
  date: string; // ISO date yyyy-MM-dd
  slots: string[];
}

export interface AvailabilityParams {
  servicoId: number;
  profissionalId?: number;
  startDate?: string;
  endDate?: string;
}

export const availabilityService = {
  async fetch(params: AvailabilityParams): Promise<AvailabilityDay[]> {
    const query = new URLSearchParams();
    query.set('servicoId', params.servicoId.toString());
    if (params.profissionalId) {
      query.set('profissionalId', params.profissionalId.toString());
    }
    if (params.startDate) {
      query.set('inicio', params.startDate);
    }
    if (params.endDate) {
      query.set('fim', params.endDate);
    }

    const response = await api.get(`/agendamento/disponibilidade?${query.toString()}`);
    return response.data as AvailabilityDay[];
  },
};
