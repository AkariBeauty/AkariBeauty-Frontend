import axios from "axios";

// Ajuste a porta aqui via .env (Vite): VITE_API_BASE_URL=http://localhost:5000/api/v1
const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1/";

const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("akari_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("akari_user");
      localStorage.removeItem("akari_token");
      if (location.pathname !== "/login") location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
