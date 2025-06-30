// src/pages/Login.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importe Link para navegação

const Login: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1>Sua Página de Login Original</h1>
      <p>Este é um placeholder. Por favor, restaure o conteúdo original do seu Login.tsx aqui.</p>
      <div style={{ marginTop: '20px' }}>
        <p>
          Para acessar o novo módulo de cliente AkariBeauty,
          <Link to="/login-bolt" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '5px' }}>clique aqui</Link>.
        </p>
        <p style={{ marginTop: '10px' }}>
          Para ir para a página Home,
          <Link to="/" style={{ color: 'blue', textDecoration: 'underline', marginLeft: '5px' }}>clique aqui</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;