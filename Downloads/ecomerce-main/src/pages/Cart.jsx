import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSales } from '../context/SalesContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice,
    getDiscountedTotal,
    getTotalDiscount,
    clearCart,
    applyDiscountCode,
    removeDiscountCode,
    discountApplied,
    discountCode,
    discountError,
    getFinalPrice
  } = useCart();
  
  const { registerSale } = useSales();
  
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('transferencia');
  const [customerData, setCustomerData] = useState({
    nombre: '',
    apellido: ''
  });
  const [discountInput, setDiscountInput] = useState('');

  const alias = "gossip.cake";
  const phoneNumber = "543541398030";

  // Agrega estos console.log para debuggear
  console.log('🛒 Cart - cartItems:', cartItems);
  console.log('🛒 Cart - cartItems length:', cartItems.length);

  const copyAlias = () => {
    navigator.clipboard.writeText(alias);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomerInput = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDiscountApply = () => {
    if (discountInput.trim()) {
      applyDiscountCode(discountInput.trim().toUpperCase());
      setDiscountInput('');
    }
  };

  const handleDiscountRemove = () => {
    removeDiscountCode();
    setDiscountInput('');
  };

  const registerSaleInFirestore = async () => {
    try {
      console.log('🛒 Iniciando registro de venta...');
      
      const saleData = {
        total: getDiscountedTotal(),
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: getFinalPrice ? getFinalPrice(item) : item.price,
          stock: item.stock || 0
        })),
        paymentId: `manual_${Date.now()}`,
        paymentStatus: 'pending',
        customerName: customerData.nombre,
        customerLastName: customerData.apellido,
        discountCode: discountApplied ? discountCode : null,
        discountAmount: getTotalDiscount(),
        paymentMethod: selectedPayment
      };

      console.log('📦 Datos de venta a registrar:', saleData);
      const saleId = await registerSale(saleData);
      console.log('✅ Venta registrada con ID:', saleId);
      return true;
    } catch (error) {
      console.error('❌ Error registrando venta:', error);
      return false;
    }
  };

const generateOrderMessage = (paymentMethod) => {
  const itemsList = cartItems.map(item => {
    const finalPrice = getFinalPrice ? getFinalPrice(item) : item.price;
    return `• ${item.name} x${item.quantity} - $${finalPrice * item.quantity}`;
  }).join('\n');
  
  const customerInfo = customerData.nombre && customerData.apellido 
    ? `\n\n*Cliente:* ${customerData.nombre} ${customerData.apellido}`
    : '';

  const discountInfo = discountApplied 
    ? `\n*Código de descuento:* ${discountCode}` 
    : '';

  const paymentInfo = paymentMethod === 'transferencia' 
    ? '\n*Método de pago:* Transferencia (comprobante adjunto)'
    : '\n*Método de pago:* Efectivo al momento de la entrega';
  
  // Usar emojis más compatibles con WhatsApp
  return `¡Hola! Te contacto desde la página web de *Gossip Cake*. 

*MI PEDIDO:*
${itemsList}

*TOTAL: $${getDiscountedTotal().toFixed(2)}*${customerInfo}${discountInfo}${paymentInfo}

¡Muchas gracias! `;
};

