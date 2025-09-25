import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  business_id: string;
  employee_id: string;
  items: SaleItem[];
  total: number;
  createdAt: Timestamp; // Firestore timestamp
}

export interface SalesSession {
  id:string;
  business_id: string;
  employee_id: string;
  start_time: Timestamp;
  end_time?: Timestamp;
  is_active: boolean;
}

export const useSales = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [sessions, setSessions] = useState<SalesSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    if (!user) {
      setSales([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(collection(firestore, 'sales'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale));
      setSales(salesData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch sales:", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = useCallback(async () => {
    if (!user) {
        setSessions([]);
        return;
    }
    try {
      const q = query(collection(firestore, 'sales_sessions'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const sessionsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SalesSession));
      setSessions(sessionsData);
    } catch (e: any) {
      console.error('Failed to fetch sessions:', e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchSales();
        fetchSessions();
    }
  }, [user, fetchSales, fetchSessions]);

  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'business_id'>) => {
    if (!user) {
        const err = 'User not authenticated';
        setError(err);
        return { data: null, error: err };
    }
    try {
      const docRef = await addDoc(collection(firestore, 'sales'), {
        ...saleData,
        business_id: user.uid,
        createdAt: serverTimestamp(),
      });
      await fetchSales(); // Refresh sales list
      return { data: { id: docRef.id, ...saleData }, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement de la vente';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const startSession = async (employeeId: string) => {
    if (!user) {
        const err = 'User not authenticated';
        setError(err);
        return { data: null, error: err };
    }
    try {
      const docRef = await addDoc(collection(firestore, 'sales_sessions'), {
        employee_id: employeeId,
        start_time: serverTimestamp(),
        is_active: true,
        business_id: user.uid,
      });
       await fetchSessions(); // Refresh sessions list
      return { data: { id: docRef.id }, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du démarrage de la session';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const endSession = async (sessionId: string) => {
    if(!user) {
        const err = 'User not authenticated';
        setError(err);
        return { data: null, error: err };
    }
    try {
      const sessionRef = doc(firestore, 'sales_sessions', sessionId);
      await updateDoc(sessionRef, {
        end_time: serverTimestamp(),
        is_active: false
      });
      await fetchSessions(); // Refresh sessions list
      const updatedDoc = sessions.find(s => s.id === sessionId);
      return { data: updatedDoc, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la fermeture de la session';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  const getTodayStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = sales.filter(sale => {
        if (!sale.createdAt?.toDate) return false;
        const saleDate = sale.createdAt.toDate();
        return saleDate >= today;
    });

    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = todaySales.length;
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      avgOrder,
      sales: todaySales
    };
  };

  const getWeeklyStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    
    const weekSales = sales.filter(sale => {
        if (!sale.createdAt?.toDate) return false;
        const saleDate = sale.createdAt.toDate();
        return saleDate >= weekAgo;
    });

    const totalRevenue = weekSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = weekSales.length;

    return {
      revenue: totalRevenue,
      orders: totalOrders,
      sales: weekSales
    };
  };

  return {
    sales,
    sessions,
    loading,
    error,
    fetchSales,
    addSale,
    startSession,
    endSession,
    getTodayStats,
    getWeeklyStats,
  };
};
