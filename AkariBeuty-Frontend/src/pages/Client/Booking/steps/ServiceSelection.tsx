import React, { useEffect, useMemo, useState } from 'react';
import { Scissors, Palette, Hand, Star, Clock } from '@phosphor-icons/react';
import { Service } from '../../../../types';
import { servicoService, type Servico } from '../../../../services/servicoService';
import LoadingSpinner from '../../../../components/UI/LoadingSpinner';
import { showError } from '../../../../utils/toast';

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
}

const DEFAULT_DURATION = 60;

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  const [services, setServices] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await servicoService.getAll();
        setServices(data);
      } catch (error) {
        console.error('Erro ao carregar serviços', error);
        showError('Não foi possível carregar os serviços.');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadServices();
  }, []);

  const groupedServices = useMemo(() => {
    return services.reduce((acc, service) => {
      const categoryName = service.categoriaServico?.nome ?? 'Outros serviços';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {} as Record<string, Servico[]>);
  }, [services]);

  const resolveDuration = (service: Servico) => {
    const raw = service.tempo;
    return typeof raw === 'number' && raw > 0 ? raw : DEFAULT_DURATION;
  };

  const handleSelect = (service: Servico) => {
    const mapped: Service = {
      id: service.id,
      name: service.servicoPrestado,
      description: service.descricao,
      duration: resolveDuration(service),
      price: service.valorBase,
      category: service.categoriaServico?.nome ?? 'Serviço',
      image: undefined,
    };

    onServiceSelect(mapped);
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('cabelo')) return Scissors;
    if (cat.includes('unha')) return Hand;
    if (cat.includes('estética')) return Palette;
    return Star;
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('cabelo')) return 'from-blue-400 to-blue-600';
    if (cat.includes('unha')) return 'from-pink-400 to-pink-600';
    if (cat.includes('estética')) return 'from-purple-400 to-purple-600';
    return 'from-gray-400 to-gray-600';
  };

  const formatCurrency = (value: number | undefined) => {
    const parsed = Number(value ?? 0);
    return parsed.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  const formatDuration = (service: Servico) => {
    const parsed = resolveDuration(service);
    return `${parsed} min`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-bolt-neutral-500">Carregando serviços...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-10 text-bolt-neutral-500">
        <p className="mb-2">Não foi possível carregar os serviços.</p>
        <p className="text-sm">Tente novamente em instantes.</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10 text-bolt-neutral-500">
        <p>Nenhum serviço disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha seu serviço</h2>
        <p className="text-bolt-neutral-600">Selecione o serviço que deseja agendar</p>
      </div>

      {Object.entries(groupedServices).map(([category, categoryServices]) => {
        const IconComponent = getCategoryIcon(category);
        const colorClass = getCategoryColor(category);

        return (
          <div key={category} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mr-4`}>
                <IconComponent size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-bolt-neutral-900">{category}</h3>
                <p className="text-sm text-bolt-neutral-600">Serviços de {category.toLowerCase()}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {categoryServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSelect(service)}
                  className="text-left p-4 border border-bolt-neutral-200 rounded-xl hover:border-bolt-primary-300 hover:bg-bolt-primary-50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-bolt-neutral-900 mb-1">
                        {service.servicoPrestado}
                      </h4>
                      <p className="text-sm text-bolt-neutral-600 mb-2">
                        {service.descricao}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-bolt-neutral-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{formatDuration(service)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-bolt-primary-600">
                        {formatCurrency(service.valorBase)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceSelection;