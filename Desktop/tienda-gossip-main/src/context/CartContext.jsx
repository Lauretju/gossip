import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('gossipCakeCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('gossipCakeCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    console.log('🛍️ Agregando producto al carrito:', product);
    console.log('🎁 Descuento individual del producto:', product.discountedPrice);
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1,
                // Mantener el descuento individual si existe
                discountedPrice: product.discountedPrice || item.discountedPrice
              }
            : item
        );
      } else {
        return [...prevItems, { 
          ...product, 
          quantity: 1,
          // Preservar el descuento individual del producto
          discountedPrice: product.discountedPrice || null
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountApplied(false);
    setDiscountCode('');
    setDiscountPercentage(0);
    setDiscountError('');
  };

  // Función para obtener el total de items en el carrito
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // También puedes agregar un alias si prefieres
  const getTotalItems = () => getCartItemCount();

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // NUEVA FUNCIÓN: Obtener el precio final de un producto (considera descuentos individuales y generales)
  const getFinalPrice = (item) => {
    // Primero aplica descuento individual del producto si existe
    let finalPrice = item.price;
    
    if (item.discountedPrice && item.discountedPrice < item.price) {
      finalPrice = item.discountedPrice;
    }
    
    // Luego aplica descuento general del código si existe
    if (discountApplied && discountPercentage > 0) {
      finalPrice = finalPrice * (1 - discountPercentage);
    }
    
    return finalPrice;
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getDiscountedTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = getFinalPrice(item); // Usar la nueva función
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const getTotalDiscount = () => {
    return getTotalPrice() - getDiscountedTotal();
  };

  // Función para verificar si el código ha expirado
  const isCodigoExpirado = () => {
    const fechaExpiracion = new Date('2025-10-24T23:59:59');
    const fechaActual = new Date();
    return fechaActual > fechaExpiracion;
  };

  // Funciones de descuento
  const applyDiscountCode = (code) => {
    const validCodes = {
      'EXPO2025': 0.10,
    };

    const upperCode = code.toUpperCase().trim();

    // Verificar si el código ha expirado
    if (upperCode === 'EXPO2025' && isCodigoExpirado()) {
      setDiscountError('❌ Este código expiró el 24 de octubre de 2025');
      setDiscountApplied(false);
      setDiscountCode('');
      setDiscountPercentage(0);
      console.log('❌ Código de descuento expirado:', code);
      return false;
    }

    if (validCodes[upperCode]) {
      setDiscountApplied(true);
      setDiscountCode(upperCode);
      setDiscountPercentage(validCodes[upperCode]);
      setDiscountError('');
      
      // NO sobreescribir los discountedPrice individuales
      // Solo aplicar el descuento general en los cálculos
      console.log('🎁 Código de descuento aplicado:', upperCode);
      return true;
    } else {
      setDiscountError('Código no válido o expirado');
      setDiscountApplied(false);
      setDiscountCode('');
      setDiscountPercentage(0);
      console.log('❌ Código de descuento inválido:', code);
      return false;
    }
  };

  const removeDiscountCode = () => {
    setDiscountApplied(false);
    setDiscountCode('');
    setDiscountPercentage(0);
    setDiscountError('');
    console.log('🎁 Código de descuento removido');
  };

  // Función para obtener información del código (opcional, para mostrar en la UI)
  const getDiscountInfo = () => {
    if (discountCode === 'EXPO2025') {
      return {
        validoHasta: '24 de octubre de 2025',
        expirado: isCodigoExpirado()
      };
    }
    return null;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getDiscountedTotal,
    getTotalDiscount,
    getCartItemCount,
    getTotalItems,
    isInCart,
    applyDiscountCode,
    removeDiscountCode,
    discountApplied,
    discountCode,
    discountError,
    discountPercentage,
    getDiscountedPrice: getFinalPrice,
    getFinalPrice,
    getDiscountInfo // Nueva función para obtener info del descuento
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;