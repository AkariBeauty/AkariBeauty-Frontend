/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
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

  type DecodedToken = {
    identifier?: string;
    clienteId?: string;
    sub?: string;
    type?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };

  const resolveIdentifier = useCallback((decoded?: DecodedToken | null) => {
    if (!decoded) return "";
    const candidate = decoded.clienteId ?? decoded.identifier ?? decoded.sub;
    return typeof candidate === "string" ? candidate : String(candidate ?? "");
  }, []);

  const decodeToken = useCallback((token: string): DecodedToken | null => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
      const json = atob(padded);
      return JSON.parse(json);
    } catch (error) {
      console.error("Falha ao decodificar token", error);
      return null;
    }
  }, []);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("akari_user");
      const token = localStorage.getItem("akari_token");
      if (savedUser) {
        let parsedUser = JSON.parse(savedUser) as User;
        if ((!parsedUser?.id || parsedUser.id === "") && token) {
          const decoded = decodeToken(token);
          const identifier = resolveIdentifier(decoded);
          if (identifier) {
            parsedUser = { ...parsedUser, id: identifier };
            localStorage.setItem("akari_user", JSON.stringify(parsedUser));
          }
        }
        setUser(parsedUser);
      } else if (token) {
        const decoded = decodeToken(token);
        const identifier = resolveIdentifier(decoded);
        if (identifier) {
          const fallbackUser: User = {
            id: identifier,
            name: (decoded?.name as string) ?? "Cliente",
            email: (decoded?.email as string) ?? "",
            phone: "",
            token,
          };
          setUser(fallbackUser);
          localStorage.setItem("akari_user", JSON.stringify(fallbackUser));
        }
      }
    } catch {
      localStorage.removeItem("akari_user");
      localStorage.removeItem("akari_token");
    } finally {
      setIsLoading(false);
    }
  }, [decodeToken, resolveIdentifier]);

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
      const decoded = decodeToken(token);
      const identifier = resolveIdentifier(decoded);
      const loggedUser: User = {
        id: identifier,
        name: (decoded?.name as string) ?? (decoded?.type as string) ?? email,
        email: (decoded?.email as string) ?? email,
        phone: "",
        token,
      };
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
