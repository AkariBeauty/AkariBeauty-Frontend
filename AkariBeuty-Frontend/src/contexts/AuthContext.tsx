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
      // --- SIMULAÇÃO DE LOGIN COM DADOS REAIS DO BANCO ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API

      // Credenciais reais do banco de dados (baseado no pgAdmin)
      const validCredentials = [
        { login: 'marcos', password: 'abcd', name: 'Marcos Oliveira', phone: '(21) 98765-4321' },
        { login: 'ana.costa', password: 'senha123', name: 'Ana Costa', phone: '(31) 99876-5432' },
        { login: 'joana@gmail.com', password: '1234', name: 'Joana Silva', phone: '(11) 91234-5678' }
      ];

      const userCredential = validCredentials.find(
        cred => cred.login === email && cred.password === password
      );

      if (userCredential) {
        const userData: User = {
          id: Date.now().toString(), // ID temporário
          name: userCredential.name,
          email: email,
          phone: userCredential.phone
        };
        setUser(userData);
        localStorage.setItem('akari_user', JSON.stringify(userData));
        console.log('AuthProvider: Login bem-sucedido com credenciais reais');
        return true;
      }

      console.log('AuthProvider: Credenciais inválidas');
      return false;
    } catch (error) {
      console.error('AuthProvider: Erro no login:', error);
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