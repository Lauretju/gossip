// src/pages/SalesDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  Collapse,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  alpha
} from '@mui/material';
import { 
  KeyboardArrowDown, 
  KeyboardArrowUp,
  Person,
  ShoppingBag,
  Payment,
  PendingActions,
  Refresh,
  TrendingUp,
  LocalOffer,
  Schedule,
  People
} from '@mui/icons-material';
import { useSales } from '../context/SalesContext';

const SalesDashboard = () => {
  const { sales, loading, getSales, getAllSales } = useSales();
  const [dateFilter, setDateFilter] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [expandedRows, setExpandedRows] = useState({});
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadSales();
  }, [dateFilter, startDate, endDate, paymentFilter]);

  const loadSales = async () => {
    const filters = { paymentStatus: paymentFilter };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'today':
        filters.startDate = today;
        filters.endDate = new Date();
        break;
      case 'last7':
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        filters.startDate = last7;
        filters.endDate = new Date();
        break;
      case 'custom':
        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          
          filters.startDate = start;
          filters.endDate = end;
        }
        break;
      default:
        break;
    }

    await getSales(filters);
  };

  const handleRefresh = () => {
    loadSales();
  };

  const handleLoadAll = () => {
    getAllSales();
    setDateFilter('today');
    setStartDate('');
    setEndDate('');
    setPaymentFilter('all');
  };

  const toggleRow = (saleId) => {
    setExpandedRows(prev => ({
      ...prev,
      [saleId]: !prev[saleId]
    }));
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      approved: 'Aprobado',
      pending: 'Pendiente',
      rejected: 'Rechazado'
    };
    return texts[status] || status;
  };

  // Función para formatear fechas de Firestore
  const formatFirestoreDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    try {
      if (timestamp.toDate) {
        if (isMobile) {
          return timestamp.toDate().toLocaleString('es-ES', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        return timestamp.toDate().toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      if (timestamp instanceof Date) {
        if (isMobile) {
          return timestamp.toLocaleString('es-ES', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        return timestamp.toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return 'Fecha no disponible';
    } catch (error) {
      console.error('Error formateando fecha:', error, timestamp);
      return 'Fecha inválida';
    }
  };

  // Calcular estadísticas
  const totalVentas = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const ventasPendientes = sales.filter(sale => sale.paymentStatus === 'pending').length;
  const ventasAprobadas = sales.filter(sale => sale.paymentStatus === 'approved').length;
  const ventasRechazadas = sales.filter(sale => sale.paymentStatus === 'rejected').length;

  // Obtener nombre completo del cliente
  const getCustomerName = (sale) => {
    if (sale.customerName && sale.customerLastName) {
      if (isMobile) {
        return `${sale.customerName} ${sale.customerLastName.charAt(0)}.`;
      }
      return `${sale.customerName} ${sale.customerLastName}`;
    }
    if (sale.userName && sale.userLastName) {
      if (isMobile) {
        return `${sale.userName} ${sale.userLastName.charAt(0)}.`;
      }
      return `${sale.userName} ${sale.userLastName}`;
    }
    if (isMobile) {
      return sale.userEmail?.split('@')[0] || 'Cliente';
    }
    return sale.userEmail || 'Cliente no registrado';
  };

  // Obtener email del cliente
  const getCustomerEmail = (sale) => {
    return sale.userEmail || 'No registrado';
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
          p: 2
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(219, 39, 119, 0.3)'
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            💖 Cargando ventas...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Preparando tu dashboard rosa
          </Typography>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        p: { xs: 1, sm: 2, md: 3 }
      }}
    >
      {/* Header con gradiente rosa */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: { xs: 3, sm: 4, md: 5 },
        background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
        borderRadius: '20px',
        p: { xs: 3, sm: 4 },
        color: 'white',
        boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%'
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%'
        }} />
        
        <Typography 
          variant={isMobile ? "h4" : "h3"}
          sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontFamily: "'Quicksand', sans-serif",
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            textShadow: '0 2px 10px rgba(219, 39, 119, 0.3)'
          }}
        >
          💖 Dashboard de Ventas
        </Typography>
        <Typography 
          variant={isMobile ? "body1" : "h6"}
          sx={{ 
            opacity: 0.9,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: '0 1px 5px rgba(219, 39, 119, 0.2)'
          }}
        >
          Monitorea y gestiona todas tus transacciones en tiempo real
        </Typography>
        

      </Box>

      {/* Filtros con diseño de cristal rosa */}
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 3, sm: 4 },
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(251, 207, 232, 0.8)',
          borderRadius: '20px',
          boxShadow: '0 15px 35px rgba(236, 72, 153, 0.1), 0 5px 15px rgba(219, 39, 119, 0.07)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ff6b9d',
                fontWeight: 'bold',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TrendingUp sx={{ color: '#ff6b9d' }} />
              Filtros Avanzados
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#ff6b9d',
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              Filtra por fecha y estado de pago
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Button
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 7px 14px rgba(236, 72, 153, 0.4)'
                },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
              }}
              fullWidth={isMobile}
            >
              Actualizar
            </Button>
            <Button
              onClick={handleLoadAll}
              variant="outlined"
              sx={{
                borderColor: '#ff6b9d',
                color: '#ff6b9d',
                '&:hover': {
                  borderColor: '#ff6b9d',
                  backgroundColor: 'rgba(236, 72, 153, 0.04)',
                  transform: 'translateY(-2px)'
                },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                py: { xs: 1, sm: 1.5 },
                borderRadius: '12px',
                transition: 'all 0.3s ease'
              }}
              fullWidth={isMobile}
            >
              Ver Todas
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel sx={{ color: '#ff6b9d' }}>Filtro de Fecha</InputLabel>
              <Select
                value={dateFilter}
                label="Filtro de Fecha"
                onChange={(e) => setDateFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbcfe8',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f9a8d4',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b9d',
                  },
                  borderRadius: '12px'
                }}
              >
                <MenuItem value="today">Hoy</MenuItem>
                <MenuItem value="last7">Últimos 7 días</MenuItem>
                <MenuItem value="custom">Rango Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {dateFilter === 'custom' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Inicio"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fbcfe8',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f9a8d4',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ff6b9d',
                    },
                    borderRadius: '12px'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Fin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#fbcfe8',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f9a8d4',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ff6b9d',
                    },
                    borderRadius: '12px'
                  }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={dateFilter === 'custom' ? 3 : 9}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel sx={{ color: '#ff6b9d' }}>Estado de Pago</InputLabel>
              <Select
                value={paymentFilter}
                label="Estado de Pago"
                onChange={(e) => setPaymentFilter(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fbcfe8',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f9a8d4',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b9d',
                  },
                  borderRadius: '12px'
                }}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="approved">✅ Aprobado</MenuItem>
                <MenuItem value="pending">⏳ Pendiente</MenuItem>
                <MenuItem value="rejected">❌ Rechazado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Cards de estadísticas en tonos rosas */}
      <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)',
              color: 'white',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(236, 72, 153, 0.5)'
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
              <Box sx={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '12px',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <ShoppingBag sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Typography color="inherit" gutterBottom variant={isMobile ? "body2" : "h6"} sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: '600',
                opacity: 0.9
              }}>
                Total Ventas
              </Typography>
              <Typography variant={isMobile ? "h6" : "h4"} sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                textShadow: '0 2px 4px rgba(219, 39, 119, 0.3)'
              }}>
                ${totalVentas.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #f472b6 0%, #ff6b9d 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(244, 114, 182, 0.4)',
              color: 'white',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(244, 114, 182, 0.5)'
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
              <Box sx={{
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '12px',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Payment sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Typography color="inherit" gutterBottom variant={isMobile ? "body2" : "h6"} sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: '600',
                opacity: 0.9
              }}>
                {isMobile ? 'Transac.' : 'Transacciones'}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h4"} sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                textShadow: '0 2px 4px rgba(219, 39, 119, 0.3)'
              }}>
                {sales.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(249, 168, 212, 0.4)',
              color: '#ff6b9d',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(249, 168, 212, 0.5)'
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
              <Box sx={{
                background: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '12px',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <LocalOffer sx={{ fontSize: { xs: 24, sm: 28 }, color: '#ff6b9d' }} />
              </Box>
              <Typography color="inherit" gutterBottom variant={isMobile ? "body2" : "h6"} sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: '600',
                opacity: 0.9
              }}>
                {isMobile ? 'Aprob.' : 'Aprobadas'}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h4"} sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                color: '#ff6b9d'
              }}>
                {ventasAprobadas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(251, 207, 232, 0.4)',
              color: '#ff6b9d',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(251, 207, 232, 0.5)'
              }
            }}
          >
            <CardContent sx={{ 
              textAlign: 'center', 
              p: { xs: 2, sm: 3 },
              '&:last-child': { pb: { xs: 2, sm: 3 } }
            }}>
              <Box sx={{
                background: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '12px',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px'
              }}>
                <Schedule sx={{ fontSize: { xs: 24, sm: 28 }, color: '#ff6b9d' }} />
              </Box>
              <Typography color="inherit" gutterBottom variant={isMobile ? "body2" : "h6"} sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                fontWeight: '600',
                opacity: 0.9
              }}>
                {isMobile ? 'Pend.' : 'Pendientes'}
              </Typography>
              <Typography variant={isMobile ? "h6" : "h4"} sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                color: '#ff6b9d'
              }}>
                {ventasPendientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Ventas en tema rosa */}
      <Paper 
        sx={{ 
          borderRadius: '20px',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(251, 207, 232, 0.8)',
          boxShadow: '0 20px 40px rgba(236, 72, 153, 0.1), 0 5px 15px rgba(219, 39, 119, 0.07)',
          overflowX: 'auto'
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: isMobile ? 600 : 'auto' }}>
            <TableHead>
              <TableRow 
                sx={{ 
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #ff6b9d 100%)'
                }}
              >
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  width: isMobile ? '40px' : '60px',
                  py: isMobile ? 1.5 : 2,
                  border: 'none'
                }} />
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  border: 'none'
                }}>
                  {isMobile ? '📅 Fecha' : '📅 Fecha y Hora'}
                </TableCell>
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  border: 'none'
                }}>
                  {isMobile ? '💰 Total' : '💰 Monto Total'}
                </TableCell>
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  border: 'none'
                }}>
                  📊 Estado
                </TableCell>
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  border: 'none'
                }}>
                  {isMobile ? '🛍️ Items' : '🛍️ Productos'}
                </TableCell>
                <TableCell sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  py: isMobile ? 1.5 : 2,
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  border: 'none'
                }}>
                  👤 Cliente
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <React.Fragment key={sale.id}>
                  <TableRow 
                    sx={{ 
                      '&:nth-of-type(even)': {
                        backgroundColor: '#fdf2f8'
                      },
                      '&:hover': {
                        backgroundColor: '#fce7f3',
                        transform: 'scale(1.002)',
                        transition: 'all 0.2s ease'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(sale.id)}
                        sx={{
                          color: '#ff6b9d',
                          '&:hover': {
                            backgroundColor: 'rgba(236, 72, 153, 0.1)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {expandedRows[sale.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <Typography variant="body2" sx={{ 
                        color: '#ff6b9d', 
                        fontWeight: '500',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}>
                        {formatFirestoreDate(sale.date)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <Typography variant="body1" sx={{ 
                        color: '#ff6b9d', 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                        background: 'linear-gradient(135deg, #ff6b9d, #ff6b9d)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent'
                      }}>
                        ${sale.total?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <Chip 
                        label={isMobile ? getPaymentStatusText(sale.paymentStatus).substring(0, 3) : getPaymentStatusText(sale.paymentStatus)} 
                        color={getPaymentStatusColor(sale.paymentStatus)}
                        size="small"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.7rem' : '0.75rem',
                          height: isMobile ? 24 : 32,
                          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.2)'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <Typography variant="body2" sx={{ 
                        color: '#ff6b9d',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        fontWeight: '500'
                      }}>
                        {sale.items?.length || 0} {isMobile ? 'prod' : 'producto'}{sale.items?.length !== 1 ? isMobile ? 's' : 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: isMobile ? 1.5 : 2, border: 'none' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <People sx={{ 
                          color: '#ff6b9d', 
                          fontSize: isMobile ? 16 : 18 
                        }} />
                        <Typography variant="body2" sx={{ 
                          color: '#ff6b9d', 
                          fontWeight: '500',
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}>
                          {getCustomerName(sale)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRows[sale.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ 
                          margin: { xs: 1, sm: 2 }, 
                          p: { xs: 2, sm: 3 }, 
                          background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                          borderRadius: '16px',
                          border: '1px solid #fbcfe8',
                          boxShadow: '0 4px 12px rgba(236, 72, 153, 0.1)'
                        }}>
                          <Typography 
                            variant={isMobile ? "subtitle1" : "h6"}
                            gutterBottom 
                            sx={{ 
                              color: '#ff6b9d',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              fontSize: { xs: '0.9rem', sm: '1.25rem' },
                              fontWeight: '600'
                            }}
                          >
                            📋 Detalles de la Venta
                            <Chip 
                              label={`ID: ${isMobile ? sale.id.substring(0, 8) + '...' : sale.id}`}
                              size="small"
                              sx={{ 
                                background: 'rgba(236, 72, 153, 0.1)',
                                color: '#ff6b9d',
                                fontWeight: '500'
                              }}
                            />
                          </Typography>
                          
                          {/* Información del cliente */}
                          <Box sx={{ 
                            mb: 3, 
                            p: { xs: 2, sm: 2.5 }, 
                            backgroundColor: 'white', 
                            borderRadius: '12px',
                            border: '1px solid #fbcfe8',
                            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.05)'
                          }}>
                            <Typography variant="subtitle1" sx={{ 
                              color: '#ff6b9d', 
                              fontWeight: '600', 
                              mb: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <People sx={{ color: '#ff6b9d', fontSize: 20 }} />
                              Información del Cliente
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: 80
                                  }}>
                                    <strong>Nombre:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: '500'
                                  }}>
                                    {sale.customerName || sale.userName || 'No registrado'}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: 80
                                  }}>
                                    <strong>Apellido:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: '500'
                                  }}>
                                    {sale.customerLastName || sale.userLastName || 'No registrado'}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: 80
                                  }}>
                                    <strong>Email:</strong>
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: '#ff6b9d',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight: '500'
                                  }}>
                                    {getCustomerEmail(sale)}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>

                          {/* Productos */}
                          {sale.items && sale.items.length > 0 ? (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle1" sx={{ 
                                color: '#ff6b9d', 
                                fontWeight: '600', 
                                mb: 2,
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <ShoppingBag sx={{ color: '#ff6b9d', fontSize: 20 }} />
                                Productos Comprados
                              </Typography>
                              <Table size="small" sx={{ 
                                background: 'white',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(236, 72, 153, 0.05)'
                              }}>
                                <TableHead>
                                  <TableRow sx={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' }}>
                                    <TableCell sx={{ 
                                      color: '#ff6b9d', 
                                      fontWeight: '600',
                                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                      py: { xs: 1, sm: 1.5 }
                                    }}>
                                      Producto
                                    </TableCell>
                                    <TableCell sx={{ 
                                      color: '#ff6b9d', 
                                      fontWeight: '600',
                                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                      py: { xs: 1, sm: 1.5 }
                                    }}>
                                      {isMobile ? 'Cant' : 'Cantidad'}
                                    </TableCell>
                                    <TableCell sx={{ 
                                      color: '#ff6b9d', 
                                      fontWeight: '600',
                                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                      py: { xs: 1, sm: 1.5 }
                                    }}>
                                      {isMobile ? 'P.Unit' : 'Precio Unit.'}
                                    </TableCell>
                                    <TableCell sx={{ 
                                      color: '#ff6b9d', 
                                      fontWeight: '600',
                                      fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                      py: { xs: 1, sm: 1.5 }
                                    }}>
                                      Subtotal
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {sale.items.map((item, index) => (
                                    <TableRow key={index} sx={{ 
                                      '&:nth-of-type(even)': { backgroundColor: '#fdf2f8' }
                                    }}>
                                      <TableCell sx={{ 
                                        color: '#ff6b9d',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        py: { xs: 1, sm: 1.5 },
                                        fontWeight: '500'
                                      }}>
                                        {isMobile && item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name}
                                      </TableCell>
                                      <TableCell sx={{ 
                                        color: '#ff6b9d',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        py: { xs: 1, sm: 1.5 }
                                      }}>
                                        <Chip 
                                          label={item.quantity}
                                          size="small"
                                          sx={{ 
                                            background: 'rgba(236, 72, 153, 0.1)',
                                            color: '#ff6b9d',
                                            fontWeight: '600'
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell sx={{ 
                                        color: '#ff6b9d',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        py: { xs: 1, sm: 1.5 },
                                        fontWeight: '500'
                                      }}>
                                        ${item.price?.toLocaleString()}
                                      </TableCell>
                                      <TableCell sx={{ 
                                        color: '#ff6b9d', 
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                        py: { xs: 1, sm: 1.5 },
                                        background: 'linear-gradient(135deg, #ff6b9d, #ff6b9d)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent'
                                      }}>
                                        ${((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          ) : (
                            <Box sx={{ 
                              textAlign: 'center', 
                              py: 3,
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid #fbcfe8'
                            }}>
                              <Typography variant="body2" sx={{ 
                                color: '#ff6b9d', 
                                fontStyle: 'italic',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                              }}>
                                No hay información de productos disponible
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {sales.length === 0 && !loading && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
          }}>
            <Box sx={{ 
              fontSize: '4rem',
              mb: 2,
              opacity: 0.5
            }}>
              💖
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ff6b9d',
                mb: 1,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: '600'
              }}
            >
              No se encontraron ventas
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#ff6b9d',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '400px',
                margin: '0 auto'
              }}
            >
              {dateFilter !== 'all' ? 
                'No hay ventas que coincidan con los filtros aplicados' : 
                'Las ventas aparecerán aquí cuando los clientes realicen compras'
              }
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SalesDashboard;