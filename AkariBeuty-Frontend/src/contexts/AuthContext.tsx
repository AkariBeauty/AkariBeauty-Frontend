// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types'; // Importe do seu arquivo de types/index.ts

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Inicializando...');

    try {
      const savedUser = localStorage.getItem('akari_user');
      if (savedUser) {
        console.log('AuthProvider: Usuário encontrado no localStorage');
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } else {
        console.log('AuthProvider: Nenhum usuário no localStorage');
      }
    }
    catch (error) {
      console.error('AuthProvider: Erro ao carregar usuário do localStorage:', error);
      localStorage.removeItem('akari_user');
    } finally {
      setIsLoading(false);
      console.log('AuthProvider: Inicialização concluída');
    }
  }, []);

  // ESTE É O MÉTODO QUE VOCÊ VAI LIGAR À SUA API REAL DE AUTENTICAÇÃO
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthProvider: Tentativa de login para:', email);
    setIsLoading(true);

    try {
      // --- SIMULAÇÃO DE LOGIN COM DADOS MOCKADOS ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API

      if (email === 'usuario@akari.com' && password === '123456') {
        const userData: User = {
          id: '1',
          name: 'Maria Silva',
          email: email,
          phone: '(11) 99653-3540'
        };
        setUser(userData);
        localStorage.setItem('akari_user', JSON.stringify(userData));
        console.log('AuthProvider: Login bem-sucedido (mocked)');
        return true;
      }

      console.log('AuthProvider: Credenciais inválidas (mocked)');
      return false;
    } catch (error) {
      console.error('AuthProvider: Erro no login (mocked):', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthProvider: Fazendo logout');
    setUser(null);
    localStorage.removeItem('akari_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('akari_user', JSON.stringify(updatedUser));
      console.log('AuthProvider: Usuário atualizado (mocked)');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};