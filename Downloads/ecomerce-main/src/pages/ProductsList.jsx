import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

const ProductsList = () => {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [notification, setNotification] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({});

  // Array vacío - sin productos de respaldo
  const backupProducts = [];

  // Usar productos de Firebase o datos de respaldo (que ahora está vacío)
  const displayProducts = products.length > 0 ? products : backupProducts;

  // Función para calcular el tiempo restante
  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const difference = end - now;

    if (difference <= 0) {
      return 'Oferta terminada';
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Actualizar el tiempo restante cada minuto
  useEffect(() => {
    const updateTimes = () => {
      const newTimeRemaining = {};
      displayProducts.forEach(prod => {
        if (prod.timeLimitedOfferEnd && new Date(prod.timeLimitedOfferEnd) > new Date()) {
          newTimeRemaining[prod.id] = calculateTimeRemaining(prod.timeLimitedOfferEnd);
        }
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [displayProducts]);

  const handleAddToCart = (prod) => {
    addToCart(prod);
    setNotification(` ${prod.name} añadido al carrito.`);
    setTimeout(() => setNotification(""), 3000);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p>Cargando productos desde Firebase...</p>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #ffb6c1', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <style>
          {`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url("/img/fondo-pastel.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      padding: '20px 0',
      position: 'relative'
    }}>
      {/* Overlay para mejor legibilidad */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1
      }}></div>

      {/* Header de la página de productos */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #ffb6c1 0%, #ffd1dc 100%)',
        color: '#ff6b9d',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 2,
        borderRadius: '20px',
        margin: '2rem 1rem',
        boxShadow: '0 8px 25px rgba(255, 182, 193, 0.3)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>
          🍰 Nuestros Productos
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9
        }}>
          Descubre nuestra deliciosa selección de postres artesanales
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
        }}>
          {displayProducts.map((prod) => {
            const isOfferActive = prod.timeLimitedOfferEnd && new Date(prod.timeLimitedOfferEnd) > new Date();
            const timeLeft = timeRemaining[prod.id] || '';

            return (
              <div
                key={prod.id}
                style={{
                  backgroundColor: "#ffe4e6",
                  border: "2px solid #ffb6c1",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  textAlign: "center",
                  boxShadow: "0 8px 25px rgba(255, 182, 193, 0.2)",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(255, 182, 193, 0.4)";
                  e.currentTarget.style.backgroundColor = "#ffd1dc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 182, 193, 0.2)";
                  e.currentTarget.style.backgroundColor = "#ffe4e6";
                }}
              >
                {/* Badge de oferta */}
                {prod.discountedPrice && prod.discountedPrice < prod.price && (
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    backgroundColor: "#ff6b9d",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    zIndex: 10,
                    boxShadow: "0 3px 10px rgba(255, 145, 164, 0.4)"
                  }}>
                    -{Math.round(((prod.price - prod.discountedPrice) / prod.price) * 100)}%
                  </div>
                )}

                {/* Indicador de oferta limitada con tiempo restante */}
                {isOfferActive && (
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    backgroundColor: "rgba(255, 182, 193, 0.9)",
                    color: "#ff6b9d",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    zIndex: 10,
                    border: '1px solid #ff6b9d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ⏰ {timeLeft}
                  </div>
                )}

                {/* Imagen del producto */}
                <div style={{
                  width: "200px",
                  height: "200px",
                  margin: "0 auto 1rem",
                  borderRadius: "15px",
                  overflow: "hidden",
                  border: "3px solid #ffb6c1",
                  boxShadow: "0 4px 15px rgba(255, 182, 193, 0.3)"
                }}>
                  <img
                    src={prod.imageUrl || prod.imgSrc || "/img/placeholder.jpg"}
                    alt={prod.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block"
                    }}
                    onError={(e) => {
                      e.target.src = "/img/placeholder.jpg";
                    }}
                  />
                </div>

                {/* Información del producto */}
                <h3
                  style={{
                    marginBottom: "0.5rem",
                    color: "#ff6b9d",
                    fontFamily: "'Quicksand', sans-serif",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}
                >
                  {prod.name}
                </h3>
                
                <p
                  style={{
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    color: "#ff8599ff",
                    minHeight: "40px",
                    lineHeight: "1.4"
                  }}
                >
                  {prod.description}
                </p>
                
                {/* Precios */}
                <div style={{ marginBottom: "1.2rem" }}>
                  {prod.discountedPrice && prod.discountedPrice < prod.price ? (
                    <div>
                      <span style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#ff6b9d"
                      }}>
                        ${prod.discountedPrice}
                      </span>
                      <span style={{
                        fontSize: "1rem",
                        color: "#ff91a4",
                        textDecoration: "line-through",
                        marginLeft: "0.5rem"
                      }}>
                        ${prod.price}
                      </span>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "#ff6b9d"
                    }}>
                      ${prod.price}
                    </span>
                  )}
                </div>

                {/* Información adicional de oferta */}
                {isOfferActive && (
                  <div style={{
                    marginBottom: "1rem",
                    padding: "8px 12px",
                    backgroundColor: "rgba(255, 182, 193, 0.2)",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    color: "#ff6b9d",
                    fontWeight: "500"
                  }}>
                    ⚡ Oferta termina en: {timeLeft}
                  </div>
                )}

                {/* Botón de agregar al carrito */}
                <button
                  onClick={() => handleAddToCart(prod)}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#ff6b9d",
                    color: "#fff8f9ff",
                    border: "2px solid #ff91a4",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    width: "100%",
                    boxShadow: "0 4px 15px rgba(255, 182, 193, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#ff6b9d";
                    e.target.style.color = "white";
                    e.target.style.transform = "scale(1.05)";
                    e.target.style.boxShadow = "0 6px 20px rgba(255, 145, 164, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ff6b9d";
                    e.target.style.color = "#f0cdd3ff";
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "0 4px 15px rgba(255, 182, 193, 0.3)";
                  }}
                  aria-label={`Añadir ${prod.name} al carrito`}
                >
                  🛒 Añadir al carrito
                </button>
              </div>
            );
          })}
        </div>

        {/* Notificación */}
        {notification && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "rgba(255, 182, 193, 0.95)",
            color: "#ff91a4",
            padding: "15px 25px",
            borderRadius: "15px",
            boxShadow: "0 5px 20px rgba(255, 182, 193, 0.4)",
            zIndex: 1200,
            fontSize: "1rem",
            fontWeight: "bold",
            border: "2px solid #ff91a4"
          }}>
            {notification}
          </div>
        )}

        {displayProducts.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            color: '#ff91a4',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            margin: '2rem 0',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎂</p>
            <p style={{ fontSize: '1.2rem' }}>No hay productos disponibles en este momento.</p>
            <p style={{ fontSize: '1rem', color: '#d63384', marginTop: '0.5rem' }}>
              Pronto agregaremos nuevos postres deliciosos
            </p>
          </div>
        )}
      </div>

      {/* Estilos para tipografía */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        `}
      </style>
    </div>
  );
};

export default ProductsList;