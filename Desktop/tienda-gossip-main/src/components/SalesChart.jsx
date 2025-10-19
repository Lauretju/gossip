// src/components/SalesChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';

const SalesChart = ({ sales }) => {
  // Agrupar ventas por día
  const salesByDay = sales.reduce((acc, sale) => {
    if (!sale.date) return acc;
    
    const date = sale.date.toDate().toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, total: 0, count: 0 };
    }
    acc[date].total += sale.total || 0;
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(salesByDay)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-30); // Últimos 30 días

  if (chartData.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Evolución de Ventas
        </Typography>
        <Typography color="textSecondary" textAlign="center" py={4}>
          No hay datos de ventas para mostrar
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Evolución de Ventas (Últimos 30 días)
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            stroke="#8884d8" 
            name="Total Ventas ($)" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#82ca9d" 
            name="Cantidad Ventas" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesChart;