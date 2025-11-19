import React, { useEffect, useMemo, useState } from 'react';
import { Star, User } from '@phosphor-icons/react';
import { Service, Professional } from '../../../../types'; 
import profissionalService, { type ProfissionalApi } from '../../../../services/profissionalService';
import LoadingSpinner from '../../../../components/UI/LoadingSpinner';
import { showError } from '../../../../utils/toast';

interface ProfessionalSelectionProps {
  selectedService: Service;
  onProfessionalSelect: (professional: Professional) => void;
}

const BLOCKED_KEYWORDS = ['administrador', 'funcionário', 'funcionario', 'recepcionista'];

const mapApiToProfessional = (item: ProfissionalApi, fallbackService: string): Professional => {
  const specialties = item.profissionalServicos?.map((entry) => entry.servico?.servicoPrestado).filter(Boolean) ?? [];
  const serviceIds = item.profissionalServicos?.map((entry) => entry.servicoId).filter((id): id is number => typeof id === 'number') ?? [];

  return {
    id: item.id,
    name: item.nome,
    serviceIds,
    specialties: specialties.length ? specialties : [fallbackService],
    rating: Number(item.rating ?? 0),
    avatar: undefined,
    bio: item.telefone ? `Contato: ${item.telefone}` : 'Profissional disponível para este serviço.',
  };
};

const ProfessionalSelection: React.FC<ProfessionalSelectionProps> = ({
  selectedService,
  onProfessionalSelect
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await profissionalService.listar({ servicoId: selectedService.id });
        setProfessionals(data.map((item) => mapApiToProfessional(item, selectedService.name)));
      } catch (error) {
        console.error('Erro ao carregar profissionais', error);
        showError('Não foi possível carregar os profissionais.');
        setHasError(true);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfessionals();
  }, [selectedService.id, selectedService.name]);

  const filteredProfessionals = useMemo(() => professionals.filter((prof) => {
    const normalized = prof.name.trim().toLowerCase();
    return !BLOCKED_KEYWORDS.some((keyword) => normalized.includes(keyword));
  }), [professionals]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha o profissional</h2> {/* RENOMEADO AQUI */}
        <p className="text-bolt-neutral-600">Para: <span className="font-medium">{selectedService.name}</span></p> {/* RENOMEADO AQUI */}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-10">
            <LoadingSpinner size="lg" />
            <p className="mt-3 text-bolt-neutral-500">Carregando profissionais...</p>
          </div>
        ) : hasError ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto mb-4 text-bolt-neutral-300" />
            <p className="text-bolt-neutral-500">Não foi possível carregar os profissionais.</p>
          </div>
        ) : filteredProfessionals.length === 0 ? (
          <div className="text-center py-8">
            <User size={48} className="mx-auto mb-4 text-bolt-neutral-300" />
            <p className="text-bolt-neutral-500">Nenhum profissional disponível para este serviço.</p>
          </div>
        ) : (
          filteredProfessionals.map((professional) => (
            <button
              key={professional.id}
              onClick={() => onProfessionalSelect(professional)}
              className="w-full bg-white p-6 rounded-2xl shadow-sm border border-bolt-neutral-200 hover:border-bolt-primary-300 hover:shadow-md transition-all card-hover text-left"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-2xl flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-bolt-neutral-900">{professional.name}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 mr-1" weight="fill" />
                      <span className="text-sm font-medium text-bolt-neutral-700">{professional.rating ? professional.rating.toFixed(1) : '-'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-bolt-neutral-600 mb-3">{professional.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          specialty === selectedService.name
                            ? 'bg-bolt-primary-100 text-bolt-primary-800'
                            : 'bg-bolt-neutral-100 text-bolt-neutral-600'
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

      {professionals.length === 0 && (
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