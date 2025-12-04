export type CompanyModule = {
    id: string;
    title: string;
    description: string;
    path: string;
    priority: number;
};

export const COMPANY_MODULES: CompanyModule[] = [
    {
        id: "overview",
        title: "Minha Empresa",
        description: "Resumo cadastral e status operacional.",
        path: "/empresa/resumo",
        priority: 0,
    },
    {
        id: "dashboard",
        title: "Painel Executivo",
        description: "KPIs, tendências e alertas do negócio.",
        path: "/empresa/dashboard",
        priority: 1,
    },
    {
        id: "profissionais",
        title: "Gestão de Profissionais",
        description: "Cadastro completo, indicadores e agenda compacta.",
        path: "/empresa/profissionais",
        priority: 2,
    },
    {
        id: "servicos",
        title: "Serviços & Catálogo",
        description: "Gerencie oferta, categorias e histórico de alterações.",
        path: "/empresa/servicos",
        priority: 3,
    },
    {
        id: "agenda",
        title: "Agenda Corporativa",
        description: "Visão consolidada, filtros por profissional e exportação.",
        path: "/empresa/agenda",
        priority: 4,
    },
    {
        id: "clientes",
        title: "Clientes Corporativos",
        description: "Segmentação, status VIP e importação de leads.",
        path: "/empresa/clientes",
        priority: 5,
    },
    {
        id: "financeiro",
        title: "Financeiro & Relatórios",
        description: "Fluxo de caixa, comissões e exportação de dados.",
        path: "/empresa/financeiro",
        priority: 6,
    },
    {
        id: "configuracoes",
        title: "Configurações da Empresa",
        description: "Dados legais, horários e notificações.",
        path: "/empresa/configuracoes",
        priority: 7,
    },
    {
        id: "comunicacao",
        title: "Comunicação & Notificações",
        description: "Templates, públicos e status dos envios.",
        path: "/empresa/comunicacao",
        priority: 8,
    },
    {
        id: "auditoria",
        title: "Auditoria & Logs",
        description: "Registro das ações sensíveis da operação.",
        path: "/empresa/auditoria",
        priority: 9,
    },
];
