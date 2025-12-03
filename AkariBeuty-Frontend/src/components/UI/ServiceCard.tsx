import React from 'react';
import { Clock, Star, ArrowRight } from '@phosphor-icons/react';
import { Servico } from '../../services/servicoService';

interface ServiceCardProps {
  servico: Servico;
  onSelect: (servico: Servico) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ servico, onSelect }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-bolt-neutral-800 mb-2">
              {servico.servicoPrestado}
            </h3>
            <p className="text-bolt-neutral-600 text-sm leading-relaxed mb-4">
              {servico.descricao}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-bolt-neutral-500">
              <Clock size={16} className="mr-1" />
              <span className="text-sm">{formatDuration(servico.tempo ?? 0)}</span>
            </div>
            <div className="flex items-center text-bolt-yellow-600">
              <Star size={16} className="mr-1" weight="fill" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-bolt-primary-600">
              {formatPrice(servico.valorBase)}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(servico)}
          className="w-full bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-bolt-primary-600 hover:to-bolt-secondary-600 transition-all duration-300 flex items-center justify-center space-x-2 group"
        >
          <span>Agendar Agora</span>
          <ArrowRight 
            size={20} 
            className="group-hover:translate-x-1 transition-transform duration-300" 
          />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
