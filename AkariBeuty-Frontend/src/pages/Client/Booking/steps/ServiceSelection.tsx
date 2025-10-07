// src/pages/Client/Booking/steps/ServiceSelection.tsx
import React, { useState, useEffect } from 'react';
import { Scissors, Palette, Hand, Star, Spinner } from '@phosphor-icons/react';
import { servicoService, Servico, CategoriaServico } from '../../../../services/servicoService';

interface ServiceSelectionProps {
  onServiceSelect: (service: Servico) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Carregar categorias e serviços em paralelo
      const [categoriasData, servicosData] = await Promise.all([
        servicoService.getCategorias(),
        servicoService.getAll()
      ]);
      
      setCategorias(categoriasData);
      setServicos(servicosData);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar serviços. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getServicosByCategoria = (categoriaId: number) => {
    return servicos.filter(servico => servico.categoriaServicoId === categoriaId);
  };

  const getCategoryIcon = (categoriaNome: string) => {
    const nome = categoriaNome.toLowerCase();
    if (nome.includes('cabelo') || nome.includes('hair')) return Scissors;
    if (nome.includes('cor') || nome.includes('color')) return Palette;
    if (nome.includes('unha') || nome.includes('nail')) return Hand;
    return Star;
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'from-bolt-primary-400 to-bolt-primary-600',
      'from-bolt-secondary-400 to-bolt-secondary-600',
      'from-bolt-accent-400 to-bolt-accent-600',
      'from-pink-400 to-pink-600',
      'from-purple-400 to-purple-600',
      'from-indigo-400 to-indigo-600'
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner size={48} className="animate-spin text-bolt-primary-500 mb-4" />
        <p className="text-bolt-neutral-600">Carregando serviços...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <Star size={48} className="mx-auto mb-2" />
          <p className="text-lg font-medium">Ops! Algo deu errado</p>
        </div>
        <p className="text-bolt-neutral-600 mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-bolt-primary-500 text-white px-6 py-2 rounded-lg hover:bg-bolt-primary-600 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Escolha seu serviço</h2>
        <p className="text-bolt-neutral-600">Selecione o serviço que deseja agendar</p>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12">
          <Star size={48} className="mx-auto mb-4 text-bolt-neutral-300" />
          <p className="text-bolt-neutral-600">Nenhuma categoria de serviço encontrada</p>
        </div>
      ) : (
        categorias.map((categoria, index) => {
          const servicosCategoria = getServicosByCategoria(categoria.id);
          const IconComponent = getCategoryIcon(categoria.nome);
          const colorClass = getCategoryColor(index);

          if (servicosCategoria.length === 0) return null;

          return (
            <div key={categoria.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center mr-4`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-bolt-neutral-900">{categoria.nome}</h3>
                  {categoria.descricao && (
                    <p className="text-sm text-bolt-neutral-600">{categoria.descricao}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                {servicosCategoria.map((servico) => (
                  <button
                    key={servico.id}
                    onClick={() => onServiceSelect(servico)}
                    className="text-left p-4 border border-bolt-neutral-200 rounded-xl hover:border-bolt-primary-300 hover:bg-bolt-primary-50 transition-all card-hover"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-bolt-neutral-900 mb-1">
                          {servico.servicoPrestado}
                        </h4>
                        <p className="text-sm text-bolt-neutral-600 mb-2">
                          {servico.descricao}
                        </p>
                        {servico.empresa && (
                          <p className="text-xs text-bolt-neutral-500">
                            {servico.empresa.nome}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-bolt-primary-600">
                          R$ {servico.valorBase.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}

      {servicos.length === 0 && categorias.length > 0 && (
        <div className="text-center py-12">
          <Star size={48} className="mx-auto mb-4 text-bolt-neutral-300" />
          <p className="text-bolt-neutral-600">Nenhum serviço disponível no momento</p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;