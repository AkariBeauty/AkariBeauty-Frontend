import React from 'react';
import { Link } from 'react-router-dom';
import { 
  House, 
  User, 
  Calendar, 
  BookOpen, 
  Phone, 
  Envelope, 
  MapPin,
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
} from '@phosphor-icons/react';


export default function MainFooter() {
  return (
    <footer className="bg-bolt-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold">Akari Beauty</span>
            </Link>
            <p className="text-bolt-neutral-300 mb-6 max-w-md">
              Transformando sua autoestima através de serviços de beleza de qualidade. 
              Agende seu horário e descubra a diferença que fazemos na sua vida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-bolt-neutral-400 hover:text-bolt-primary-400 transition-colors">
                <InstagramLogo size={24} />
              </a>
              <a href="#" className="text-bolt-neutral-400 hover:text-bolt-primary-400 transition-colors">
                <FacebookLogo size={24} />
              </a>
              <a href="#" className="text-bolt-neutral-400 hover:text-bolt-primary-400 transition-colors">
                <TwitterLogo size={24} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center space-x-2 text-bolt-neutral-300 hover:text-bolt-primary-400 transition-colors">
                  <House size={16} />
                  <span>Início</span>
                </Link>
              </li>
              <li>
                <Link to="/cliente/booking" className="flex items-center space-x-2 text-bolt-neutral-300 hover:text-bolt-primary-400 transition-colors">
                  <BookOpen size={16} />
                  <span>Agendar Serviço</span>
                </Link>
              </li>
              <li>
                <Link to="/cliente/appointments" className="flex items-center space-x-2 text-bolt-neutral-300 hover:text-bolt-primary-400 transition-colors">
                  <Calendar size={16} />
                  <span>Meus Agendamentos</span>
                </Link>
              </li>
              <li>
                <Link to="/cliente/profile" className="flex items-center space-x-2 text-bolt-neutral-300 hover:text-bolt-primary-400 transition-colors">
                  <User size={16} />
                  <span>Meu Perfil</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-bolt-neutral-300">
                <Phone size={16} className="text-bolt-primary-400" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-2 text-bolt-neutral-300">
                <Envelope size={16} className="text-bolt-primary-400" />
                <span>contato@akaribeauty.com</span>
              </li>
              <li className="flex items-center space-x-2 text-bolt-neutral-300">
                <MapPin size={16} className="text-bolt-primary-400" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha de Separação */}
        <div className="border-t border-bolt-neutral-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-bolt-neutral-400 text-sm">
              © 2024 Akari Beauty. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/login" className="text-bolt-neutral-400 hover:text-bolt-primary-400 text-sm transition-colors">
                Login
              </Link>
              <Link to="/login-bolt" className="text-bolt-neutral-400 hover:text-bolt-primary-400 text-sm transition-colors">
                Área do Cliente
              </Link>
              <Link to="/login/singupCliente" className="text-bolt-neutral-400 hover:text-bolt-primary-400 text-sm transition-colors">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

