/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Client/Booking/steps/ServiceSelection.tsx
import React, { useState } from 'react';
import { Scissors, Palette, Hand, Star, Clock } from '@phosphor-icons/react';
import { Service } from '../../../../types';

interface ServiceSelectionProps {
  onServiceSelect: (service: Service) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  // Dados mockados para demonstração
  const mockServices: Service[] = [
    {
      id: 1,
      name: 'Corte de Cabelo',
      description: 'Corte moderno e estiloso',
      duration: 60,
      price: 80.00,
      category: 'Cabelo',
      image: undefined
    },
    {
      id: 2,
      name: 'Coloração',
      description: 'Coloração completa com produtos de qualidade',
      duration: 120,
      price: 150.00,
      category: 'Cabelo',
      image: undefined
    },
    {
      id: 3,
      name: 'Manicure',
      description: 'Manicure completa com esmaltação',
      duration: 45,
      price: 35.00,
      category: 'Unhas',
      image: undefined
    },
    {
      id: 4,
      name: 'Pedicure',
      description: 'Pedicure completa com esmaltação',
      duration: 60,
      price: 45.00,
      category: 'Unhas',
      image: undefined
    },
    {
      id: 5,
      name: 'Design de Sobrancelhas',
      description: 'Design e modelagem de sobrancelhas',
      duration: 30,
      price: 25.00,
      category: 'Estética',
      image: undefined
    },
    {
      id: 6,
      name: 'Limpeza de Pele',
      description: 'Limpeza facial profunda',
      duration: 90,
      price: 120.00,
      category: 'Estética',
      image: undefined
    }
  ];

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

  const groupedServices = mockServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha seu serviço</h2>
        <p className="text-bolt-neutral-600">Selecione o serviço que deseja agendar</p>
      </div>

      {Object.entries(groupedServices).map(([category, services]) => {
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
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => onServiceSelect(service)}
                  className="text-left p-4 border border-bolt-neutral-200 rounded-xl hover:border-bolt-primary-300 hover:bg-bolt-primary-50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-bolt-neutral-900 mb-1">
                        {service.name}
                      </h4>
                      <p className="text-sm text-bolt-neutral-600 mb-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-bolt-neutral-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{service.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-bolt-primary-600">
                        R$ {service.price.toFixed(2).replace('.', ',')}
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