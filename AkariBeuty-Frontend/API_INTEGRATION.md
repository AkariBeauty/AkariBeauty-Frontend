# 🔗 Integração com APIs - AkariBeauty Frontend

## 📋 Visão Geral

Este documento explica como o frontend se conecta com as APIs do backend .NET para realizar operações reais em vez de usar dados mockados.

## 🚀 Configuração da API

### Base URL
```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: 'https://localhost:44317/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Autenticação
```typescript
// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('akari_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📊 Endpoints Implementados

### 1. Dashboard do Cliente

#### Estatísticas
```typescript
GET /cliente/dashboard/stats
```
**Resposta esperada:**
```json
{
  "totalAgendamentos": 12,
  "totalHoras": 24,
  "totalFavoritos": 8
}
```

#### Próximos Agendamentos
```typescript
GET /cliente/agendamentos/proximos
```
**Resposta esperada:**
```json
[
  {
    "id": "1",
    "service": {
      "id": "1",
      "name": "Corte + Escova",
      "description": "Corte e escova",
      "duration": 90,
      "price": 120,
      "category": "Cabelo"
    },
    "professional": {
      "id": "1",
      "name": "Ana Silva",
      "specialties": ["Corte", "Escova"],
      "rating": 4.9
    },
    "date": "2024-01-15",
    "time": "14:00",
    "status": "CONFIRMADO"
  }
]
```

#### Serviços Favoritos
```typescript
GET /cliente/servicos/favoritos
```
**Resposta esperada:**
```json
[
  {
    "name": "Corte de Cabelo",
    "count": 5,
    "rating": 4.9
  }
]
```

### 2. Agendamentos

#### Listar Todos
```typescript
GET /cliente/agendamentos
```

#### Cancelar Agendamento
```typescript
PATCH /cliente/agendamentos/{id}/cancelar
```

### 3. Perfil do Cliente

#### Estatísticas do Perfil
```typescript
GET /cliente/perfil/estatisticas
```
**Resposta esperada:**
```json
{
  "id": "1",
  "name": "Marcos Oliveira",
  "email": "marcos@email.com",
  "phone": "(21) 98765-4321",
  "memberSince": "2023-06-15",
  "totalAppointments": 12,
  "favoriteServices": ["Corte de Cabelo", "Manicure"],
  "averageRating": 4.9
}
```

#### Atualizar Perfil
```typescript
PUT /cliente/perfil
```
**Body:**
```json
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "phone": "(21) 98765-4321"
}
```

#### Alterar Senha
```typescript
PUT /cliente/perfil/senha
```
**Body:**
```json
{
  "currentPassword": "senha_atual",
  "newPassword": "nova_senha"
}
```

### 4. Agendamento de Novos Serviços

#### Serviços Disponíveis
```typescript
GET /cliente/servicos/disponiveis
```

#### Profissionais por Serviço
```typescript
GET /cliente/servicos/{serviceId}/profissionais
```

#### Horários Disponíveis
```typescript
GET /cliente/servicos/{serviceId}/profissionais/{professionalId}/horarios?date=2024-01-15
```

#### Criar Agendamento
```typescript
POST /cliente/agendamentos
```
**Body:**
```json
{
  "serviceId": "1",
  "professionalId": "1",
  "date": "2024-01-15",
  "time": "14:00",
  "notes": "Observações opcionais"
}
```

## 🔧 Implementação no Frontend

### Serviço Centralizado
```typescript
// src/services/clienteService.ts
export const clienteService = {
  async getDashboardStats(): Promise<ClienteStats> {
    const response = await api.get('/cliente/dashboard/stats');
    return response.data;
  },
  
  async getAppointments(): Promise<ClienteAppointment[]> {
    const response = await api.get('/cliente/agendamentos');
    return response.data;
  },
  
  // ... outros métodos
};
```

### Uso nos Componentes
```typescript
// src/pages/Client/Dashboard.tsx
const loadDashboardData = async () => {
  try {
    const statsData = await clienteService.getDashboardStats();
    setStats(statsData);
    
    const appointmentsData = await clienteService.getUpcomingAppointments();
    setNextAppointments(appointmentsData);
    
    const favoritesData = await clienteService.getFavoriteServices();
    setFavoriteServices(favoritesData);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
};
```

## 🚨 Tratamento de Erros

### Interceptor de Resposta
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('akari_token');
      localStorage.removeItem('akari_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Tratamento nos Componentes
```typescript
try {
  const data = await clienteService.getData();
  setData(data);
} catch (error) {
  setNotification({
    isVisible: true,
    type: 'error',
    message: 'Erro ao carregar dados',
    onClose: () => setNotification({ ...notification, isVisible: false })
  });
}
```

## 📱 Estados de Loading

### Implementação
```typescript
const [isLoading, setIsLoading] = useState(true);

const loadData = async () => {
  try {
    setIsLoading(true);
    const data = await clienteService.getData();
    setData(data);
  } finally {
    setIsLoading(false);
  }
};

if (isLoading) {
  return <LoadingSpinner />;
}
```

## 🔐 Autenticação

### Login
```typescript
// src/pages/Login/Login.tsx
const loginService = async () => {
  try {
    const response = await api.post('/cliente/login', {
      login: email,
      password: password
    });
    
    if (response.data.token) {
      localStorage.setItem('akari_token', response.data.token);
      localStorage.setItem('akari_user', JSON.stringify(response.data.user));
      navigate('/cliente/dashboard');
    }
  } catch (error) {
    setModalError(true);
  }
};
```

### Logout
```typescript
const logout = () => {
  localStorage.removeItem('akari_token');
  localStorage.removeItem('akari_user');
  navigate('/login');
};
```

## 🧪 Testando as APIs

### 1. Verificar Backend
- Certifique-se de que o backend .NET está rodando em `https://localhost:44317`
- Verifique se as rotas estão configuradas corretamente

### 2. Testar Endpoints
```bash
# Testar endpoint de estatísticas
curl -X GET "https://localhost:44317/api/v1/cliente/dashboard/stats" \
  -H "Authorization: Bearer SEU_TOKEN"

# Testar endpoint de agendamentos
curl -X GET "https://localhost:44317/api/v1/cliente/agendamentos" \
  -H "Authorization: Bearer SEU_TOKEN"
```

### 3. Verificar Console do Navegador
- Abra o DevTools (F12)
- Vá para a aba Console
- Verifique se há erros de CORS ou de conexão

## 🐛 Solução de Problemas

### Erro de CORS
```csharp
// No backend .NET, adicione:
app.UseCors(builder => {
  builder.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader();
});
```

### Erro de SSL
- Se estiver usando HTTPS, certifique-se de que o certificado está válido
- Ou use HTTP para desenvolvimento: `http://localhost:5000`

### Erro de Rota não encontrada
- Verifique se as rotas estão definidas no `Program.cs` ou `Startup.cs`
- Confirme se os controladores estão sendo carregados

## 📚 Próximos Passos

1. **Implementar Backend**: Criar os controladores e endpoints no .NET
2. **Configurar Banco**: Conectar as APIs com o banco PostgreSQL
3. **Testar Integração**: Verificar se os dados estão sendo carregados corretamente
4. **Implementar Cache**: Adicionar cache para melhorar performance
5. **Monitoramento**: Implementar logs e métricas de uso

## 🔗 Links Úteis

- [Documentação do Axios](https://axios-http.com/)
- [React Query para Cache](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ASP.NET Core Web API](https://docs.microsoft.com/en-us/aspnet/core/web-api/)
