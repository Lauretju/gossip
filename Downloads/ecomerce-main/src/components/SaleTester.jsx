// src/components/SaleTester.jsx
import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { useSales } from '../context/SalesContext';

const SaleTester = () => {
  const { registerSale, sales } = useSales();
  const [creating, setCreating] = useState(false);

  const createTestSale = async () => {
    setCreating(true);
    try {
      const testSale = {
        total: Math.floor(Math.random() * 1000) + 50,
        subtotal: Math.floor(Math.random() * 800) + 40,
        tax: Math.floor(Math.random() * 100) + 5,
        paymentStatus: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
        paymentMethod: ['card', 'cash', 'transfer'][Math.floor(Math.random() * 3)],
        customerName: 'Cliente',
        customerLastName: 'Test',
        items: [
          {
            productId: `prod-test-${Date.now()}`,
            name: 'Producto de Prueba Premium',
            quantity: Math.floor(Math.random() * 3) + 1,
            price: Math.floor(Math.random() * 100) + 10,
            category: 'test'
          },
          {
            productId: `prod-test-${Date.now() + 1}`,
            name: 'Accesorio Test',
            quantity: 1,
            price: 25,
            category: 'test'
          }
        ]
      };

      const saleId = await registerSale(testSale);
      alert(`✅ Venta de prueba creada exitosamente!\nID: ${saleId}\nTotal: $${testSale.total}`);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, background: '#f0f8ff' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
        🧪 Probador de Ventas Permanentes
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={createTestSale}
          disabled={creating}
          sx={{
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)'
            }
          }}
        >
          {creating ? 'Creando...' : '➕ Crear Venta de Prueba'}
        </Button>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Ventas en sistema: <strong>{sales.length}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Total: <strong>${sales.reduce((sum, sale) => sum + (sale.total || 0), 0).toLocaleString()}</strong>
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
        💡 Las ventas se guardan permanentemente en Firestore y persisten después de recargar la página.
      </Typography>
    </Paper>
  );
};

export default SaleTester;