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
    AGUARDANDO = "Aguardando",
    CONFIRMADO = "Confirmado",
    CANCELADO = "Cancelado",
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
    type: "success" | "error" | "warning" | "info";
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

export interface CompanyDashboardKpi {
    label: string;
    value: string;
    variation: number;
}

export interface CompanyAlert {
    id: number;
    title: string;
    type: "financeiro" | "agenda" | "cadastro" | "atencao";
    detail: string;
}

export interface CompanyRankingItem {
    name: string;
    value: string;
    delta: number;
}

export interface CompanyDashboardData {
    kpis: CompanyDashboardKpi[];
    weeklyTrend: { label: string; value: number }[];
    services: CompanyRankingItem[];
    professionals: CompanyRankingItem[];
    alerts: CompanyAlert[];
}

export interface CompanyProfile {
    id: number;
    cnpj: string;
    razaoSocial: string;
    uf: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: number;
    horaInicial: string;
    horaFinal: string;
    adiantamento: boolean;
}

export interface CompanyProfessionalSummary {
    id: number;
    name: string;
    role: string;
    status: "ativo" | "ferias" | "pendente" | "inativo";
    specialties: string[];
    presenceRate: number;
    averageDaily: number;
    nextShift: string;
    tags: string[];
    avatar?: string;
}

export interface CompanyProfessionalHighlight {
    label: string;
    value: string;
    trend: number;
}

export interface CompanyProfessionalsResponse {
    highlights: CompanyProfessionalHighlight[];
    professionals: CompanyProfessionalSummary[];
    filters: {
        statuses: string[];
        services: string[];
    };
}

export type ProfessionalStatusCode = 1 | 2 | 3;

export interface ProfessionalManagementRecord {
    id: number;
    nome: string;
    cpf: string;
    salario: number;
    login: string;
    telefone: string;
    empresaId: number;
    status: ProfessionalStatusCode;
}

export interface ProfessionalManagementPayload {
    nome: string;
    cpf: string;
    salario: number;
    login: string;
    senha: string;
    telefone: string;
    empresaId: number;
    status: ProfessionalStatusCode;
}

export interface ProfessionalServiceSummary {
    id: number;
    nome: string;
    descricao?: string;
    valorBase?: number | string;
}

export interface ProfessionalAssignServicePayload {
    profissionalId: number;
    servicoId: number;
    comissao: number;
    tempo: string; // HH:mm:ss
}

export interface CompanyServiceCatalogItem {
    id: number;
    name: string;
    category: string;
    price: string;
    duration: string;
    status: "ativo" | "rascunho" | "inativo";
    updatedAt: string;
    version: string;
    updatedBy: string;
}

export interface CompanyServiceHistoryEntry {
    id: number;
    name: string;
    changes: string;
    updatedAt: string;
}

export interface CompanyAgendaSlot {
    id: number;
    date: string;
    start: string;
    end: string;
    professional: string;
    service: string;
    status: "confirmado" | "pendente" | "atrasado" | "cancelado";
    client: string;
    location: string;
}

export interface CompanyAgendaSummary {
    label: string;
    value: string;
    detail: string;
}

export interface CompanyAgendaResponse {
    summary: CompanyAgendaSummary[];
    slots: CompanyAgendaSlot[];
    filters: {
        professionals: string[];
        services: string[];
    };
}

export interface CompanyClientRecord {
    id: number;
    name: string;
    segment: string;
    visits: number;
    status: "vip" | "ativo" | "inadimplente";
    retention: string;
    lifetimeValue: string;
    lastVisit: string;
}

export interface CompanyClientMetric {
    label: string;
    value: string;
    delta: number;
}

export interface CompanyClientsResponse {
    metrics: CompanyClientMetric[];
    clients: CompanyClientRecord[];
}

export interface CompanyFinanceKpi {
    label: string;
    value: string;
    variation: number;
}

export interface CompanyCashFlowEntry {
    period: string;
    entradas: number;
    saidas: number;
}

export interface CompanyCommissionRow {
    professional: string;
    amount: string;
    period: string;
    status: "pago" | "pendente" | "atrasado";
}

export interface CompanyFinanceResponse {
    kpis: CompanyFinanceKpi[];
    cashFlow: CompanyCashFlowEntry[];
    commissions: CompanyCommissionRow[];
}

export interface CompanySettingsData {
    legal: {
        razaoSocial: string;
        cnpj: string;
        ie: string;
        responsavel: string;
    };
    contact: {
        email: string;
        phone: string;
        whatsapp: string;
    };
    address: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };
    hours: {
        segundaSexta: string;
        sabado: string;
        domingo: string;
    };
    notifications: {
        emailFinanceiro: boolean;
        smsClientes: boolean;
        pushEquipe: boolean;
    };
    brand: {
        logoUrl: string;
        updatedAt: string;
    };
}

export interface CompanyCommunicationTemplate {
    id: number;
    title: string;
    audience: string;
    status: "rascunho" | "agendado" | "enviado";
    lastSend: string;
    openRate: number;
}

export interface CompanyCommunicationResponse {
    templates: CompanyCommunicationTemplate[];
    stats: {
        sentThisWeek: number;
        deliveryRate: number;
        activeCampaigns: number;
    };
}

export interface CompanyLogEntry {
    id: number;
    module: string;
    action: string;
    actor: string;
    timestamp: string;
    severity: "info" | "warning" | "critical";
}

export interface CompanyAuditResponse {
    logs: CompanyLogEntry[];
    filters: {
        modules: string[];
        actors: string[];
    };
}
