// src/pages/Auth/LoginClient.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeSlash, User, ArrowRight } from '@phosphor-icons/react';

const LoginClient: React.FC = () => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(loginValue, password);
      if (success) {
        navigate('/cliente/dashboard');
      } else {
        setError('Email ou senha incorretos. Tente novamente.');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bolt-primary-50 to-bolt-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-bolt-primary-500 rounded-full flex items-center justify-center mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-bolt-neutral-900">
            Área do Cliente
          </h2>
          <p className="mt-2 text-bolt-neutral-600">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-bolt-neutral-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="login"
                  name="login"
                  type="login"
                  autoComplete="login"
                  required
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  className="w-full px-4 py-3 border border-bolt-neutral-300 rounded-lg focus:ring-2 focus:ring-bolt-primary-500 focus:border-transparent transition-colors"
                  placeholder="Usuário"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-bolt-neutral-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-bolt-neutral-300 rounded-lg focus:ring-2 focus:ring-bolt-primary-500 focus:border-transparent transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-bolt-neutral-400 hover:text-bolt-neutral-600"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-bolt-primary-500 hover:bg-bolt-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Entrar
                <ArrowRight size={20} className="ml-2" />
              </>
            )}
          </button>

          Demo Credentials
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              💡 Credenciais de Demonstração:
            </p>
            <p className="text-xs text-blue-700">
              Email: <span className="font-mono">usuario@akari.com</span><br />
              Senha: <span className="font-mono">123456</span>
            </p>
          </div>
        </form>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-bolt-neutral-600">
            Não tem uma conta?{' '}
            <Link
              to="/login/singupCliente"
              className="font-medium text-bolt-primary-600 hover:text-bolt-primary-500 transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
          <Link
            to="/"
            className="text-sm text-bolt-neutral-500 hover:text-bolt-neutral-700 transition-colors"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;