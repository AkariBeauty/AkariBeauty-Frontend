import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkle, Users, Star, Clock } from '@phosphor-icons/react';
import HeroSection from '../../components/UI/HeroSection';
import CategoryFilter from '../../components/UI/CategoryFilter';
import ServiceCard from '../../components/UI/ServiceCard';
import { servicoService, Servico, CategoriaServico } from '../../services/servicoService';

export default function Home() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
      setError('Erro ao carregar os dados. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handleServiceSelect = (servico: Servico) => {
    // Redirecionar para o wizard de agendamento
    navigate('/booking', { state: { selectedService: servico } });
  };

  const filteredServicos = selectedCategory 
    ? servicos.filter(servico => servico.categoriaId === selectedCategory)
    : servicos;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bolt-primary-500 mx-auto mb-4"></div>
          <p className="text-bolt-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-bolt-primary-500 text-white px-6 py-3 rounded-xl hover:bg-bolt-primary-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-white to-bolt-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-bolt-primary-100 text-bolt-primary-700 text-sm font-medium mb-6">
              <Sparkle size={16} className="mr-2" weight="fill" />
              Nossos Serviços
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-bolt-neutral-800 mb-6">
              Descubra o que podemos fazer por você
            </h2>
            <p className="text-xl text-bolt-neutral-600 max-w-3xl mx-auto">
              Oferecemos uma ampla variedade de serviços de beleza para atender todas as suas necessidades
            </p>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categorias}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServicos.map((servico) => (
              <ServiceCard
                key={servico.id}
                servico={servico}
                onSelect={handleServiceSelect}
              />
            ))}
          </div>

          {filteredServicos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-bolt-neutral-500 text-lg">
                Nenhum serviço encontrado para esta categoria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-bolt-neutral-800 mb-6">
              Por que escolher a Akari Beauty?
            </h2>
            <p className="text-xl text-bolt-neutral-600 max-w-3xl mx-auto">
              Oferecemos uma experiência única e personalizada para cuidar da sua beleza
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-white" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-bolt-neutral-800 mb-4">
                Profissionais Qualificados
              </h3>
              <p className="text-bolt-neutral-600">
                Nossa equipe é composta por profissionais experientes e certificados
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock size={32} className="text-white" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-bolt-neutral-800 mb-4">
                Agendamento Flexível
              </h3>
              <p className="text-bolt-neutral-600">
                Agende seus horários de forma rápida e conveniente
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-white" weight="fill" />
              </div>
              <h3 className="text-xl font-bold text-bolt-neutral-800 mb-4">
                Qualidade Garantida
              </h3>
              <p className="text-bolt-neutral-600">
                Comprometimento com a excelência em todos os nossos serviços
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Agende seu primeiro serviço e descubra a diferença que fazemos na sua autoestima
          </p>
          <button
            onClick={() => navigate('/login-bolt')}
            className="bg-white text-bolt-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
          >
            Começar Agora
          </button>
        </div>
      </section>
    </div>
  );
}
