import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../types";
import BaseService from "../services/Generic/BaseService";

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
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface Props { children: ReactNode; }

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("akari_user");
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("akari_user");
      localStorage.removeItem("akari_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const service = new BaseService({
        method: "post",
        url: "cliente/login",
        data: { login: email, password },
        auth: false,
      });
      const { token } = await service.request<{ token: string }>();
      if (!token) throw new Error("Token ausente");

      localStorage.setItem("akari_token", token);
      const loggedUser: User = { email } as User; // ajuste se quiser salvar mais dados
      localStorage.setItem("akari_user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      return true;
    } catch (e) {
      console.error("AuthProvider: Erro no login", e);
      return false;
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("akari_user");
    localStorage.removeItem("akari_token");
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...userData };
    setUser(updated);
    localStorage.setItem("akari_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
