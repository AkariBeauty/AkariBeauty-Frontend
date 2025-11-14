import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  House, 
  User, 
  Calendar, 
  BookOpen, 
  SignIn, 
  UserPlus,
  Building,
  List,
  X
} from '@phosphor-icons/react';

export default function MainHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? '/cliente/dashboard' : '/'} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-bolt-primary-500 to-bolt-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold text-bolt-neutral-800">Akari Beauty</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' || location.pathname === '/home'
                  ? 'text-bolt-primary-600 bg-bolt-primary-50'
                  : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
              }`}
            >
              <House size={20} />
              <span>Início</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/cliente/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/cliente/dashboard')
                      ? 'text-bolt-primary-600 bg-bolt-primary-50'
                      : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                  }`}
                >
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/cliente/booking"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/cliente/booking')
                      ? 'text-bolt-primary-600 bg-bolt-primary-50'
                      : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                  }`}
                >
                  <BookOpen size={20} />
                  <span>Agendar</span>
                </Link>

                <Link
                  to="/cliente/agendamentos"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/cliente/agendamentos')
                      ? 'text-bolt-primary-600 bg-bolt-primary-50'
                      : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                  }`}
                >
                  <Calendar size={20} />
                  <span>Meus Agendamentos</span>
                </Link>

                <Link
                  to="/cliente/profile"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname.startsWith('/cliente/profile')
                      ? 'text-bolt-primary-600 bg-bolt-primary-50'
                      : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                  }`}
                >
                  <User size={20} />
                  <span>Perfil</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <SignIn size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-bolt-neutral-600 hover:text-bolt-primary-600 transition-colors"
                >
                  <SignIn size={20} />
                  <span>Login</span>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-bolt-primary-500 text-white rounded-lg hover:bg-bolt-primary-600 transition-colors"
                >
                  <User size={20} />
                  <span>Área do Cliente</span>
                </Link>

                <Link
                  to="/login/singupCliente"
                  className="flex items-center space-x-2 px-4 py-2 border border-bolt-primary-500 text-bolt-primary-600 rounded-lg hover:bg-bolt-primary-50 transition-colors"
                >
                  <UserPlus size={20} />
                  <span>Cadastrar</span>
                </Link>

                <Link
                  to="/login/singupEmpresa"
                  className="flex items-center space-x-2 px-4 py-2 border border-bolt-secondary-500 text-bolt-secondary-600 rounded-lg hover:bg-bolt-secondary-50 transition-colors"
                >
                  <Building size={20} />
                  <span>Empresa</span>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-bolt-neutral-200">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' || location.pathname === '/home'
                    ? 'text-bolt-primary-600 bg-bolt-primary-50'
                    : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                }`}
              >
                <House size={20} />
                <span>Início</span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/cliente/dashboard"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith('/cliente/dashboard')
                        ? 'text-bolt-primary-600 bg-bolt-primary-50'
                        : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                    }`}
                  >
                    <User size={20} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/cliente/booking"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith('/cliente/booking')
                        ? 'text-bolt-primary-600 bg-bolt-primary-50'
                        : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                    }`}
                  >
                    <BookOpen size={20} />
                    <span>Agendar</span>
                  </Link>

                  <Link
                    to="/cliente/agendamentos"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith('/cliente/agendamentos')
                        ? 'text-bolt-primary-600 bg-bolt-primary-50'
                        : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                    }`}
                  >
                    <Calendar size={20} />
                    <span>Meus Agendamentos</span>
                  </Link>

                  <Link
                    to="/cliente/profile"
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith('/cliente/profile')
                        ? 'text-bolt-primary-600 bg-bolt-primary-50'
                        : 'text-bolt-neutral-600 hover:text-bolt-primary-600 hover:bg-bolt-primary-50'
                    }`}
                  >
                    <User size={20} />
                    <span>Perfil</span>
                  </Link>

                  <button
                    onClick={() => { handleLogout(); closeMobileMenu(); }}
                    className="flex items-center space-x-3 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-left"
                  >
                    <SignIn size={20} />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-3 py-2 text-bolt-neutral-600 hover:text-bolt-primary-600 transition-colors"
                  >
                    <SignIn size={20} />
                    <span>Login</span>
                  </Link>

                  <Link
                    to="/login-bolt"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-3 py-2 bg-bolt-primary-500 text-white rounded-lg hover:bg-bolt-primary-600 transition-colors"
                  >
                    <User size={20} />
                    <span>Área do Cliente</span>
                  </Link>

                  <Link
                    to="/login/singupCliente"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-3 py-2 border border-bolt-primary-500 text-bolt-primary-600 rounded-lg hover:bg-bolt-primary-50 transition-colors"
                  >
                    <UserPlus size={20} />
                    <span>Cadastrar Cliente</span>
                  </Link>

                  <Link
                    to="/login/singupEmpresa"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-3 py-2 border border-bolt-secondary-500 text-bolt-secondary-600 rounded-lg hover:bg-bolt-secondary-50 transition-colors"
                  >
                    <Building size={20} />
                    <span>Cadastrar Empresa</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
