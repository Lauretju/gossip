import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState(null);
  const [offerActive, setOfferActive] = useState(false);

  // Calcular tiempo restante para ofertas limitadas
  useEffect(() => {
    if (product.timeLimitedOfferEnd) {
      const offerEnd = new Date(product.timeLimitedOfferEnd);
      const now = new Date();
      
      if (offerEnd > now) {
        setOfferActive(true);
        
        const updateCountdown = () => {
          const now = new Date();
          const difference = offerEnd - now;
          
          if (difference <= 0) {
            setOfferActive(false);
            setTimeLeft(null);
            return;
          }
          
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft({ days, hours, minutes, seconds });
        };
        
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        
        return () => clearInterval(interval);
      }
    }
  }, [product.timeLimitedOfferEnd]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 relative">
      {/* Badge de oferta */}
      {offerActive && hasDiscount && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          -{discountPercentage}%
        </div>
      )}
      
      {/* Countdown timer */}
      {offerActive && timeLeft && (
        <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold z-10">
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {timeLeft.hours.toString().padStart(2, '0')}:
          {timeLeft.minutes.toString().padStart(2, '0')}:
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
      )}

      {/* Imagen del producto */}
      <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM3 10a7 7 0 1114 0 7 7 0 01-14 0z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Precios */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-green-600">
                  ${product.discountedPrice}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                ${product.price}
              </span>
            )}
          </div>
          
          {/* Etiqueta de oferta limitada */}
          {offerActive && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Oferta
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Agregar al Carrito</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;