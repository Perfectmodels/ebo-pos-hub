import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type StockMovement = Tables<'stock_movements'>;

export const useStockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products:product_id (
            name,
            current_stock
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des mouvements');
    } finally {
      setLoading(false);
    }
  };

  const addMovement = async (movement: Omit<StockMovement, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([movement])
        .select()
        .single();

      if (error) throw error;
      setMovements(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement du mouvement';
      return { data: null, error: errorMessage };
    }
  };

  const updateStock = async (productId: string, quantity: number, type: 'in' | 'out', reason?: string) => {
    try {
      // Récupérer le stock actuel
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('current_stock')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      const currentStock = product.current_stock;
      const newStock = type === 'in' ? currentStock + quantity : currentStock - quantity;

      if (newStock < 0) {
        throw new Error('Stock insuffisant');
      }

      // Mettre à jour le stock du produit
      const { error: updateError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Enregistrer le mouvement
      const { data, error } = await addMovement({
        product_id: productId,
        quantity: type === 'in' ? quantity : -quantity,
        type: type === 'in' ? 'entree' : 'sortie',
        reason: reason || (type === 'in' ? 'Réapprovisionnement' : 'Vente'),
        user_id: (await supabase.auth.getUser()).data.user?.id || ''
      });

      return { data, error };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du stock';
      return { data: null, error: errorMessage };
    }
  };

  const getMovementsByProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
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
