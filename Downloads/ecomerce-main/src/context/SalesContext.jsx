// src/context/SalesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

// Crear el contexto
const SalesContext = createContext();

// Hook personalizado para usar el contexto
export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales debe ser usado dentro de un SalesProvider');
  }
  return context;
};

// Proveedor del contexto
export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Registrar una nueva venta
  const registerSale = async (saleData) => {
    try {
      setLoading(true);
      console.log('📝 Registrando venta:', saleData);
      
      // Validar datos requeridos
      if (!saleData.items || saleData.items.length === 0) {
        throw new Error('La venta debe contener al menos un producto');
      }

      // Crear objeto de venta completo para Firestore
      const saleWithTimestamp = {
        ...saleData,
        // Información del cliente
        customerName: saleData.customerName || user?.displayName?.split(' ')[0] || 'Cliente',
        customerLastName: saleData.customerLastName || user?.displayName?.split(' ')[1] || '',
        userEmail: user?.email || 'guest@ejemplo.com',
        userName: user?.displayName || saleData.customerName || 'Usuario',
        userLastName: user?.displayName?.split(' ')[1] || saleData.customerLastName || '',
        
        // Timestamps
        date: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        
        // Metadatos adicionales para mejor persistencia
        status: 'completed',
        syncStatus: 'synced',
        version: 1
      };

      console.log('💾 Guardando venta en Firestore...', saleWithTimestamp);
      
      // Actualizar stock de productos (si existen)
      if (saleData.items.some(item => item.productId)) {
        await updateProductStock(saleData.items);
      }
      
      // Registrar la venta en Firestore
      const saleRef = await addDoc(collection(db, 'sales'), saleWithTimestamp);
      
      console.log('✅ Venta registrada permanentemente con ID:', saleRef.id);
      return saleRef.id;
    } catch (error) {
      console.error('❌ Error registrando venta:', error);
      throw new Error(`No se pudo registrar la venta: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar stock de productos
  const updateProductStock = async (items) => {
    try {
      const updatePromises = items.map(async (item) => {
        if (!item.productId) {
          console.warn('⚠️ Producto sin ID, no se actualiza stock:', item.name);
          return;
        }

        const productRef = doc(db, 'products', item.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.data();
          const currentStock = productData.stock || 0;
          const newStock = currentStock - (item.quantity || 1);
          
          console.log(`📦 Actualizando stock producto ${item.name}: ${currentStock} -> ${newStock}`);
          
          await updateDoc(productRef, {
            stock: Math.max(0, newStock),
            lastUpdated: Timestamp.now()
          });
        } else {
          console.warn(`⚠️ Producto no encontrado en Firestore: ${item.productId}`);
        }
      });

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('❌ Error actualizando stock:', error);
      // No lanzamos error aquí para no interrumpir el registro de la venta
    }
  };

  // Obtener ventas con filtros
  const getSales = async (filters = {}) => {
    try {
      setLoading(true);
      console.log('🔍 Buscando ventas con filtros:', filters);
      
      let q = collection(db, 'sales');
      const constraints = [];

      // Filtro por fecha
      if (filters.startDate) {
        const startDate = filters.startDate instanceof Date ? 
          filters.startDate : new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
      }
      
      if (filters.endDate) {
        const endDate = filters.endDate instanceof Date ? 
          new Date(filters.endDate) : new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
      }

      // Filtro por estado de pago
      if (filters.paymentStatus && filters.paymentStatus !== 'all') {
        constraints.push(where('paymentStatus', '==', filters.paymentStatus));
      }

      // Ordenar por fecha más reciente primero
      constraints.push(orderBy('date', 'desc'));

      q = query(q, ...constraints);
      const querySnapshot = await getDocs(q);
      
      const salesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Asegurar que date sea un Timestamp de Firestore
        date: doc.data().date || doc.data().createdAt || Timestamp.now()
      }));
      
      console.log('📊 Ventas encontradas en Firestore:', salesData.length);
      setSales(salesData);
      return salesData;
    } catch (error) {
      console.error('❌ Error obteniendo ventas:', error);
      throw new Error(`No se pudieron cargar las ventas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las ventas (sin filtros)
  const getAllSales = async () => {
    return await getSales({});
  };

  // Actualizar estado de pago de una venta
  const updateSaleStatus = async (saleId, newStatus) => {
    try {
      setLoading(true);
      console.log(`🔄 Actualizando estado de venta ${saleId} a:`, newStatus);
      
      const saleRef = doc(db, 'sales', saleId);
      
      // Verificar que la venta existe
      const saleSnap = await getDoc(saleRef);
      if (!saleSnap.exists()) {
        throw new Error('La venta no existe');
      }

      // Actualizar en Firestore
      await updateDoc(saleRef, {
        paymentStatus: newStatus,
        updatedAt: Timestamp.now()
      });

      console.log('✅ Estado de venta actualizado correctamente');
      
      // Actualizar el estado local inmediatamente
      setSales(prevSales => 
        prevSales.map(sale => 
          sale.id === saleId 
            ? { 
                ...sale, 
                paymentStatus: newStatus,
                updatedAt: Timestamp.now()
              }
            : sale
        )
      );

      return true;
    } catch (error) {
      console.error('❌ Error al actualizar el estado de la venta:', error);
      throw new Error(`No se pudo actualizar el estado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Escuchar ventas en tiempo real para actualizaciones automáticas
  useEffect(() => {
    if (!user) {
      console.log('👤 Usuario no autenticado, limpiando ventas');
      setSales([]);
      return;
    }

    console.log('👂 Iniciando listener en tiempo real para ventas...');
    
    try {
      const q = query(
        collection(db, 'sales'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const salesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date || doc.data().createdAt
          }));
          console.log('🔄 Ventas actualizadas desde Firestore:', salesData.length);
          setSales(salesData);
        },
        (error) => {
          console.error('❌ Error en listener de ventas:', error);
          // En caso de error, intentar cargar ventas manualmente
          getAllSales().catch(e => console.error('Error de respaldo:', e));
        }
      );

      // Cleanup al desmontar el componente o cambiar usuario
      return () => {
        console.log('🔇 Desconectando listener de ventas');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Error configurando listener de ventas:', error);
    }
  }, [user]);

  // Cargar ventas iniciales al montar el componente
  useEffect(() => {
    if (user) {
      console.log('🚀 Cargando ventas iniciales desde Firestore...');
      getAllSales().catch(error => 
        console.error('Error cargando ventas iniciales:', error)
      );
    }
  }, [user]);

  const value = {
    sales,
    loading,
    registerSale,
    getSales,
    getAllSales,
    updateSaleStatus
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

// Exportar por defecto el Provider
export default SalesProvider;