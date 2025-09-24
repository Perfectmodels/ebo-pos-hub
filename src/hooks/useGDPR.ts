import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GDPRConsent {
  id: string;
  user_id: string;
  consent_type: 'analytics' | 'marketing' | 'functional' | 'necessary';
  granted: boolean;
  timestamp: string;
  ip_address: string;
  user_agent: string;
}

export interface DataRequest {
  id: string;
  user_id: string;
  request_type: 'access' | 'portability' | 'deletion' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requested_at: string;
  completed_at?: string;
  data?: any;
}

export const useGDPR = () => {
  const [consents, setConsents] = useState<GDPRConsent[]>([]);
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Enregistrer le consentement
  const recordConsent = async (
    consentType: GDPRConsent['consent_type'],
    granted: boolean
  ) => {
    if (!user) return;

    try {
      const consent: Omit<GDPRConsent, 'id' | 'timestamp'> = {
        user_id: user.id,
        consent_type: consentType,
        granted,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('gdpr_consents')
        .insert(consent);

      if (error) throw error;

      // Mettre à jour l'état local
      setConsents(prev => [...prev, { ...consent, id: '', timestamp: new Date().toISOString() }]);
    } catch (error) {
      console.error('Error recording consent:', error);
    }
  };

  // Demander l'accès aux données
  const requestDataAccess = async () => {
    if (!user) return;

    try {
      const request: Omit<DataRequest, 'id' | 'requested_at' | 'status'> = {
        user_id: user.id,
        request_type: 'access'
      };

      const { error } = await supabase
        .from('data_requests')
        .insert(request);

      if (error) throw error;
    } catch (error) {
      console.error('Error requesting data access:', error);
    }
  };

  // Demander la portabilité des données
  const requestDataPortability = async () => {
    if (!user) return;

    try {
      const request: Omit<DataRequest, 'id' | 'requested_at' | 'status'> = {
        user_id: user.id,
        request_type: 'portability'
      };

      const { error } = await supabase
        .from('data_requests')
        .insert(request);

      if (error) throw error;
    } catch (error) {
      console.error('Error requesting data portability:', error);
    }
  };

  // Demander la suppression des données
  const requestDataDeletion = async () => {
    if (!user) return;

    try {
      const request: Omit<DataRequest, 'id' | 'requested_at' | 'status'> = {
        user_id: user.id,
        request_type: 'deletion'
      };

      const { error } = await supabase
        .from('data_requests')
        .insert(request);

      if (error) throw error;
    } catch (error) {
      console.error('Error requesting data deletion:', error);
    }
  };

  // Obtenir les données utilisateur
  const getUserData = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Exporter les données utilisateur
  const exportUserData = async () => {
    if (!user) return null;

    try {
      const userData = await getUserData();
      const salesData = await getUserSales();
      const productsData = await getUserProducts();

      const exportData = {
        user: userData,
        sales: salesData,
        products: productsData,
        exported_at: new Date().toISOString(),
        format: 'JSON'
      };

      // Télécharger le fichier
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ebo-gest-data-${user.id}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  };

  const getUserSales = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sales:', error);
      return [];
    }
  };

  const getUserProducts = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user products:', error);
      return [];
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Vérifier les consentements
  const hasConsent = (consentType: GDPRConsent['consent_type']): boolean => {
    const consent = consents.find(c => c.consent_type === consentType);
    return consent?.granted || false;
  };

  // Obtenir tous les consentements
  const fetchConsents = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('gdpr_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setConsents(data || []);
    } catch (error) {
      console.error('Error fetching consents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les demandes de données
  const fetchDataRequests = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setDataRequests(data || []);
    } catch (error) {
      console.error('Error fetching data requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConsents();
      fetchDataRequests();
    }
  }, [user]);

  return {
    consents,
    dataRequests,
    loading,
    recordConsent,
    requestDataAccess,
    requestDataPortability,
    requestDataDeletion,
    getUserData,
    exportUserData,
    hasConsent,
    fetchConsents,
    fetchDataRequests
  };
};
