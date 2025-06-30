import { CurrencyDollar, Calendar, UserPlus, CurrencyCircleDollar, Clock, User, CreditCard, FileText, Plus } from '@phosphor-icons/react';
import KPICard from '../../components/UI/KPICard';
import Card from '../../components/UI/Card';
import { useEffect, useState } from 'react';
import BaseService from '../../services/Generic/BaseService';
import { getWeekOfMonthFromParts } from '../../Utils/GetWeekOfMonth';

export default function DashboardEmpresa() {
  const todayAppointments = [
    { time: '09:00', client: 'Ana Santos', professional: 'Maria', service: 'Corte + Escova', status: 'Confirmado' },
    { time: '10:30', client: 'João Silva', professional: 'Carla', service: 'Barba', status: 'Aguardando' },
    { time: '11:00', client: 'Rosa Lima', professional: 'Maria', service: 'Manicure', status: 'Confirmado' },
    { time: '14:00', client: 'Pedro Costa', professional: 'João', service: 'Corte Masculino', status: 'Confirmado' },
    { time: '15:30', client: 'Lucia Mendes', professional: 'Carla', service: 'Coloração', status: 'Aguardando' },
    { time: '16:00', client: 'Carlos Oliveira', professional: 'João', service: 'Corte + Barba', status: 'Confirmado' },
  ];

  const weeklyRevenue = [
    { day: 'Seg', value: 850 },
    { day: 'Ter', value: 920 },
    { day: 'Qua', value: 780 },
    { day: 'Qui', value: 1100 },
    { day: 'Sex', value: 1350 },
    { day: 'Sáb', value: 1650 },
    { day: 'Dom', value: 450 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Aguardando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const [FaturamentoDia, setFaturamentoDia] = useState(0);
  const [PorcentagemFaturamento, setPorcentegemFaturamento] = useState(0);

  const [agendamentos, setAgendamentos] = useState(0);
  const [agendametnosConcluidos, setAgendamentosConcluidos] = useState(0);

  const [clienteNovoMes, setClienteNovoMes] = useState(0);
  const [clienteNovoSemana, setClienteNovoSemana] = useState(0);

  useEffect(() => {

    const data = new Date(2025, 5, 27);

    const dataOld = new Date();
    dataOld.setDate(data.getDate() - 1);

    const dataSemana = new Date();
    dataSemana.setDate(data.getDate() - data.getDay());


    const server = BaseService({
        method: "get", url : `agendamento/filtrar?Ano=${data.getFullYear()}&Mes=${data.getMonth() + 1}&Dia=${data.getDate()}`, auth : true
    });

    const serverOld = BaseService({
        method: "get", url : `agendamento/filtrar?Ano=${dataOld.getFullYear()}&Mes=${dataOld.getMonth() + 1}&Dia=${dataOld.getDate()}`, auth : true
    });

    const cnms = BaseService({
        method: "get", url : `empresa/novos-clientes?data=${data.getFullYear()}-${data.getMonth() + 1}-01`, auth : true
    })

    const cnss = BaseService({
        method: "get", url : `empresa/novos-clientes?data=${dataSemana.getFullYear()}-${dataSemana.getMonth() + 1}-${dataSemana.getDate()}`, auth : true
    })

    async function fetchData() {
        try {
            const response = await server.request();
            const responseOld = await serverOld.request();
            const cnm = await cnms.request();
            const cns = await cnss.request();

            if (response.success === 200) {

                let total = 0;
                let agendamentos = response.data.length;
                let agendamentosConcluidos = 0;


                response.data.forEach((item: any) => {
                    if (item.statusAgendamento === 6)
                    {
                        total += item.valor;
                        agendamentosConcluidos++;
                    }
                });

                if (responseOld.success === 200) {
                    let totalOld = 0;
                    responseOld.data.forEach((item: any) => {
                        if (item.statusAgendamento === 6)
                        {
                            totalOld += item.valor;
                        }
                    });

                    const SetarInformacoes = () => {
                        let porcentagem = 0;

                        if (totalOld > 0) {
                            porcentagem = ((total - totalOld) / totalOld) * 100;
                        } else if (total > 0) {
                            porcentagem = 100;
                        }

                        setAgendamentos(agendamentos);
                        setAgendamentosConcluidos(agendamentosConcluidos);

                        setFaturamentoDia(total);
                        setPorcentegemFaturamento(porcentagem);

                        setClienteNovoMes(cnm.data);
                        setClienteNovoSemana(cns.data);

                    };

                    SetarInformacoes();


                }
            }
        } catch (error) {

        }
    }

    fetchData();
  }, []);

  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.value));

  return (
    <div className="space-y-6">
      <div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Faturamento do Dia"
            value={`R$ ${FaturamentoDia.toFixed(2)}`}
            icon={CurrencyDollar}
            trend={`${PorcentagemFaturamento.toFixed(0)}% vs ontem`}
            trendColor={PorcentagemFaturamento >= 0 ? 'green' : 'red'}
          />
          <KPICard
            title="Agendamentos de Hoje"
            value={`${agendamentos}`}
            icon={Calendar}
            trend={`${agendametnosConcluidos} concluídos`}
            trendColor="gray"
          />
          <KPICard
            title="Novos Clientes (Mês)"
            value={`${clienteNovoMes}`}
            icon={UserPlus}
            trend={`${clienteNovoSemana ? `+${clienteNovoSemana}` : 0} esta semana`}
            trendColor={clienteNovoSemana > 0 ? 'green' : 'gray'}
          />
          <KPICard
            title="Taxa de Ocupação"
            value="85%"
            icon={CurrencyCircleDollar}
            trend="Acima da média"
            trendColor="green"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda do Dia */}
        <div className="lg:col-span-2">
          <Card title="Agenda do Dia">
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg">
                      <Clock className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">{appointment.time}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700">{appointment.client}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.professional} • {appointment.service}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar direita */}
        <div className="space-y-6">
          {/* Resumo Financeiro da Semana */}
          <Card title="Resumo Financeiro da Semana">
            <div className="space-y-4">
              {weeklyRevenue.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{day.day}</span>
                  <div className="flex items-center space-x-2 flex-1 mx-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full"
                        style={{ width: `${(day.value / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-800">R$ {day.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Acesso Rápido */}
          <Card title="Acesso Rápido">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors group">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-pink-600 mb-2" />
                <span className="text-xs text-gray-600 group-hover:text-pink-700 text-center">Novo Agendamento</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors group">
                <User className="w-6 h-6 text-gray-400 group-hover:text-pink-600 mb-2" />
                <span className="text-xs text-gray-600 group-hover:text-pink-700 text-center">Cadastrar Cliente</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors group">
                <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-pink-600 mb-2" />
                <span className="text-xs text-gray-600 group-hover:text-pink-700 text-center">Lançar Despesa</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors group">
                <FileText className="w-6 h-6 text-gray-400 group-hover:text-pink-600 mb-2" />
                <span className="text-xs text-gray-600 group-hover:text-pink-700 text-center">Ver Relatórios</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
