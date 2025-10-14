import React from 'react';
import { Star, User } from '@phosphor-icons/react';
import { Service, Professional } from '../../../../types'; 

interface ProfessionalSelectionProps {
  selectedService: Service;
  onProfessionalSelect: (professional: Professional) => void;
}

const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  selectedService,
  onProfessionalSelect
}) => {
  // Dados simulados - conectar com sua API
  const professionals: Professional[] = [
    {
      id: 1,
      name: 'Ana Silva',
      specialties: ['Corte de Cabelo', 'Coloração'],
      rating: 4.9,
      bio: 'Especialista em cortes modernos e colorações. 8 anos de experiência.',
      avatar: undefined
    },
    {
      id: 2,
      name: 'Carla Santos',
      specialties: ['Manicure', 'Pedicure'],
      rating: 4.8,
      bio: 'Expert em nail art e cuidados com as unhas. Formação internacional.',
      avatar: undefined
    },
    {
      id: 3,
      name: 'Marina Costa',
      specialties: ['Limpeza de Pele', 'Design de Sobrancelhas'],
      rating: 4.9,
      bio: 'Esteticista certificada com foco em tratamentos naturais.',
      avatar: undefined
    },
    {
      id: 4,
      name: 'Julia Oliveira',
      specialties: ['Corte de Cabelo', 'Coloração'],
      rating: 4.7,
      bio: 'Colorista especializada em técnicas avançadas de coloração.',
      avatar: undefined
    }
  ];

  // Filtrar profissionais que fazem o serviço selecionado
  const availableProfessionals = professionals.filter(prof =>
    prof.specialties.includes(selectedService.name)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha o profissional</h2> {/* RENOMEADO AQUI */}
        <p className="text-bolt-neutral-600">Para: <span className="font-medium">{selectedService.name}</span></p> {/* RENOMEADO AQUI */}
      </div>

      <div className="space-y-4">
        {availableProfessionals.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto mb-4 text-bolt-neutral-300" /> {/* RENOMEADO AQUI */}
            <p className="text-bolt-neutral-500">Nenhum profissional disponível para este serviço</p> {/* RENOMEADO AQUI */}
          </div>
        ) : (
          availableProfessionals.map((professional) => (
            <button
              key={professional.id}
              onClick={() => onProfessionalSelect(professional)}
              className="w-full bg-white p-6 rounded-2xl shadow-sm border border-bolt-neutral-200 hover:border-bolt-primary-300 hover:shadow-md transition-all card-hover text-left" // RENOMEADO AQUI
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-2xl flex items-center justify-center"> {/* RENOMEADO AQUI */}
                  <User size={24} className="text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-bolt-neutral-900">{professional.name}</h3> {/* RENOMEADO AQUI */}
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" weight="fill" />
                      <span className="text-sm font-medium text-bolt-neutral-700">{professional.rating}</span> {/* RENOMEADO AQUI */}
                    </div>
                  </div>

                  <p className="text-sm text-bolt-neutral-600 mb-3">{professional.bio}</p> {/* RENOMEADO AQUI */}

                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          specialty === selectedService.name
                            ? 'bg-bolt-primary-100 text-bolt-primary-800' // RENOMEADO AQUI
                            : 'bg-bolt-neutral-100 text-bolt-neutral-600' // RENOMEADO AQUI
                        }`}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {availableProfessionals.length === 0 && (
        <div className="bg-bolt-yellow-50 border border-bolt-yellow-200 rounded-xl p-4"> {/* RENOMEADO AQUI */}
          <p className="text-sm text-bolt-yellow-800"> {/* RENOMEADO AQUI */}
            <strong>Dica:</strong> Tente selecionar outro serviço ou entre em contato conosco para mais opções.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSelection;