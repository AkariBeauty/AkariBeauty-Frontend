import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import Routers from "./routes";

console.log("Iniciando aplicação...");

const rootEl = document.getElementById("root");

if (!rootEl) {
  console.error("Elemento root NÃO encontrado. Verifique seu index.html (div#root).");
} else {
  console.log("Elemento root encontrado, criando aplicação...");

  const root = ReactDOM.createRoot(rootEl);

  root.render(
    <React.StrictMode>
      {/* O BrowserRouter PRECISA envolver qualquer uso de <Routes/> */}
      <BrowserRouter>
        {/* Seu contexto de autenticação pode ficar dentro ou fora do Router;
           aqui mantemos dentro para ter acesso ao useLocation, se necessário */}
        <AuthProvider>
          <Routers />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );

  console.log("Aplicação renderizada com sucesso!");
}
