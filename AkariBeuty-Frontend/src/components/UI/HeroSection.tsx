import React from 'react';
import { ArrowRight, Sparkle, Heart, Clock } from '@phosphor-icons/react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-bolt-primary-50 via-white to-bolt-secondary-50 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-bolt-primary-200 to-bolt-secondary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-bolt-secondary-200 to-bolt-primary-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-bolt-primary-100 text-bolt-primary-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkle size={16} className="mr-2" weight="fill" />
            Beleza com um clique. Conexões que transformam.
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-bolt-neutral-800 mb-6 leading-tight">
            Encontre os{' '}
            <span className="bg-gradient-to-r from-bolt-primary-600 to-bolt-secondary-600 bg-clip-text text-transparent">
              melhores profissionais
            </span>
            <br />
            para cuidar da sua beleza
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-bolt-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Agende seu horário com facilidade e se inspire com uma vitrine cheia de estilo e autoestima. 
            Se você vive da beleza ou não abre mão de se cuidar, aqui é o seu lugar.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center text-bolt-neutral-600">
              <Clock size={20} className="mr-2 text-bolt-primary-500" />
              <span>Agendamento rápido</span>
            </div>
            <div className="flex items-center text-bolt-neutral-600">
              <Heart size={20} className="mr-2 text-bolt-primary-500" />
              <span>Profissionais qualificados</span>
            </div>
            <div className="flex items-center text-bolt-neutral-600">
              <Sparkle size={20} className="mr-2 text-bolt-primary-500" />
              <span>Experiência única</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-bolt-primary-500 to-bolt-secondary-500 text-white font-semibold py-4 px-8 rounded-xl hover:from-bolt-primary-600 hover:to-bolt-secondary-600 transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl">
              <span>Começar Agora</span>
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform duration-300" 
              />
            </button>
            
            <button className="bg-white text-bolt-neutral-700 font-semibold py-4 px-8 rounded-xl hover:bg-bolt-primary-50 transition-all duration-300 border border-bolt-neutral-200 shadow-sm hover:shadow-md">
              Ver Serviços
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
