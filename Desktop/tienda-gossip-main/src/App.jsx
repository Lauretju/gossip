import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SalesProvider } from './context/SalesContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Body from './components/Body';
import ProductsList from './pages/ProductsList';
import Cart from "./pages/Cart";  // Sin llaves {}
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from "./pages/SalesDashboard"; // ← CAMBIADO: de './pages/admin/SalesDashboard' a './pages/SalesDashboard'
// import QRScanner from './components/QRScanner';
// import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SalesProvider>
          <Router>
            <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
              <Header />
              <Routes>
                <Route path="/" element={<Body />} />
                <Route path="/productos" element={<ProductsList />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* NUEVA RUTA CORREGIDA */}
                <Route 
                  path="/admin/ventas" 
                  element={
                    <ProtectedRoute adminOnly>
                      <SalesDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </SalesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;