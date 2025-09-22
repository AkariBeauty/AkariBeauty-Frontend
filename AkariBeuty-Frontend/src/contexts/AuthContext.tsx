// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types'; // Importe do seu arquivo de types/index.ts
import api from '../services/api'; // Importar a instância da API

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
      const response = await api.patch('/Cliente/login', {
        Login: email,
        Senha: password,
      });

      if (response.status === 200 && response.data && response.data.token) {
        // Supondo que a API retorna o token e, talvez, dados do usuário
        // Você precisará ajustar a estrutura do 'User' para incluir o token e outros dados reais
        const userData: User = {
          id: 'temp-id', // O ID real viria do backend
          name: 'Nome do Cliente', // O nome real viria do backend
          email: email,
          phone: '(XX) XXXXX-XXXX', // O telefone real viria do backend
          token: response.data.token, // Salvar o token
        };

        setUser(userData);
        localStorage.setItem('akari_user', JSON.stringify(userData));
        localStorage.setItem('akari_token', response.data.token); // Salvar o token separadamente se preferir
        console.log('AuthProvider: Login bem-sucedido com credenciais reais');
        return true;
      }

      console.log('AuthProvider: Credenciais inválidas ou resposta inesperada');
      return false;
    } catch (error: any) {
      console.error('AuthProvider: Erro no login:', error);
      // Pode ser útil verificar error.response?.status para tratar 401 especificamente
      if (error?.response?.status === 401) {
        console.log('AuthProvider: Credenciais inválidas (401)');
      } else {
        console.log('AuthProvider: Erro genérico no login');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('AuthProvider: Fazendo logout');
    setUser(null);
    localStorage.removeItem('akari_user');
    localStorage.removeItem('akari_token'); // Remover o token ao fazer logout
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