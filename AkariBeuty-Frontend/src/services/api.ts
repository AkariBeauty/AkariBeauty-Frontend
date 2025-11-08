/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/Generic/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1/",
  timeout: 15000,
});

// Interceptador: injeta Authorization quando useAuth !== false
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const useAuth = (config as any).useAuth ?? true;

  if (useAuth && token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
