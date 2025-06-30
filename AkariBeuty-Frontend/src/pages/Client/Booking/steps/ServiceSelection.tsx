// src/pages/Client/Booking/steps/ServiceSelection.tsx
import React from 'react';
import { Scissors, Palette, Hand, Star } from '@phosphor-icons/react';
import { Service } from '../../../../types'; // Verifique o caminho aqui

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  // Dados simulados - conectar com sua API
  const serviceCategories = [
    {
      name: 'Cabelo',
      icon: Scissors,
      color: 'from-bolt-primary-400 to-bolt-primary-600', // RENOMEADO AQUI
      services: [
        { id: '1', name: 'Corte Feminino', description: 'Corte personalizado', duration: 60, price: 80, category: 'Cabelo' },
        { id: '2', name: 'Corte Masculino', description: 'Corte moderno', duration: 45, price: 50, category: 'Cabelo' },
        { id: '3', name: 'Escova', description: 'Escova modeladora', duration: 45, price: 60, category: 'Cabelo' },
      ]
    },
    {
      name: 'Coloração',
      icon: Palette,
      color: 'from-bolt-secondary-400 to-bolt-secondary-600', // RENOMEADO AQUI
      services: [
        { id: '4', name: 'Coloração Completa', description: 'Mudança total de cor', duration: 180, price: 200, category: 'Coloração' },
        { id: '5', name: 'Mechas', description: 'Mechas tradicionais', duration: 120, price: 150, category: 'Coloração' },
        { id: '6', name: 'Luzes', description: 'Luzes naturais', duration: 90, price: 120, category: 'Coloração' },
      ]
    },
    {
      name: 'Unhas',
      icon: Hand,
      color: 'from-bolt-accent-400 to-bolt-accent-600', // RENOMEADO AQUI
      services: [
        { id: '7', name: 'Manicure', description: 'Cuidado completo das unhas', duration: 60, price: 40, category: 'Unhas' },
        { id: '8', name: 'Pedicure', description: 'Cuidado dos pés', duration: 60, price: 45, category: 'Unhas' },
        { id: '9', name: 'Unha em Gel', description: 'Alongamento em gel', duration: 90, price: 80, category: 'Unhas' },
      ]
    },
    {
      name: 'Estética',
      icon: Star,
      color: 'from-pink-400 to-pink-600', // Mantido, pois 'pink' não colide com suas cores originais
      services: [
        { id: '10', name: 'Limpeza de Pele', description: 'Limpeza profunda', duration: 90, price: 100, category: 'Estética' },
        { id: '11', name: 'Massagem Relaxante', description: 'Massagem corporal', duration: 60, price: 120, category: 'Estética' },
        { id: '12', name: 'Design de Sobrancelhas', description: 'Modelagem perfeita', duration: 30, price: 35, category: 'Estética' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha seu serviço</h2> {/* RENOMEADO AQUI */}
        <p className="text-bolt-neutral-600">Selecione o serviço que deseja agendar</p> {/* RENOMEADO AQUI */}
      </div>

      {serviceCategories.map((category) => (
        <div key={category.name} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mr-4`}>
              <category.icon size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-bolt-neutral-900">{category.name}</h3> {/* RENOMEADO AQUI */}
          </div>

          <div className="grid gap-3">
            {category.services.map((service) => (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service)}
                className="text-left p-4 border border-bolt-neutral-200 rounded-xl hover:border-bolt-primary-300 hover:bg-bolt-primary-50 transition-all card-hover" // RENOMEADO AQUI
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-bolt-neutral-900 mb-1">{service.name}</h4> {/* RENOMEADO AQUI */}
                    <p className="text-sm text-bolt-neutral-600 mb-2">{service.description}</p> {/* RENOMEADO AQUI */}
                    <p className="text-xs text-bolt-neutral-500">{service.duration} minutos</p> {/* RENOMEADO AQUI */}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-bolt-primary-600">R$ {service.price}</p> {/* RENOMEADO AQUI */}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceSelection;