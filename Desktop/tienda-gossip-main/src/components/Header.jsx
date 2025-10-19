import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { getTotalItems, getCartItemCount, cartItems } = useCart();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Controlar el scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  // Función segura para obtener el total de items
  const getTotalItemsCount = () => {
    if (typeof getTotalItems === 'function') {
      return getTotalItems();
    } else if (typeof getCartItemCount === 'function') {
      return getCartItemCount();
    } else if (cartItems && Array.isArray(cartItems)) {
      return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
    }
    return 0;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('💔 Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const totalItems = getTotalItemsCount();

  return (
    <>
      {/* Anuncio de descuento */}
      <div style={{
        backgroundColor: "rgba(255, 182, 193, 0.9)",
        color: "white",
        textAlign: "center",
        padding: "10px 15px",
        position: "relative",
        zIndex: 1000,
        fontSize: "0.9rem",
        fontWeight: "600",
        letterSpacing: "0.5px",
        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
        background: "linear-gradient(135deg, #ffb6c1 0%, #ff69b4 100%)",
        boxShadow: "0 2px 10px rgba(255, 105, 180, 0.3)",
        margin: 0,
      }}>
        ✨ ¡Obtené un descuento utilizando nuestro codigo: expo2025 , valido hasta el 22/10 inclusive! ✨ 
      </div>

      <header className="header" style={{ 
        padding: '1rem 0', 
        width: '100%', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
        borderBottom: '2px solid #ffb6c1',
        boxShadow: '0 4px 20px rgba(255, 182, 193, 0.2)',
        position: 'relative'
      }}>
        <div
          className="container-xl"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '0 1rem',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ 
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            zIndex: 1001
          }}>
            <img
              src="/img/casi.png"
              alt="Gossip Cake Logo"
              style={{
                maxHeight: '30px',
                width: 'auto',
                display: 'block',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </Link>

          {/* Iconos sociales */}
          <div className="social-icons" style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <a 
              href="https://www.instagram.com/gossip.cake_/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
              style={{
                padding: '4px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 182, 193, 0.2)',
                width: '44px',
                height: '44px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.background = 'rgba(255, 182, 193, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src="/img/ig.png"
                alt="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </a>
            
            <a 
              href="https://www.tiktok.com/@gossip.cake_?lang=es" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
              style={{
                padding: '4px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid rgba(255, 182, 193, 0.2)',
                width: '44px',
                height: '44px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.background = 'rgba(255, 182, 193, 0.2)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src="/img/tiktok.png"
                alt="TikTok"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </a>
          </div>

          {/* Botón menú hamburguesa para móvil */}
          <button
            onClick={toggleMenu}
            style={{
              display: 'none',
              background: 'rgba(255, 255, 255, 0.7)',
              border: '1px solid rgba(255, 182, 193, 0.3)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              zIndex: 1001,
              minWidth: '44px',
              minHeight: '44px'
            }}
            className="menu-toggle"
          >
            <svg style={{ width: '24px', height: '24px', color: '#c71585' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Navegación para desktop */}
          <nav style={{ 
            flexShrink: 0,
            transition: 'all 0.3s ease'
          }} className="desktop-nav">
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                gap: '1rem',
                margin: 0,
                padding: 0,
                alignItems: 'center',
              }}
              className="nav-list"
            >
              {/* Enlaces de navegación */}
              <li>
                <Link 
                  to="/" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#ff6b9d', 
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 182, 193, 0.3)',
                    display: 'block',
                    textAlign: 'center',
                    minWidth: '70px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff6b9d';
                    e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#ff6b9d';
                    e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/productos" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#ff6b9d', 
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 182, 193, 0.3)',
                    display: 'block',
                    textAlign: 'center',
                    minWidth: '70px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff6b9d';
                    e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#ff6b9d';
                    e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Productos
                </Link>
              </li>
              
              {/* Admin/Login */}
              {currentUser ? (
                <>
                  <li>
                    <Link 
                      to="/admin/dashboard" 
                      style={{ 
                        textDecoration: 'none', 
                        color: '#ff6b9d', 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 182, 193, 0.3)',
                        display: 'block',
                        textAlign: 'center',
                        minWidth: '70px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ff6b9d';
                        e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#ff6b9d';
                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 182, 193, 0.3)',
                        color: '#ff6b9d', 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                        display: 'block',
                        textAlign: 'center',
                        minWidth: '70px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#ff6b9d';
                        e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#ff6b9d';
                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link 
                    to="/admin" 
                    style={{ 
                      textDecoration: 'none', 
                      color: '#c71585', 
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 182, 193, 0.3)',
                      display: 'block',
                      textAlign: 'center',
                      minWidth: '70px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff1493';
                      e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#c71585';
                      e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Admin
                  </Link>
                </li>
              )}

              {/* Carrito */}
              <li>
                <Link 
                  to="/carrito" 
                  style={{ 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none', 
                    color: '#c71585',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 182, 193, 0.3)',
                    fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                    fontWeight: '600',
                    minWidth: '70px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff1493';
                    e.target.style.background = 'rgba(255, 182, 193, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 105, 180, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#c71585';
                    e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🛒
                  {totalItems > 0 && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '-3px',
                        right: '-3px',
                        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                        color: 'white',
                        fontSize: '0.7rem',
                        borderRadius: '50%',
                        height: '18px',
                        width: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
                        boxShadow: '0 2px 6px rgba(255, 107, 157, 0.4)',
                        border: '2px solid white'
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Menú móvil - MEJORADO Y COMPLETO */}
        <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
          <div className="mobile-menu-content">
            {/* Header del menú móvil con botón de cerrar */}
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menú</span>
              <button 
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Opciones del menú */}
            <div className="mobile-menu-options">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-link"
              >
                <span className="mobile-menu-icon">🏠</span>
                Inicio
              </Link>
              <Link 
                to="/productos" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-link"
              >
                <span className="mobile-menu-icon">🍰</span>
                Productos
              </Link>
              {currentUser ? (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsMenuOpen(false)}
                    className="mobile-menu-link"
                  >
                    <span className="mobile-menu-icon">📊</span>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-menu-link mobile-menu-button"
                  >
                    <span className="mobile-menu-icon">🚪</span>
                    Salir
                  </button>
                </>
              ) : (
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="mobile-menu-link"
                >
                  <span className="mobile-menu-icon">🔐</span>
                  Admin
                </Link>
              )}
              <Link 
                to="/carrito" 
                onClick={() => setIsMenuOpen(false)}
                className="mobile-menu-link mobile-menu-cart"
              >
                <span className="mobile-menu-icon">🛒</span>
                Carrito
                {totalItems > 0 && (
                  <span className="mobile-cart-badge">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Estilos globales para responsive - MEJORADO */}
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
            
            * {
              font-family: 'Quicksand', 'Segoe UI', sans-serif;
            }

            /* Desktop - navegación visible */
            @media (min-width: 769px) {
              .menu-toggle {
                display: none !important;
              }
              
              .desktop-nav {
                display: block !important;
              }
              
              .mobile-menu {
                display: none !important;
              }
            }

            /* Tablet y móvil */
            @media (max-width: 768px) {
              .menu-toggle {
                display: flex !important;
                align-items: center;
                justify-content: center;
              }
              
              .desktop-nav {
                display: none !important;
              }
              
              /* Menú móvil - MEJORADO Y COMPLETO */
              .mobile-menu {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                transition: all 0.3s ease;
              }
              
              .mobile-menu-closed {
                display: none;
              }
              
              .mobile-menu-open {
                display: block;
              }
              
              .mobile-menu-content {
                position: absolute;
                top: 0;
                right: 0;
                width: 85%;
                max-width: 320px;
                height: 100vh;
                background: linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%);
                display: flex;
                flex-direction: column;
                box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
                overflow-y: auto;
                margin: 0;
                padding: 0;
              }
              
              /* Header del menú móvil */
              .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 20px 18px 20px;
                background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
                color: white;
                margin: 0;
                border-bottom: 2px solid rgba(255, 255, 255, 0.2);
              }
              
              .mobile-menu-title {
                font-size: 1.3rem;
                font-weight: 700;
                color: white;
                margin: 0;
              }
              
              .mobile-menu-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                padding: 8px;
                cursor: pointer;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                min-width: 40px;
                min-height: 40px;
              }
              
              .mobile-menu-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
              }
              
              /* Opciones del menú */
              .mobile-menu-options {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex: 1;
                margin: 0;
              }
              
              .mobile-menu-link {
                text-decoration: none;
                color: #c71585;
                font-weight: 600;
                font-size: 1.1rem;
                padding: 16px 20px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(255, 182, 193, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
                margin: 0;
                min-height: 56px;
                box-sizing: border-box;
              }
              
              .mobile-menu-link:hover {
                background: rgba(255, 182, 193, 0.2);
                color: #ff1493;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);
              }
              
              .mobile-menu-icon {
                font-size: 1.2rem;
                width: 24px;
                text-align: center;
                flex-shrink: 0;
              }
              
              .mobile-menu-button {
                background: rgba(255, 255, 255, 0.7);
                border: 1px solid rgba(255, 182, 193, 0.3);
                color: #c71585;
                cursor: pointer;
                font-family: 'Quicksand', 'Segoe UI', sans-serif;
                text-align: left;
                font-size: 1.1rem;
                font-weight: 600;
                width: 100%;
              }
              
              .mobile-menu-cart {
                position: relative;
              }
              
              .mobile-cart-badge {
                position: absolute;
                top: 12px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%);
                color: white;
                font-size: 0.8rem;
                border-radius: 50%;
                height: 24px;
                width: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 2px solid white;
              }
              
              /* Ajustar iconos sociales en móvil */
              .social-icons {
                gap: 0.6rem;
              }
              
              .social-icons a {
                width: 40px !important;
                height: 40px !important;
              }
              
              .social-icons img {
                width: 28px !important;
                height: 28px !important;
              }
            }

            /* Móvil pequeño */
            @media (max-width: 480px) {
              .container-xl {
                padding: 0 0.5rem;
                gap: 0.5rem;
              }
              
              .social-icons {
                gap: 0.4rem;
              }
              
              .social-icons a {
                width: 36px !important;
                height: 36px !important;
                padding: 3px !important;
              }
              
              .social-icons img {
                width: 24px !important;
                height: 24px !important;
              }
              
              .mobile-menu-content {
                width: 85%;
                max-width: 300px;
              }
              
              .mobile-menu-header {
                padding: 18px 16px 16px 16px;
              }
              
              .mobile-menu-title {
                font-size: 1.2rem;
              }
              
              .mobile-menu-options {
                padding: 16px;
                gap: 10px;
              }
              
              .mobile-menu-link {
                font-size: 1rem;
                padding: 14px 16px;
                min-height: 52px;
              }
              
              .mobile-menu-icon {
                font-size: 1.1rem;
                width: 22px;
              }
              
              .mobile-cart-badge {
                top: 10px;
                right: 16px;
                height: 22px;
                width: 22px;
                font-size: 0.75rem;
              }
            }

            /* Móvil muy pequeño */
            @media (max-width: 360px) {
              .mobile-menu-content {
                width: 90%;
                max-width: 280px;
              }
              
              .mobile-menu-header {
                padding: 16px 14px 14px 14px;
              }
              
              .mobile-menu-options {
                padding: 14px;
                gap: 8px;
              }
              
              .mobile-menu-link {
                font-size: 0.95rem;
                padding: 12px 14px;
                min-height: 48px;
                gap: 10px;
              }
              
              .mobile-menu-icon {
                font-size: 1rem;
                width: 20px;
              }
              
              .mobile-cart-badge {
                top: 8px;
                right: 14px;
                height: 20px;
                width: 20px;
                font-size: 0.7rem;
              }
            }

            /* Prevenir scroll del body cuando el menú está abierto */
            body.menu-open {
              overflow: hidden;
            }
          `}
        </style>
      </header>
    </>
  );
}