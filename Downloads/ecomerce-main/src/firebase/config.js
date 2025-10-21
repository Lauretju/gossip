import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase - REEMPLAZA CON TUS DATOS REALES
const firebaseConfig = {
  apiKey: "AIzaSyBA6ebcCb12-V1ITMXNPHydQYiQVGiNkPE",
  authDomain: "tiendagosip.firebaseapp.com",
  projectId: "tiendagosip",
  storageBucket: "tiendagosip.firebasestorage.app",
  messagingSenderId: "620071885123",
  appId: "1:620071885123:web:78c1f72258892a11a2b7f6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;