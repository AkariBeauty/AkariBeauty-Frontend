// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Routers from './routes'; // Importa seu arquivo de rotas (que você chamou de Routers)
import './index.css'; // Importa seu CSS global

console.log('Iniciando aplicação...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Elemento root não encontrado!');
  throw new Error('Elemento root não encontrado');
}

console.log('Elemento root encontrado, criando aplicação...');
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Routers /> {/* Renderiza seu componente principal de rotas */}
    </React.StrictMode>
  );
  console.log('Aplicação renderizada com sucesso!');
} catch (error) {
  console.error('Erro ao renderizar aplicação:', error);
}