
import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface Employee {
  id: string;
  full_name: string;
  role: string;
  email: string;
  phone?: string;
  pin_code?: string; 
  business_id: string;
  created_at?: string;
}

export const useEmployees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    if (!user) {
        setEmployees([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const q = query(collection(firestore, 'employees'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(employeesData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
        await addDoc(collection(firestore, 'employees'), employeeData);
        fetchEmployees();
        return { data: employeeData, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
        const employeeRef = doc(firestore, 'employees', id);
        await updateDoc(employeeRef, updates);
        fetchEmployees();
        return { data: {id, ...updates}, error: null };
    } catch (error: any) {
        return { data: null, error };
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
        const employeeRef = doc(firestore, 'employees', id);
        await deleteDoc(employeeRef);
        fetchEmployees();
        return { error: null };
    } catch (error: any) {
        return { error };
    }
  };

  return { employees, loading, error, fetchEmployees, addEmployee, updateEmployee, deleteEmployee };
};
