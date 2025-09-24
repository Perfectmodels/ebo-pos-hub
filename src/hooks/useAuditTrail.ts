import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'data' | 'system' | 'security' | 'business';
}

export const useAuditTrail = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const logAction = async (
    action: string,
    resource: string,
    resourceId: string,
    oldValues?: any,
    newValues?: any,
    severity: AuditLog['severity'] = 'medium',
    category: AuditLog['category'] = 'data'
  ) => {
    if (!user) return;

    try {
      const auditLog: Omit<AuditLog, 'id' | 'timestamp'> = {
        user_id: user.id,
        action,
        resource,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        severity,
        category
      };

      const { error } = await supabase
        .from('audit_logs')
        .insert(auditLog);

      if (error) {
        console.error('Audit log error:', error);
      }
    } catch (error) {
      console.error('Failed to log action:', error);
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

  const fetchLogs = async (filters?: {
    userId?: string;
    action?: string;
    resource?: string;
    severity?: AuditLog['severity'];
    category?: AuditLog['category'];
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.action) {
        query = query.eq('action', filters.action);
      }
      if (filters?.resource) {
        query = query.eq('resource', filters.resource);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLogsByUser = async (userId: string) => {
    return fetchLogs({ userId });
  };

  const getLogsByResource = async (resource: string, resourceId: string) => {
    return fetchLogs({ resource });
  };

  const getSecurityLogs = async () => {
    return fetchLogs({ category: 'security' });
  };

  const getBusinessLogs = async () => {
    return fetchLogs({ category: 'business' });
  };

  // Actions prédéfinies pour les logs
  const logUserAction = (action: string, resourceId: string, oldValues?: any, newValues?: any) => {
    logAction(action, 'user', resourceId, oldValues, newValues, 'medium', 'auth');
  };

  const logProductAction = (action: string, productId: string, oldValues?: any, newValues?: any) => {
    logAction(action, 'product', productId, oldValues, newValues, 'medium', 'business');
  };

  const logSaleAction = (action: string, saleId: string, oldValues?: any, newValues?: any) => {
    logAction(action, 'sale', saleId, oldValues, newValues, 'high', 'business');
  };

  const logSecurityAction = (action: string, resourceId: string, severity: AuditLog['severity'] = 'high') => {
    logAction(action, 'security', resourceId, undefined, undefined, severity, 'security');
  };

  return {
    logs,
    loading,
    logAction,
    logUserAction,
    logProductAction,
    logSaleAction,
    logSecurityAction,
    fetchLogs,
    getLogsByUser,
    getLogsByResource,
    getSecurityLogs,
    getBusinessLogs
  };
};