const sendToWhatsApp = async (paymentMethod) => {
  setProcessing(true);
  
  try {
    const saleRegistered = await registerSaleInFirestore();
    
    if (!saleRegistered) {
      alert('Error al procesar la venta. Por favor, intenta nuevamente.');
      setProcessing(false);
      return;
    }

    const message = generateOrderMessage(paymentMethod);
    
    // Formatear el número (eliminar el + si existe)
    const formattedPhone = phoneNumber.replace('+', '');
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    // Método 1: Intentar con window.open
    const newWindow = window.open(whatsappUrl, '_blank');
    
    // Si el método 1 falla (especialmente en móviles), usar método 2
    setTimeout(() => {
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Método 2: Redirección directa
        window.location.href = whatsappUrl;
      }
    }, 500);

    // Esperar un poco antes de mostrar éxito
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        clearCart();
        setShowPayment(false);
        setShowSuccess(false);
        setShowCustomerForm(false);
        setProcessing(false);
        setCustomerData({ nombre: '', apellido: '' });
        setSelectedPayment('transferencia');
      }, 3000);
    }, 2000);
    
  } catch (error) {
    console.error('Error en el proceso de compra:', error);
    
    // Método 3: Fallback - mostrar mensaje para que copien y peguen
    const message = generateOrderMessage(paymentMethod);
    const fallbackMessage = `No se pudo abrir WhatsApp automáticamente. Por favor, copia este mensaje y envíalo manualmente:\n\n${message}`;
    
    alert(fallbackMessage);
    setProcessing(false);
  }
};

  const handleFinalizarCompra = () => {
    console.log('🛒 Botón Finalizar Compra CLICKEADO');
    console.log('🛒 Productos en carrito:', cartItems);
    console.log('🛒 Cantidad de productos:', cartItems.length);
    
    if (!cartItems || cartItems.length === 0) {
      console.log('❌ Carrito vacío, no se puede finalizar compra');
      alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }
    
    console.log('✅ Carrito tiene productos, mostrando formulario...');
    setShowCustomerForm(true);
  };

  const handleConfirmarDatos = () => {
    if (!customerData.nombre.trim() || !customerData.apellido.trim()) {
      alert('Por favor, completa tu nombre y apellido');
      return;
    }
    setShowCustomerForm(false);
    setShowPayment(true);
  };

  // Si el carrito está vacío
  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#ffd1dc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '2px solid #ffb6c1'
          }}>
            <svg style={{ width: '40px', height: '40px', color: '#ff91a4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 style={{ 
            fontSize: 'clamp(1.3rem, 5vw, 1.5rem)', 
            fontWeight: 'bold', 
            color: '#ff6b9d', 
            marginBottom: '10px',
            padding: '0 10px'
          }}>
            Tu carrito está vacío
          </h1>
          <p style={{ 
            color: '#ff6b9d', 
            marginBottom: '30px',
            padding: '0 10px',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)'
          }}>
            Agrega algunos productos deliciosos a tu carrito
          </p>
          <Link
            to="/productos"
            style={{
              display: 'inline-block',
              backgroundColor: '#ff6b9d',
              color: '#ffdae6ff',
              padding: '12px 24px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              border: '2px solid #ff91a4',
              transition: 'all 0.3s ease',
              margin: '0 10px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff6b9d';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff6b9d';
              e.target.style.color = '#fcdbe6ff';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)', 
      padding: '15px' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Header del carrito */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(255, 182, 193, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#ffb6c1',
                padding: '10px',
                borderRadius: '10px',
                color: '#ff6b9d',
                flexShrink: 0
              }}>
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: 'clamp(1.3rem, 5vw, 1.6rem)', 
                  fontWeight: 'bold', 
                  color: '#ff6b9d', 
                  margin: 0,
                  fontFamily: "'Quicksand', sans-serif"
                }}>
                  Mi Carrito
                </h1>
                <p style={{ 
                  color: '#ff6b9d', 
                  margin: 0,
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                }}>
                  {cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              width: '100%',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={clearCart}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#ff95b8ff',
                  border: '2px solid #ff91a4',
                  color: '#ffdce2ff',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b9d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff95b8ff';
                  e.target.style.color = '#ffe7ebff';
                }}
              >
                Vaciar Carrito
              </button>
              
              <Link
                to="/productos"
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#ff95b8ff',
                  border: '2px solid #ff91a4',
                  color: '#fff1f3ff',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b9d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff95b8ff';
                  e.target.style.color = '#ffe7ebff';
                }}
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: '20px'
        }}>
          {/* Lista de productos - Ahora arriba en móvil */}
          <div>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '15px',
              padding: '15px',
              boxShadow: '0 8px 25px rgba(255, 182, 193, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                color: '#ff6b9d', 
                marginBottom: '15px',
                fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
              }}>
                Productos en el carrito
              </h2>
              {cartItems.map((item) => {
                const finalPrice = getFinalPrice ? getFinalPrice(item) : item.price;
                const itemTotal = finalPrice * item.quantity;
                const hasIndividualDiscount = item.discountedPrice && item.discountedPrice < item.price;
                
                return (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderBottom: '2px solid #ffd1dc',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    flexWrap: 'wrap'
                  }}>
                    <img
                      src={item.imageUrl || item.imgSrc || "/img/placeholder.jpg"}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #ff6b9d',
                        flexShrink: 0
                      }}
                    />
                    <div style={{ 
                      flex: 1,
                      minWidth: '200px'
                    }}>
                      <h3 style={{ 
                        fontWeight: 'bold', 
                        color: '#ff6b9d', 
                        margin: '0 0 5px 0',
                        fontSize: 'clamp(0.9rem, 3vw, 1rem)'
                      }}>
                        {item.name}
                      </h3>
                      <div style={{ 
                        color: '#d63384', 
                        margin: '0 0 8px 0',
                        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                      }}>
                        {hasIndividualDiscount ? (
                          <div>
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '6px' }}>
                              ${item.price}
                            </span>
                            <span style={{ color: '#ff6b9d', fontWeight: 'bold' }}>
                              ${item.discountedPrice}
                            </span>
                            <div style={{ fontSize: '0.75rem', color: '#ff6b9d', marginTop: '2px' }}>
                              🎁 Descuento individual
                            </div>
                          </div>
                        ) : (
                          <span>${item.price}</span>
                        )}
                        <div style={{ marginTop: '4px' }}>
                          x {item.quantity} = <strong>${itemTotal.toFixed(2)}</strong>
                        </div>
                        {discountApplied && hasIndividualDiscount && (
                          <div style={{ fontSize: '0.75rem', color: '#4caf50', marginTop: '2px' }}>
                            ✅ + Descuento general
                          </div>
                        )}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        alignItems: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ffd1dc',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              minWidth: '30px'
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ffd1dc',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              minWidth: '30px'
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RESUMEN DE COMPRA - Ahora abajo en móvil */}
          <div>
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '15px',
              padding: '15px',
              boxShadow: '0 8px 25px rgba(255, 182, 193, 0.2)',
              backdropFilter: 'blur(10px)',
              position: 'sticky',
              top: '15px'
            }}>
              <h2 style={{ 
                color: '#ff6b9d', 
                marginBottom: '15px',
                fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
              }}>
                Resumen de compra
              </h2>
              
              {/* Cupón de descuento */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '8px'
                }}>
