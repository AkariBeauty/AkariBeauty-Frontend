/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseService from "./Generic/BaseService";

/** =========================
 *  Tipos que a sua UI usa
 *  ========================= */
export type Cliente = {
  id: number | string;
  name?: string;
  nome?: string;
  document?: string;
  cpf?: string;
  email?: string;
  login?: string;
  senha?: string;
  phone?: string;
  telefone?: string;
  uf?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: number;
  active?: boolean;
};

export type ClienteAppointment = {
  id: number | string;
  clientId: number | string;
  title: string;
  notes?: string | null;
  startAt: string; // ISO-8601
  endAt: string;   // ISO-8601
  status: "SCHEDULED" | "CANCELED" | "DONE" | string;
};

export type ClienteStats = {
  totalAppointments?: number; // back v1
  upcomingCount?: number;
  canceledCount?: number;
  doneCount?: number;
  // variantes para manter compatibilidade com sua UI:
  totalAgendamentos?: number; // UI mostra este nome
  totalHoras?: number;
  totalFavoritos?: number;
};

export type ClienteFavorite = {
  name: string;
  count: number;
  rating?: number;
};

/** Perfil “básico” (dados de cadastro) */
export type ClienteProfile = {
  id: number;
  nome: string;
  cpf?: string;
  uf?: string;
  cidade?: string;
  bairro?: string;
  rua?: string;
  numero?: number;
  email: string;
  telefone: string;
  avatarUrl?: string | null;
};

/** Visão “overview” exibida na tela de Perfil */
export type ClienteProfileStats = {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberSince: string;         // ISO-8601
  totalAppointments: number;
  favoriteServices: string[];
  averageRating: number;
};

/** =========================
 *  Helpers com Fallback
 *  ========================= */

// tenta GET em uma lista de caminhos e retorna o primeiro 2xx
async function getWithFallback<T>(
  paths: string[],
  params?: Record<string, unknown>
): Promise<T> {
  let lastErr: any;
  for (const p of paths) {
    try {
      const res = await new BaseService({ method: "get", url: p, params }).request<T>();
      return res;
    } catch (e: any) {
      // 404 → tenta o próximo; 400/500 guardamos e seguimos
      lastErr = e;
    }
  }
  throw lastErr;
}

