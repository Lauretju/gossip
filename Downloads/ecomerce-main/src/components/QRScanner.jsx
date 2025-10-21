import React from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Escáner QR</h1>
      <p>Funcionalidad de escáner QR - En desarrollo</p>
      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Volver
      </button>
    </div>
  );
};

export default QRScanner;