<input
  type="text"
  placeholder="Código de descuento"
  value={discountInput}
  onChange={(e) => setDiscountInput(e.target.value)}
  style={{
    width: '100%',
    padding: '10px',
    border: '2px solid #ffd1dc',
    borderRadius: '8px',
    fontSize: '16px', // Forzar 16px
    boxSizing: 'border-box',
    minHeight: '44px' // Altura mínima táctil
  }}
  className="discount-input-field"
/>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!discountApplied ? (
                      <button
                        onClick={handleDiscountApply}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#ff6b9d',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'rgba(255, 244, 248, 1)',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                        }}
                      >
                        Aplicar
                      </button>
                    ) : (
                      <button
                        onClick={handleDiscountRemove}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#ff6b6b',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                        }}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>
                {discountError && (
                  <div style={{ 
                    color: '#ff6b6b', 
                    fontSize: '0.75rem', 
                    marginTop: '5px',
                    textAlign: 'center'
                  }}>
                    {discountError}
                  </div>
                )}
                {discountApplied && (
                  <div style={{ 
                    color: '#4caf50', 
                    fontSize: '0.75rem', 
                    marginTop: '5px',
                    textAlign: 'center'
                  }}>
                    ✅ Código {discountCode} aplicado
                  </div>
                )}
              </div>

              {/* Totales */}
              <div style={{ 
                borderTop: '2px solid #ffd1dc', 
                paddingTop: '12px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '8px' 
                }}>
                  <span>Subtotal sin descuento:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                
                {discountApplied && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px', 
                    color: '#4caf50' 
                  }}>
                    <span>Descuento:</span>
                    <span>-${getTotalDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontWeight: 'bold', 
                  fontSize: 'clamp(1rem, 4vw, 1.1rem)', 
                  color: '#ff6b9d',
                  borderTop: '1px solid #ffd1dc',
                  paddingTop: '8px',
                  marginTop: '8px'
                }}>
                  <span>Total:</span>
                  <span>${getDiscountedTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Botón Finalizar Compra */}
              <button
                onClick={handleFinalizarCompra}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#ff6b9d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  cursor: 'pointer',
                  marginTop: '15px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b9d';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ff98bbff';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Formulario Cliente */}
      {showCustomerForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 182, 193, 0.3)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '15px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
            padding: '25px 20px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '350px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(255, 105, 180, 0.3)',
            border: '2px solid #ffb6c1',
            margin: '15px'
          }}>

            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#ffd1dc',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              border: '2px solid #ff91a4'
            }}>
              <svg style={{ width: '22px', height: '22px', color: '#ff91a4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <h2 style={{ 
              color: '#ff6b9d', 
              marginBottom: '12px',
              fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
              fontWeight: 'bold'
            }}>
              Tus datos
            </h2>
            
            <p style={{ 
              color: '#d63384', 
              marginBottom: '18px',
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
            }}>
              Para personalizar tu pedido
            </p>

            <div style={{ marginBottom: '18px' }}>
              {/* Campo Nombre */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid #ffd1dc'
              }}>
                <svg style={{ width: '16px', height: '16px', color: '#ff91a4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
<input
  type="text"
  name="nombre"
  placeholder="Nombre"
  value={customerData.nombre}
  onChange={handleCustomerInput}
  style={{
    flex: 1,
    padding: '6px 0',
    border: 'none',
    fontSize: '16px', // Forzar 16px
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: "'Quicksand', sans-serif",
    minHeight: '44px' // Altura mínima táctil
  }}
  className="customer-name-field"
/>
              </div>

              {/* Campo Apellido */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '2px solid #ffd1dc'
              }}>
                <svg style={{ width: '16px', height: '16px', color: '#ff91a4' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
<input
  type="text"
  name="apellido"
  placeholder="Apellido"
  value={customerData.apellido}
  onChange={handleCustomerInput}
  style={{
    flex: 1,
    padding: '6px 0',
    border: 'none',
    fontSize: '16px', // Forzar 16px
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: "'Quicksand', sans-serif",
    minHeight: '44px' // Altura mínima táctil
  }}
  className="customer-name-field"
/>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '10px'
            }}>
              <button
                onClick={() => setShowCustomerForm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '2px solid #ff91a4',
                  borderRadius: '10px',
                  color: '#ff91a4',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b9d';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffa6c3ff';
                  e.target.style.color = '#fffafbff';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarDatos}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#ff91a4',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ff6b9d';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffa6c3ff';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago CON OPCIONES */}
      {showPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '15px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            margin: '15px'
          }}>
            <h2 style={{ 
              color: '#ff6b9d', 
              marginBottom: '15px',
              fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
            }}>
              Método de Pago
            </h2>
            
            {/* Selector de Método de Pago */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '15px'
              }}>
