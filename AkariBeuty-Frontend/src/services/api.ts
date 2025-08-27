import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'https://localhost:44317/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('akari_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('akari_token');
      localStorage.removeItem('akari_user');
      window.location.href = '/login-bolt';
    }
    return Promise.reject(error);
  }
);

export default api;
