import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;
type User = Tables<'users'>;

export const useEmployees = () => {
  const [employees, setEmployees] = useState<(Employee & { users: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role,
            created_at
          )
        `)
        .single();

      if (error) throw error;
      setEmployees(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'employé';
      return { data: null, error: errorMessage };
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            role,
            created_at
          )
        `)
        .single();

      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === id ? data : emp));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      return { data: null, error: errorMessage };
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      return { error: errorMessage };
    }
  };

  const getEmployeeStats = async (employeeId: string) => {
    try {
      const { data: sales, error } = await supabase
        .from('sales')
        .select('*')
        .eq('employee_id', employeeId)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const todaySales = sales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0;
      const todayOrders = sales?.length || 0;

      return {
        todaySales,
        todayOrders,
        sales: sales || []
      };
    } catch (err) {
      console.error('Erreur lors du calcul des stats employé:', err);
      return {
        todaySales: 0,
        todayOrders: 0,
        sales: []
      };
    }
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeStats
  };
};