<button
  onClick={() => setSelectedPayment('transferencia')}
  style={{
    padding: '12px 16px',
    backgroundColor: selectedPayment === 'transferencia' ? '#ff6b9d' : '#ffd1dc',
    border: '2px solid #ff91a4',
    borderRadius: '10px',
    color: selectedPayment === 'transferencia' ? 'white' : '#ff91a4',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '16px', // Forzar 16px
    minHeight: '44px' // Altura mínima táctil
  }}
  className="payment-button"
>
  💳 Transferencia
</button>
                <button
                  onClick={() => setSelectedPayment('efectivo')}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: selectedPayment === 'efectivo' ? '#ff6b9d' : '#ffd1dc',
                    border: '2px solid #ff91a4',
                    borderRadius: '10px',
                    color: selectedPayment === 'efectivo' ? 'white' : '#ff91a4',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                  }}
                >
                  💵 Efectivo
                </button>
              </div>
            </div>

            {/* Contenido según método seleccionado */}
            {selectedPayment === 'transferencia' && (
              <div style={{ 
                backgroundColor: '#fff0f5', 
                padding: '15px', 
                borderRadius: '12px',
                marginBottom: '15px'
              }}>
                <h3 style={{ 
                  color: '#ff6b9d', 
                  marginBottom: '12px',
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)'
                }}>
                  Transferencia Bancaria
                </h3>
                
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ 
                    fontWeight: 'bold', 
                    color: '#d63384', 
                    marginBottom: '5px',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                  }}>
                    Alias:
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <code style={{ 
                      backgroundColor: '#ffd1dc', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                      color: '#d63384',
                      wordBreak: 'break-all'
                    }}>
                      {alias}
                    </code>
                    <button
                      onClick={copyAlias}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: copied ? '#4caf50' : '#ff6b9d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                      }}
                    >
                      {copied ? '✓ Copiado' : 'Copiar Alias'}
                    </button>
                  </div>
                </div>

                <p style={{ 
                  color: '#d63384', 
                  fontSize: 'clamp(0.75rem, 3vw, 0.85rem)'
                }}>
                  Realiza la transferencia por <strong>${getDiscountedTotal().toFixed(2)}</strong> y luego envía el comprobante
                </p>
              </div>
            )}

            {selectedPayment === 'efectivo' && (
              <div style={{ 
                backgroundColor: '#f0fff4', 
                padding: '15px', 
                borderRadius: '12px',
                marginBottom: '15px'
              }}>
                <h3 style={{ 
                  color: '#ff6b9d', 
                  marginBottom: '12px',
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)'
                }}>
                  Pago en Efectivo
                </h3>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#ffc8dbff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <svg style={{ width: '25px', height: '25px', color: '#ff6b9d' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p style={{ 
                    color: '#ff6b9d', 
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)', 
                    marginBottom: '8px' 
                  }}>
                    <strong>Total a pagar: ${getDiscountedTotal().toFixed(2)}</strong>
                  </p>
                  <p style={{ 
                    color: '#ff6b9d', 
                    fontSize: 'clamp(0.75rem, 3vw, 0.8rem)'
                  }}>
                    Coordinaremos la entrega y el pago en efectivo al momento de la entrega
                  </p>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '8px'
            }}>
              <button
                onClick={() => setShowPayment(false)}
                style={{
                  padding: '10px',
                  backgroundColor: '#ffd1dc',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ff6b9d',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                }}
              >
                Volver
              </button>
              
              {selectedPayment === 'transferencia' && (
                <button
                  onClick={() => sendToWhatsApp('transferencia')}
                  disabled={processing}
                  style={{
                    padding: '10px',
                    backgroundColor: processing ? '#ccc' : '#25D366',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                  }}
                >
                  {processing ? 'Procesando...' : 'Enviar Comprobante'}
                </button>
              )}
              
              {selectedPayment === 'efectivo' && (
                <button
                  onClick={() => sendToWhatsApp('efectivo')}
                  disabled={processing}
                  style={{
                    padding: '10px',
                    backgroundColor: processing ? '#ccc' : '#4caf50',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
                  }}
                >
                  {processing ? 'Procesando...' : 'Coordinar Pago'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '15px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            width: '100%',
            maxWidth: '350px',
            textAlign: 'center',
            margin: '15px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}>
              <svg style={{ width: '25px', height: '25px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ 
              color: '#4caf50', 
              marginBottom: '8px',
              fontSize: 'clamp(1.1rem, 4vw, 1.3rem)'
            }}>
              ¡Compra Exitosa!
            </h2>
            <p style={{ 
              color: '#666',
              fontSize: 'clamp(0.8rem, 3vw, 0.9rem)'
            }}>
              Tu pedido ha sido procesado correctamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
<style>
  {`
    /* Prevenir zoom en dispositivos móviles */
    @media (max-width: 768px) {
      input[type="text"],
      input[type="number"],
      input[type="tel"],
      input[type="email"],
      input[type="url"],
      input[type="password"],
      input[type="search"],
      input[type="datetime-local"],
      textarea,
      select {
        font-size: 16px !important;
        transform: scale(1);
      }
      
      /* Asegurar que los inputs no causen zoom */
      .form-input,
      .discount-input,
      .customer-input {
        font-size: 16px !important;
        min-height: 44px !important;
      }
      
      /* Prevenir zoom en focus */
      input:focus,
      textarea:focus,
      select:focus {
        font-size: 16px !important;
        transform: none !important;
      }
    }

    /* Estilos específicos para los inputs problemáticos */
    .discount-input-field {
      font-size: 16px !important;
      min-height: 44px !important;
    }
    
    .customer-name-field {
      font-size: 16px !important;
      min-height: 44px !important;
    }
    
    .payment-button {
      min-height: 44px !important;
      font-size: 16px !important;
    }

    /* Viewport fix para iOS */
    @viewport {
      width: device-width;
      zoom: 1.0;
      min-zoom: 1.0;
      max-zoom: 1.0;
      user-zoom: fixed;
    }
  `}
</style>

export default Cart;