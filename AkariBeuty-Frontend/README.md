# Akari Beauty - Frontend

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backend .NET rodando na porta 8080

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Build para produção
```bash
npm run build
npm run preview
```

## 🔧 Configuração

### Backend
O frontend está configurado para se conectar ao backend na porta 8080. 
Certifique-se de que o backend esteja rodando antes de executar o frontend.

### Variáveis de Ambiente
O sistema usa as seguintes configurações padrão:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Porta Frontend**: `5173` (Vite padrão)

## 📱 Funcionalidades

### Página Inicial (Home)
- **Hero Section**: Apresentação da empresa com call-to-action
- **Lista de Serviços**: Exibição de todos os serviços disponíveis
- **Filtro por Categoria**: Filtragem de serviços por categoria
- **Cards de Serviço**: Informações detalhadas de cada serviço
- **Seção de Features**: Destaque das vantagens da empresa
- **Call-to-Action**: Redirecionamento para login/agendamento

### Integração com Backend
- **API de Serviços**: `/api/v1/servico`
- **API de Categorias**: `/api/v1/categoriaservico`
- **Autenticação JWT**: Suporte a tokens Bearer
- **Tratamento de Erros**: Interceptors para respostas da API

## 🎨 Design System

### Cores
- **Primary**: Rosa (#ec4899)
- **Secondary**: Roxo (#a855f7)
- **Neutral**: Tons de cinza
- **Success**: Verde
- **Warning**: Amarelo
- **Error**: Vermelho

### Componentes
- **ServiceCard**: Card para exibição de serviços
- **CategoryFilter**: Filtro por categoria
- **HeroSection**: Seção principal da página
- **LoadingSpinner**: Indicador de carregamento
- **Notification**: Sistema de notificações

## 🔌 Estrutura da API

### Endpoints Principais
```typescript
// Serviços
GET /api/v1/servico - Lista todos os serviços
GET /api/v1/servico/{id} - Busca serviço por ID

// Categorias
GET /api/v1/categoriaservico - Lista todas as categorias
GET /api/v1/categoriaservico/{id} - Busca categoria por ID
```

### Modelos de Dados
```typescript
interface Servico {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number;
  categoriaId: number;
  empresaId: number;
  ativo: boolean;
}

interface CategoriaServico {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
}
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] Sistema de agendamento completo
- [ ] Dashboard do cliente
- [ ] Perfil do usuário
- [ ] Histórico de agendamentos
- [ ] Sistema de avaliações
- [ ] Notificações em tempo real

### Melhorias Técnicas
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] PWA (Progressive Web App)
- [ ] Otimização de performance
- [ ] SEO e meta tags

## 📝 Notas de Desenvolvimento

### Tecnologias Utilizadas
- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **Axios** para requisições HTTP
- **React Router** para navegação
- **Phosphor Icons** para ícones

### Padrões de Código
- Componentes funcionais com hooks
- TypeScript para tipagem
- CSS modules com Tailwind
- Arquitetura de serviços para API
- Tratamento de erros centralizado

## 🐛 Solução de Problemas

### Erro de CORS
Se encontrar erros de CORS, verifique se o backend está configurado corretamente:
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

### Erro de Conexão com API
- Verifique se o backend está rodando na porta 8080
- Confirme se as rotas da API estão funcionando
- Teste os endpoints no Swagger: `http://localhost:8080/swagger`

### Problemas de Estilo
- Verifique se o Tailwind CSS está configurado corretamente
- Confirme se o arquivo `postcss.config.js` existe
- Limpe o cache do navegador se necessário

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- Documentação da API no Swagger
- Logs do console do navegador
- Logs do backend
- Issues do repositório