// tenta POST/PUT/PATCH/DELETE em uma lista de candidatos (endpoint,payload)
type CandidateReq = { url: string; data?: unknown; method?: "post"|"put"|"patch"|"delete" };
async function mutateWithFallback<T = any>(candidates: CandidateReq[]): Promise<T> {
  let lastErr: any;
  for (const c of candidates) {
    try {
      const res = await new BaseService({
        method: c.method ?? "post",
        url: c.url,
        data: c.data
      }).request<T>();
      return res;
    } catch (e: any) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr;
}

/** =========================
 *  CRUD de Clientes
 *  ========================= */
async function list(params?: { page?: number; size?: number; q?: string }): Promise<Cliente[]> {
  // /cliente  ou  /clientes
  return getWithFallback<Cliente[]>(["cliente", "clientes"], params);
}

async function getById(id: number | string): Promise<Cliente> {
  return getWithFallback<Cliente>([`cliente/${id}`, `clientes/${id}`]);
}

async function update(id: number | string, data: Partial<Cliente>): Promise<void> {
  await mutateWithFallback<void>([
    { url: `cliente/${id}`, data, method: "put" },
    { url: `clientes/${id}`, data, method: "put" },
  ]);
}

async function remove(id: number | string): Promise<void> {
  await mutateWithFallback<void>([
    { url: `cliente/${id}`, method: "delete" },
    { url: `clientes/${id}`, method: "delete" },
  ]);
}

/** =========================
 *  Dashboard
 *  ========================= */
async function getDashboardStats(userId?: number): Promise<ClienteStats> {
  const params = typeof userId === "number" ? { userId } : undefined;
  // cobre /cliente/dashboard/*  e  /clientes/dashboard/*
  return getWithFallback<ClienteStats>(
    ["cliente/dashboard/stats", "clientes/dashboard/stats", "dashboard/stats"],
    params
  );
}

async function getUpcomingAppointments(userId?: number): Promise<ClienteAppointment[]> {
  const params = typeof userId === "number" ? { userId } : undefined;
  return getWithFallback<ClienteAppointment[]>(
    ["cliente/dashboard/next-appointments", "clientes/dashboard/next-appointments", "dashboard/next-appointments"],
    params
  );
}

async function getFavoriteServices(userId?: number): Promise<ClienteFavorite[]> {
  const params = typeof userId === "number" ? { userId } : undefined;
  // se sua API retornar outro shape (ex.: {serviceId, timesUsed}), mapeie no componente
  return getWithFallback<ClienteFavorite[]>(
    ["cliente/dashboard/favorite-services", "clientes/dashboard/favorite-services", "dashboard/favorite-services"],
    params
  );
}

/** =========================
 *  Agendamentos
 *  ========================= */

// lista os "meus" (com ou sem userId)
async function listAppointments(userId?: number): Promise<ClienteAppointment[]> {
  const params = typeof userId === "number" ? { userId } : undefined;
  return getWithFallback<ClienteAppointment[]>(
    ["agendamento/minhas", "agendamentos/minhas", "cliente/agendamentos/minhas"],
    params
  );
}

// payload típico de UI do Booking
export type BookingPayloadUI = {
  clientId: number | string;
  serviceId: number | string;
  professionalId: number | string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  notes?: string | null;
};

// cria a partir do payload de UI (monta variações comuns até acertar)
async function createAppointmentFromUI(payload: BookingPayloadUI): Promise<ClienteAppointment> {
  // Monta ISO combinando date + time em localtime
  const iso = new Date(`${payload.date}T${payload.time}:00`).toISOString();

  // 1) Formato “v1” comum no .NET:
  const v1 = {
    clientId: payload.clientId,
    serviceId: payload.serviceId,
    professionalId: payload.professionalId,
    date: payload.date,
    time: payload.time,
    notes: payload.notes ?? undefined,
  };

  // 2) Formato “v2” (startAt/endAt) — usado anteriormente no seu FE:
  const v2 = {
    clientId: payload.clientId,
    title: "Agendamento",
    notes: payload.notes ?? undefined,
    startAt: iso,
    endAt: iso, // se seu back exigir duração, altere aqui
    status: "SCHEDULED",
  };

  // 3) Formato “v3” (dateTime único)
  const v3 = {
    clientId: payload.clientId,
    serviceId: payload.serviceId,
    professionalId: payload.professionalId,
    dateTime: iso,
    notes: payload.notes ?? undefined,
  };

  // Tenta endpoints mais prováveis em sequência
  const candidates: CandidateReq[] = [
    { url: "agendamento", data: v1, method: "post" },
    { url: "agendamentos", data: v1, method: "post" },
    { url: "cliente/agendamento", data: v1, method: "post" },
    { url: "cliente/agendamentos", data: v1, method: "post" },

    { url: "agendamento", data: v2, method: "post" },
    { url: "agendamentos", data: v2, method: "post" },

    { url: "agendamento", data: v3, method: "post" },
    { url: "agendamentos", data: v3, method: "post" },
  ];

  return mutateWithFallback<ClienteAppointment>(candidates);
}

// versão “crua” (mantida caso já exista consumo)
type CreateAppointmentPayloadRaw = {
  clientId: number | string;
  title: string;
  notes?: string | null;
  startAt: string; // ISO
  endAt: string;   // ISO
};
async function createAppointment(data: CreateAppointmentPayloadRaw): Promise<ClienteAppointment> {
  return mutateWithFallback<ClienteAppointment>([
    { url: "agendamento", data, method: "post" },
    { url: "agendamentos", data, method: "post" },
    { url: "cliente/agendamento", data, method: "post" },
    { url: "cliente/agendamentos", data, method: "post" },
  ]);
}

async function cancelAppointment(id: number | string): Promise<void> {
  await mutateWithFallback<void>([
    { url: `agendamento/${id}/cancelar` },
    { url: `agendamentos/${id}/cancelar` },
    { url: `cliente/agendamentos/${id}/cancelar` },
  ]);
}

/** =========================
 *  Perfil (dados e overview)
 *  ========================= */
async function getProfile(): Promise<ClienteProfile> {
  return getWithFallback<ClienteProfile>([
    "cliente/perfil",
    "clientes/perfil",
    "cliente/profile",
    "clientes/profile",
  ]);
}

async function updateProfile(data: Partial<ClienteProfile>): Promise<void> {
  await mutateWithFallback<void>([
    { url: "cliente/perfil", data, method: "patch" },
    { url: "clientes/perfil", data, method: "patch" },
    { url: "cliente/profile", data, method: "put" },
    { url: "clientes/profile", data, method: "put" },
  ]);
}

async function getProfileStats(): Promise<ClienteProfileStats> {
  // Mantido por compatibilidade; caso a API ainda não exponha o endpoint, evita 404.
  return Promise.resolve({
    id: 0,
    name: "",
    email: "",
    phone: "",
    memberSince: new Date().toISOString(),
    totalAppointments: 0,
    favoriteServices: [],
    averageRating: 0,
  });
}

async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
  await mutateWithFallback<void>([
    { url: "cliente/profile/change-password", data: payload, method: "post" },
    { url: "clientes/profile/change-password", data: payload, method: "post" },
    { url: "profile/change-password", data: payload, method: "post" },
  ]);
}

/** Export público do serviço */
const ClienteService = {
  // clientes
  list,
  getById,
  update,
  remove,

  // dashboard
  getDashboardStats,
  getUpcomingAppointments,
  getFavoriteServices,

  // agendamentos
  listAppointments,
  createAppointment,
  createAppointmentFromUI,
  cancelAppointment,

  // perfil
  getProfile,
  updateProfile,
  getProfileStats,
  changePassword,
};

export default ClienteService;
export { ClienteService };
