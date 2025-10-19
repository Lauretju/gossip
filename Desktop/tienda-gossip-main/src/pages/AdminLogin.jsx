import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
      console.error('Login error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
      padding: '20px',
      fontFamily: "'Quicksand', sans-serif"
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        padding: '40px 30px',
        boxShadow: '0 20px 40px rgba(255, 182, 193, 0.3)',
        border: '3px solid #ffb6c1',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        {/* Logo/Icono */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #ffb6c1 0%, #ff91a4 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ffd1dc',
          boxShadow: '0 8px 20px rgba(255, 182, 193, 0.4)'
        }}>
          <span style={{ fontSize: '2rem', color: 'white' }}>💌</span>
        </div>

        {/* Título */}
        <h2 style={{
          margin: '0 0 10px 0',
          fontSize: '2.2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontFamily: "'Quicksand', sans-serif"
        }}>
          Acceso Admin
        </h2>
        
        <p style={{
          color: '#ff6b9d',
          margin: '0 0 30px 0',
          fontSize: '1rem',
          opacity: 0.8
        }}>
          Panel de gestión Gossip Cake
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              color: 'white',
              padding: '15px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #ff5252',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'center'
            }}>
              <span>⚠️</span>
              {error}
            </div>
          )}

          {/* Campo Email */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#c71585',
              fontSize: '0.95rem'
            }}>
               Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #ffd1dc',
                borderRadius: '15px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontFamily: "'Quicksand', sans-serif"
              }}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff91a4';
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 145, 164, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ffd1dc';
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Campo Password */}
          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#c71585',
              fontSize: '0.95rem'
            }}>
               Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #ffd1dc',
                borderRadius: '15px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontFamily: "'Quicksand', sans-serif"
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff91a4';
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 145, 164, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ffd1dc';
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading 
                ? 'linear-gradient(135deg, #ffb6c1 0%, #ff91a4 100%)' 
                : 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
              fontFamily: "'Quicksand', sans-serif",
              boxShadow: '0 8px 20px rgba(255, 107, 157, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 25px rgba(255, 107, 157, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(255, 107, 157, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Iniciando Sesión...
              </>
            ) : (
              <>
               Iniciar Sesión
              </>
            )}
          </button>
        </form>

        {/* Footer decorativo */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: 'rgba(255, 240, 245, 0.5)',
          borderRadius: '12px',
          border: '1px dashed #ffb6c1'
        }}>
          <p style={{
            margin: 0,
            color: '#d63384',
            fontSize: '0.85rem',
            opacity: 0.7
          }}>
             Acceso exclusivo para administradores
          </p>
        </div>
      </div>

      {/* Estilos globales */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive */
          @media (max-width: 480px) {
            .login-container {
              padding: 30px 20px !important;
              margin: 20px !important;
            }
            
            .login-title {
              font-size: 1.8rem !important;
            }
            
            .login-input {
              padding: 12px 16px !important;
            }
            
            .login-button {
              padding: 14px !important;
              font-size: 1rem !important;
            }
          }

          /* Efectos de focus mejorados */
          input:focus {
            outline: none !important;
          }

          /* Placeholder styling */
          ::placeholder {
            color: #ffb6c1 !important;
            opacity: 0.7 !important;
          }

          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #fff0f5;
          }

          ::-webkit-scrollbar-thumb {
            background: #ffb6c1;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: #ff91a4;
          }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;