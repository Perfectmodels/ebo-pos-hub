import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  total_purchases: number;
  last_purchase?: string;
  status: 'active' | 'inactive';
  business_id: string;
  created_at: string;
  updated_at?: string;
}

export const useClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const clientsQuery = query(
        collection(firestore, 'clients'),
        where('business_id', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(clientsQuery);
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];

      setClients(clientsData);
    } catch (err) {
      console.error('Erreur lors de la récupération des clients:', err);
      setError('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addClient = useCallback(async (clientData: Omit<Client, 'id' | 'business_id' | 'created_at'>) => {
    if (!user) return { success: false, error: 'Utilisateur non authentifié' };

    try {
      const newClient = {
        ...clientData,
        business_id: user.uid,
        created_at: new Date().toISOString(),
        total_purchases: 0,
        status: 'active' as const
      };

      await addDoc(collection(firestore, 'clients'), newClient);
      await fetchClients(); // Recharger la liste
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      return { success: false, error: 'Erreur lors de l\'ajout du client' };
    }
  }, [user, fetchClients]);

  const updateClient = useCallback(async (clientId: string, updates: Partial<Client>) => {
    try {
      await updateDoc(doc(firestore, 'clients', clientId), {
        ...updates,
        updated_at: new Date().toISOString()
      });
      await fetchClients(); // Recharger la liste
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Erreur lors de la mise à jour du client:', err);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }, [fetchClients]);

  const deleteClient = useCallback(async (clientId: string) => {
    try {
      await deleteDoc(doc(firestore, 'clients', clientId));
      await fetchClients(); // Recharger la liste
      
      return { success: true, error: null };
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  }, [fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
