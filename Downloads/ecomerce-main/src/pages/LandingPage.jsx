import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Bienvenido a MiTienda
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubre los mejores productos con precios increíbles y servicio de calidad.
        </p>
        <Link
          to="/productos"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 inline-block"
        >
          Ver Productos
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;