import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Sale = Tables<'sales'>;
type SalesSession = Tables<'sales_sessions'>;

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [sessions, setSessions] = useState<SalesSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSales();
    fetchSessions();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products:product_id (
            name,
            selling_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des ventes');
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des sessions:', err);
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single();

      if (error) throw error;
      setSales(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement de la vente';
      return { data: null, error: errorMessage };
    }
  };

  const startSession = async (employeeId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales_sessions')
        .insert([{
          employee_id: employeeId,
          start_time: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du démarrage de la session';
      return { data: null, error: errorMessage };
    }
  };

  const endSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('sales_sessions')
        .update({
          end_time: new Date().toISOString(),
          is_active: false
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      setSessions(prev => prev.map(s => s.id === sessionId ? data : s));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la fermeture de la session';
      return { data: null, error: errorMessage };
    }
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(sale => 
      sale.created_at?.startsWith(today)
    );

    const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0);
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
    
    const weekSales = sales.filter(sale => 
      sale.created_at && new Date(sale.created_at) >= weekAgo
    );

    const totalRevenue = weekSales.reduce((sum, sale) => sum + sale.total_amount, 0);
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
    getWeeklyStats
  };
};
