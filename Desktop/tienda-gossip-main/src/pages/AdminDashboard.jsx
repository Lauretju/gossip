import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    timeLimitedOfferEnd: '',
    imageUrl: ''
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('💔 Error al cerrar sesión:', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      discountedPrice: '', 
      timeLimitedOfferEnd: '', 
      imageUrl: '' 
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : '',
      timeLimitedOfferEnd: product.timeLimitedOfferEnd || '',
      imageUrl: product.imageUrl || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl
      };

      if (formData.discountedPrice) {
        productData.discountedPrice = parseFloat(formData.discountedPrice);
      }
      
      if (formData.timeLimitedOfferEnd) {
        productData.timeLimitedOfferEnd = formData.timeLimitedOfferEnd;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      setShowModal(false);
    } catch (error) {
      console.error('💔 Error guardando producto:', error);
      alert('💔 Error al guardar el producto');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('💖 ¿Estás segura de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('💔 Error eliminando producto:', error);
        alert('💔 Error al eliminar el producto');
      }
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return '🌸 Sin oferta';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES');
  };

  const stats = {
    totalProducts: products.length,
    activeOffers: products.filter(p => p.timeLimitedOfferEnd && new Date(p.timeLimitedOfferEnd) > new Date()).length,
    productsWithDiscount: products.filter(p => p.discountedPrice && p.discountedPrice < p.price).length
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)'
      }}>
        <div style={{ 
          textAlign: 'center', 
          color: 'white',
          background: 'rgba(255,255,255,0.2)',
          padding: '40px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>💕 Cargando Dashboard...</h2>
          <style>
            {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }`}
          </style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 4px 20px rgba(255,107,157,0.3)'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1 1 300px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.3)',
              padding: '12px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              flexShrink: 0
            }}>
              
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(45deg, #fff, #ffe4ec)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                wordWrap: 'break-word'
              }}>
                Panel de Administración
              </h1>
              <p style={{ margin: 0, opacity: 0.9, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                Gestiona tus productos y ventas
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '200px'
            }}>
              Hola, {currentUser?.email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.4)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '30px auto', 
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffafcc 0%, #ffc8dd 100%)',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(255,175,204,0.3)',
            textAlign: 'center',
            border: '2px solid #ffafcc'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛍️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b9d', fontSize: '1.1rem' }}>Total Productos</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c71585' }}>{stats.totalProducts}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffc8dd 0%, #ffafcc 100%)',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(255,200,221,0.3)',
            textAlign: 'center',
            border: '2px solid #ffc8dd'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🌟</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b9d', fontSize: '1.1rem' }}>Ofertas Activas</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c71585' }}>{stats.activeOffers}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffc8dd 0%, #ffafcc 100%)',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(255,200,221,0.3)',
            textAlign: 'center',
            border: '2px solid #ffc8dd'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💝</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff6b9d', fontSize: '1.1rem' }}>Con Descuento</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#c71585' }}>{stats.productsWithDiscount}</div>
          </div>

          {/* CARD PARA VENTAS - AHORA ROSA */}
          <div style={{
            background: 'linear-gradient(135deg, #ffafcc 0%, #ffc8dd 100%)',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(255,175,204,0.3)',
            textAlign: 'center',
            border: '2px solid #ffafcc',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,175,204,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,175,204,0.3)';
          }}
          >
            <Link 
              to="/admin/ventas" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                display: 'block'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#ff6b9d', fontSize: '1.1rem' }}>Reporte de Ventas</h3>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#c71585',
                background: 'rgba(255,255,255,0.5)',
                padding: '8px 12px',
                borderRadius: '15px',
                marginTop: '10px'
              }}>
                Ir al Dashboard →
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
          borderRadius: '25px',
          boxShadow: '0 10px 40px rgba(255,182,193,0.2)',
          overflow: 'hidden',
          border: '2px solid #ffb6c1'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'linear-gradient(135deg, #ffebf3 0%, #ffe4ec 100%)',
            padding: '0 20px',
            borderBottom: '2px solid #ffb6c1',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '15px 25px',
                background: activeTab === 'products' ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)' : 'transparent',
                border: 'none',
                fontWeight: 'bold',
                color: activeTab === 'products' ? 'white' : '#c71585',
                cursor: 'pointer',
                borderBottom: activeTab === 'products' ? '3px solid #ff1493' : 'none',
                transition: 'all 0.3s ease',
                borderRadius: '15px 15px 0 0',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              🎀 Productos ({products.length})
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '20px' }}>
            {/* Action Bar - SIN BOTÓN VER VENTAS */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
              borderRadius: '20px',
              color: 'white',
              boxShadow: '0 8px 25px rgba(255,107,157,0.3)',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  wordWrap: 'break-word'
                }}>
                  Gestión de Productos
                </h2>
                <p style={{ 
                  margin: '5px 0 0 0', 
                  opacity: 0.9,
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)'
                }}>
                  Administra tu colección de productos
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={openAddModal}
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.5)',
                    padding: '10px 20px',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.4)';
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  ✨ Nuevo Producto
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#c71585',
                background: 'rgba(255,255,255,0.5)',
                borderRadius: '20px',
                border: '2px dashed #ffb6c1'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎁</div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>No hay Productos aún</h3>
                <p style={{ margin: '0 0 20px 0' }}>Crea tu primer producto para comenzar</p>
                <button
                  onClick={openAddModal}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                    e.target.style.boxShadow = '0 5px 20px rgba(255,107,157,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Crear Primer Producto
                </button>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(350px, 100%), 1fr))',
                gap: '20px'
              }}>
                {products.map((product) => {
                  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
                  const discountPercentage = hasDiscount 
                    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
                    : 0;
                  const isOfferActive = product.timeLimitedOfferEnd && new Date(product.timeLimitedOfferEnd) > new Date();

                  return (
                    <div key={product.id} style={{
                      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
                      border: '2px solid #ffb6c1',
                      borderRadius: '20px',
                      padding: '20px',
                      boxShadow: '0 8px 25px rgba(255,182,193,0.2)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      minWidth: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(255,107,157,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,182,193,0.2)';
                    }}
                    >
                      {/* Product Image */}
                      <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        marginBottom: '15px',
                        background: 'linear-gradient(135deg, #ffebf3 0%, #ffe4ec 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ffc8dd'
                      }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{ color: '#c71585', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🖼️</div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>✨ Sin imagen</p>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#c71585',
                        textAlign: 'center',
                        wordWrap: 'break-word'
                      }}>
                        {product.name}
                      </h3>

                      <p style={{
                        margin: '0 0 15px 0',
                        color: '#d63384',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        height: '40px',
                        overflow: 'hidden',
                        textAlign: 'center',
                        wordWrap: 'break-word'
                      }}>
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                        {hasDiscount ? (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px', 
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#e75480' }}>
                              ${product.discountedPrice}
                            </span>
                            <span style={{ fontSize: '1rem', color: '#d63384', textDecoration: 'line-through' }}>
                              ${product.price}
                            </span>
                            <span style={{
                              background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
                              color: 'white',
                              padding: '4px 10px',
                              borderRadius: '15px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold'
                            }}>
                              🎀 -{discountPercentage}%
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#c71585' }}>
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {/* Offer Status */}
                      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        {isOfferActive ? (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
                            color: '#c71585',
                            padding: '8px 15px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            border: '2px solid #ffb6c1'
                          }}>
                            ⏰ Oferta Limitada
                          </div>
                        ) : (
                          <span style={{ color: '#d63384', fontSize: '0.9rem' }}>🌸 Sin oferta activa</span>
                        )}
                      </div>

                      {/* Actions */}
{/* Actions */}
<div style={{
  display: 'flex',
  gap: '10px',
  borderTop: '2px solid #ffc8dd',
  paddingTop: '15px',
  flexWrap: 'wrap'
}}>
  <button
    onClick={() => openEditModal(product)}
    style={{
      flex: '1 1 120px',
      background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 12px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '5px',
      transition: 'all 0.3s ease',
      minWidth: '80px'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
    }}
  >
    ✏️ Editar
  </button>
  
  <button
    onClick={() => handleDelete(product.id)}
    style={{
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
    }}
    title="Eliminar"
  >
    🗑️ Eliminar
  </button>
</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

{/* Modal para agregar/editar producto - VERSIÓN RESPONSIVE */}
{showModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,182,193,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    backdropFilter: 'blur(5px)'
  }}>
    <div style={{
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
      borderRadius: '25px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '95vh',
      overflowY: 'auto',
      boxShadow: '0 25px 50px rgba(255,107,157,0.3)',
      border: '3px solid #ffb6c1',
      display: 'flex',
      flexDirection: 'column',
      margin: '10px'
    }}>
      {/* Modal Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '22px 22px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
          wordWrap: 'break-word',
          flex: 1,
          paddingRight: '15px'
        }}>
          {editingProduct ? '✏️ Editar Producto' : '✨ Nuevo Producto'}
        </h2>
        <button
          onClick={() => setShowModal(false)}
          style={{
            background: 'rgba(255,255,255,0.3)',
            color: 'white',
            border: 'none',
            padding: '10px 12px',
            borderRadius: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            flexShrink: 0,
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.5)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.3)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>
      </div>
      
      {/* Modal Form */}
      <form onSubmit={handleSubmit} style={{ 
        padding: '20px', 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Nombre del Producto */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#c71585',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)'
          }}>
            🎀 Nombre del Producto *
          </label>
          <input
            type="text"
            required
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #ffc8dd',
              borderRadius: '12px',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.8)',
              boxSizing: 'border-box',
              minHeight: '50px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b9d';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,157,0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ffc8dd';
              e.target.style.boxShadow = 'none';
            }}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        {/* Descripción */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#c71585',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)'
          }}>
            📖 Descripción *
          </label>
          <textarea
            required
            rows="3"
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #ffc8dd',
              borderRadius: '12px',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              resize: 'vertical',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.8)',
              boxSizing: 'border-box',
              minHeight: '100px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b9d';
              e.target.style.boxShadow = '0 0 0 3px rgba(255,107,157,0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ffc8dd';
              e.target.style.boxShadow = 'none';
            }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Precios - Grid Responsive */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#c71585',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>
              💰 Precio Original *
            </label>
            <input
              type="number"
              step="0.01"
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ffc8dd',
                borderRadius: '12px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)',
                boxSizing: 'border-box',
                minHeight: '50px'
              }}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#c71585',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>
              🏷️ Precio con Descuento
            </label>
            <input
              type="number"
              step="0.01"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ffc8dd',
                borderRadius: '12px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                transition: 'all 0.3s ease',
                background: 'rgba(255,255,255,0.8)',
                boxSizing: 'border-box',
                minHeight: '50px'
              }}
              value={formData.discountedPrice}
              onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
              placeholder="✨ Opcional"
            />
          </div>
        </div>

{/* Fecha de Oferta - TAMAÑO IGUAL A LOS OTROS INPUTS */}
<div>
  <label style={{ 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: 'bold', 
    color: '#c71585',
    fontSize: 'clamp(0.9rem, 3vw, 1rem)'
  }}>
    ⏰ Fin de Oferta 
  </label>
  <input
    type="datetime-local"
    style={{
      width: '100%',
      padding: '15px',
      border: '2px solid #ffc8dd',
      borderRadius: '12px',
      fontSize: 'clamp(0.9rem, 3vw, 1rem)',
      transition: 'all 0.3s ease',
      background: 'rgba(255,255,255,0.8)',
      boxSizing: 'border-box',
      minHeight: '50px',
      fontFamily: 'inherit'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#ff6b9d';
      e.target.style.boxShadow = '0 0 0 3px rgba(255,107,157,0.2)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#ffc8dd';
      e.target.style.boxShadow = 'none';
    }}
    value={formData.timeLimitedOfferEnd}
    onChange={(e) => setFormData({ ...formData, timeLimitedOfferEnd: e.target.value })}
  />
  <div style={{
    fontSize: '0.8rem',
    color: '#d63384',
    marginTop: '5px',
    textAlign: 'center'
  }}>
    📱 En móvil se abre el selector nativo
  </div>
</div>
        
        {/* URL de Imagen */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#c71585',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)'
          }}>
            🖼️ URL de Imagen 
          </label>
          <input
            type="url"
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #ffc8dd',
              borderRadius: '12px',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.8)',
              boxSizing: 'border-box',
              minHeight: '50px'
            }}
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        
        {/* Botones de Acción */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '10px',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            style={{
              flex: '1 1 150px',
              background: 'linear-gradient(135deg, #ffc8dd 0%, #ffafcc 100%)',
              color: '#c71585',
              border: '2px solid #ffb6c1',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              minWidth: '120px',
              minHeight: '50px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'linear-gradient(135deg, #ffafcc 0%, #ffc8dd 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'linear-gradient(135deg, #ffc8dd 0%, #ffafcc 100%)';
            }}
          >
            ❌ Cancelar
          </button>
          <button
            type="submit"
            style={{
              flex: '1 1 150px',
              background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              minWidth: '120px',
              minHeight: '50px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 5px 20px rgba(255,107,157,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {editingProduct ? '💾 Actualizar' : '✨ Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Estilos responsive adicionales */}
{/* Estilos responsive adicionales */}
{/* Estilos responsive adicionales */}
<style>
  {`
    @media (max-width: 768px) {
      /* Ajustes para tablets */
      .container-xl {
        padding: 0 15px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
      
      .products-grid {
        grid-templateColumns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 15px;
      }
      
      .action-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
      }
      
      .action-buttons {
        justify-content: center;
      }

      /* Modal responsive para tablets */
      .modal-overlay {
        padding: 15px;
      }
      
      .modal-container {
        margin: 5px;
        max-height: 98vh;
        border-radius: 20px;
      }
      
      .modal-header {
        padding: 15px 20px;
        position: relative;
      }
      
      .modal-form {
        padding: 15px;
        gap: 15px;
      }
      
      .price-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .form-input, .form-textarea {
        padding: 12px;
        min-height: 45px;
      }
      
      .form-textarea {
        min-height: 80px;
      }
      
      .button-group {
        flex-direction: column;
        gap: 10px;
      }
      
      .button-group button {
        flex: 1;
        min-width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      /* Ajustes para móviles */
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }
      
      .user-info {
        justify-content: center;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .product-card {
        padding: 15px;
      }
      
      .modal-content {
        margin: 10px;
        max-height: 95vh;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .button-group {
        flex-direction: column;
      }

      /* Modal responsive para móviles */
      .modal-overlay {
        padding: 10px;
        align-items: flex-end;
      }
      
      .modal-container {
        margin: 0;
        max-height: 90vh;
        border-radius: 20px 20px 0 0;
        width: 100%;
        max-width: 100%;
      }
      
      .modal-header {
        padding: 15px;
        border-radius: 20px 20px 0 0;
      }
      
      .modal-header h2 {
        font-size: 1.2rem;
      }
      
      .modal-form {
        padding: 15px;
        gap: 12px;
      }
      
      .form-input, .form-textarea {
        padding: 12px;
        font-size: 16px;
        min-height: 44px;
      }
      
      .form-textarea {
        min-height: 80px;
      }
      
      .button-group {
        gap: 8px;
      }
      
      .button-group button {
        padding: 12px 15px;
        min-height: 44px;
      }
    }
    
    @media (max-width: 360px) {
      /* Ajustes para móviles muy pequeños */
      .container-xl {
        padding: 0 10px;
      }
      
      .product-actions {
        flex-direction: column;
      }
      
      .product-actions button {
        width: 100%;
      }

      .modal-form {
        padding: 12px;
      }
      
      .modal-header {
        padding: 12px 15px;
      }
      
      .form-input, .form-textarea {
        padding: 10px 12px;
      }
      
      .button-group button {
        padding: 10px 12px;
        font-size: 0.9rem;
      }
    }
    
    /* Mejoras de accesibilidad y UX */
    @media (max-height: 600px) and (orientation: landscape) {
      .modal-overlay {
        align-items: flex-start;
        padding: 10px;
      }
      
      .modal-container {
        max-height: 95vh;
      }
      
      .modal-form {
        gap: 10px;
      }
      
      .form-textarea {
        min-height: 60px;
        rows: 2;
      }
    }
    
    /* Prevenir desbordamiento en inputs numéricos */
    input[type="number"] {
      -moz-appearance: textfield;
    }
    
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* ESTILOS ESPECÍFICOS PARA INPUT DE FECHA - TAMAÑO IGUAL A OTROS INPUTS */
    input[type="datetime-local"] {
      min-width: 0;
      flex: 1;
      font-family: inherit;
      color: inherit;
      box-sizing: border-box;
    }
    
    /* Para navegadores WebKit (Chrome, Safari) */
    input[type="datetime-local"]::-webkit-datetime-edit {
      padding: 0;
      line-height: 1;
    }
    
    input[type="datetime-local"]::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }
    
    input[type="datetime-local"]::-webkit-datetime-edit-text {
      padding: 0 2px;
    }
    
    input[type="datetime-local"]::-webkit-datetime-edit-month-field,
    input[type="datetime-local"]::-webkit-datetime-edit-day-field,
    input[type="datetime-local"]::-webkit-datetime-edit-year-field,
    input[type="datetime-local"]::-webkit-datetime-edit-hour-field,
    input[type="datetime-local"]::-webkit-datetime-edit-minute-field {
      padding: 0 2px;
    }
    
    input[type="datetime-local"]::-webkit-inner-spin-button {
      display: none;
    }
    
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      margin-left: 0;
      padding: 4px;
      background: transparent;
      cursor: pointer;
      opacity: 0.7;
    }
    
    input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    /* Para Firefox */
    input[type="datetime-local"] {
      color-scheme: light;
    }
    
    input[type="datetime-local"]::-moz-focus-inner {
      border: 0;
      padding: 0;
    }

    /* Asegurar que todos los inputs tengan el mismo tamaño */
    .modal-form input[type="text"],
    .modal-form input[type="number"],
    .modal-form input[type="url"],
    .modal-form input[type="datetime-local"],
    .modal-form textarea {
      width: 100%;
      padding: 15px;
      border: 2px solid #ffc8dd;
      border-radius: 12px;
      font-size: clamp(0.9rem, 3vw, 1rem);
      transition: all 0.3s ease;
      background: rgba(255,255,255,0.8);
      box-sizing: border-box;
      min-height: 50px;
      font-family: inherit;
    }

    /* Estados de focus consistentes */
    .modal-form input:focus,
    .modal-form textarea:focus {
      border-color: #ff6b9d;
      box-shadow: 0 0 0 3px rgba(255,107,157,0.2);
      outline: none;
    }

    /* Ajustes específicos para móviles - TODOS los inputs iguales */
    @media (max-width: 480px) {
      .modal-form input[type="text"],
      .modal-form input[type="number"],
      .modal-form input[type="url"],
      .modal-form input[type="datetime-local"],
      .modal-form textarea {
        font-size: 16px !important;
        min-height: 44px !important;
        padding: 12px !important;
      }
    }

    /* Mejoras de rendimiento y scroll */
    .modal-container {
      -webkit-overflow-scrolling: touch;
    }

    /* Prevenir zoom no deseado en iOS */
    @media (max-width: 480px) {
      input[type="text"],
      input[type="number"],
      input[type="url"],
      input[type="datetime-local"],
      textarea {
        font-size: 16px !important;
      }
    }

    /* Mejoras de rendimiento para animaciones */
    .modal-container,
    .product-card,
    .stats-grid > div {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000;
    }

    /* Texto de ayuda para fecha */
    .datetime-helper {
      font-size: 0.8rem;
      color: #d63384;
      margin-top: 5px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .datetime-helper {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .datetime-helper {
        display: block;
        font-size: 0.7rem;
      }
    }
  `}
</style>
    </div>
  );
};

export default AdminDashboard;