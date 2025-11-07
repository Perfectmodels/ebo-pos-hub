
import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, writeBatch, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface StockMovement {
  id: string;
  product_id: string;
  product_name?: string;
  business_id: string;
  quantity: number;
  type: 'in' | 'out';
  reason?: string;
  user_id: string;
  createdAt: Timestamp;
  created_at?: any;
}

export const useStockMovements = () => {
  const { user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = useCallback(async () => {
    if (!user) {
        setMovements([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const q = query(collection(firestore, 'stock_movements'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const movementsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockMovement));
      setMovements(movementsData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch stock movements:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  const addMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt' | 'business_id'>) => {
    if (!user) {
        const err = 'User not authenticated';
        setError(err);
        return { data: null, error: err };
    }
    try {
      const docRef = await addDoc(collection(firestore, 'stock_movements'), {
        ...movementData,
        business_id: user.uid,
        createdAt: serverTimestamp(),
      });
      await fetchMovements(); // Refresh movements list
      return { data: { id: docRef.id, ...movementData }, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement du mouvement';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const updateStock = async (productId: string, quantity: number, type: 'in' | 'out', reason?: string) => {
    if (!user) {
        const err = 'User not authenticated';
        setError(err);
        return { data: null, error: err };
    }
    try {
        const productRef = doc(firestore, "products", productId);
        const batch = writeBatch(firestore);

        // TODO: Get current stock first with a transaction for safety
        
        batch.update(productRef, { stock: quantity });

        const movementData: Omit<StockMovement, 'id' | 'createdAt' | 'business_id'> = {
            product_id: productId,
            quantity: type === 'in' ? quantity : -quantity,
            type: type,
            reason: reason || (type === 'in' ? 'Réapprovisionnement' : 'Vente'),
            user_id: user.uid
        };
        
        const movementRef = doc(collection(firestore, "stock_movements"));
        batch.set(movementRef, {
            ...movementData,
            business_id: user.uid,
            createdAt: serverTimestamp()
        });

        await batch.commit();

        await fetchMovements();

        return { data: { id: movementRef.id, ...movementData }, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du stock';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const getMovementsByProduct = async (productId: string) => {
    if(!user) return { data: [], error: 'User not authenticated' };

    try {
      const q = query(collection(firestore, 'stock_movements'), where('product_id', '==', productId), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const movementsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockMovement));
      return { data: movementsData, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des mouvements';
      return { data: [], error: errorMessage };
    }
  };

  const getRecentMovements = (limit = 10) => {
    return movements.slice(0, limit);
  };

  return {
    movements,
    loading,
    error,
    fetchMovements,
    addMovement,
    updateStock,
    getMovementsByProduct,
    getRecentMovements
  };
};
