import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 Iniciando suscripción a Firestore...');
    
    try {
      const productsCollection = collection(db, 'por defecto');
      console.log('📂 Colección:', productsCollection);
      
      const unsubscribe = onSnapshot(
        productsCollection,
        (snapshot) => {
          console.log('✅ Snapshot recibido:', snapshot.docs.length, 'documentos');
          
          const productsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log('🛍️ Productos cargados:', productsData);
          setProducts(productsData);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('❌ Error fetching products:', error);
          console.error('Código del error:', error.code);
          console.error('Mensaje del error:', error.message);
          setError(error);
          setLoading(false);
        }
      );

      return () => {
        console.log('🧹 Limpiando suscripción...');
        unsubscribe();
      };
    } catch (error) {
      console.error('❌ Error en useEffect:', error);
      setError(error);
      setLoading(false);
    }
  }, []);

  const addProduct = async (product) => {
    try {
      const docRef = await addDoc(collection(db, 'por defecto'), {
        ...product,
        createdAt: new Date()
      });
      return docRef;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, product) => {
    try {
      await updateDoc(doc(db, 'por defecto', id), product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'por defecto', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};