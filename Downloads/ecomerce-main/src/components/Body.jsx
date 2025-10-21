import React from 'react';
import { Link } from 'react-router-dom';

export default function Body() {
  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          width: "100%",
          overflow: "hidden",
          padding: "0",
          margin: "0",
        }}
      >
        <img
          src="/img/heddd.svg"
          alt="header"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </section>

      {/* Contenido principal */}
      <main
        style={{
          marginTop: 0,
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "1200px",
          padding: '0 1rem'
        }}
      >
        {/* Bienvenida */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'linear-gradient(135deg, #f8bbd0 0%, #f48fb1 100%)',
          borderRadius: '20px',
          margin: '2rem 0',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎂 Bienvenida a Gossip Cake
          </h1>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            opacity: 0.9
          }}>
            Los postres más deliciosos hechos con amor y dedicación
          </p>
          <Link
            to="/productos"
            style={{
              display: 'inline-block',
              backgroundColor: '#ffb6c1', // Rosa pastel
              color: '#ff6b9d', // Texto en rosa oscuro
              padding: '15px 30px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(255, 182, 193, 0.4)',
              transition: 'all 0.3s ease',
              border: '2px solid #ff91a4'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 182, 193, 0.6)';
              e.target.style.backgroundColor = '#ff91a4';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(255, 182, 193, 0.4)';
              e.target.style.backgroundColor = '#ffb6c1';
              e.target.style.color = '#ff6b9d';
            }}
          >
            Ver Nuestros Productos 🍰
          </Link>
        </div>

        {/* Características */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          margin: '4rem 0'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)', // Rosa pastel
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(255, 182, 193, 0.3)',
            border: '2px solid #ffb6c1',
            transition: 'all 0.4s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) rotate(2deg)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 182, 193, 0.5)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 182, 193, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)';
          }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              transition: 'transform 0.3s ease'
            }}>🎨</div>
            <h3 style={{ 
              color: '#ff6b9d', 
              marginBottom: '1rem',
              fontSize: '1.3rem',
              fontWeight: 'bold'
            }}>Hecho a Mano</h3>
            <p style={{ color: '#ff6b9d' }}>Cada producto es elaborado artesanalmente con ingredientes de primera calidad</p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)', // Rosa pastel
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(255, 182, 193, 0.3)',
            border: '2px solid #ffb6c1',
            transition: 'all 0.4s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) rotate(-2deg)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 182, 193, 0.5)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 182, 193, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)';
          }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              transition: 'transform 0.3s ease'
            }}>🚚</div>
            <h3 style={{ 
              color: '#ff6b9d', 
              marginBottom: '1rem',
              fontSize: '1.3rem',
              fontWeight: 'bold'
            }}>Envío Rápido</h3>
            <p style={{ color: '#ff6b9d' }}>Recibe tus postres favoritos en la puerta de tu casa</p>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)', // Rosa pastel
            borderRadius: '20px',
            boxShadow: '0 5px 20px rgba(255, 182, 193, 0.3)',
            border: '2px solid #ffb6c1',
            transition: 'all 0.4s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 182, 193, 0.5)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffd1dc 0%, #ffb6c1 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(255, 182, 193, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #ffe4e6 0%, #ffd1dc 100%)';
          }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              transition: 'transform 0.3s ease'
            }}>💝</div>
            <h3 style={{ 
              color: '#ff6b9d', 
              marginBottom: '1rem',
              fontSize: '1.3rem',
              fontWeight: 'bold'
            }}>Hecho con Amor</h3>
            <p style={{ color: '#ff6b9d' }}>Ponemos todo nuestro cariño en cada creación</p>
          </div>
        </div>
      </main>
    </>
  );
}