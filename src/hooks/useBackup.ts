import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Backup {
  id: string;
  user_id: string;
  backup_type: 'automatic' | 'manual' | 'scheduled';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  file_size?: number;
  file_url?: string;
  data_snapshot?: any;
}

export const useBackup = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Configuration du backup automatique
  useEffect(() => {
    if (!user) return;

    // Vérifier les préférences de backup
    const backupPrefs = localStorage.getItem('backup_preferences');
    if (backupPrefs) {
      const prefs = JSON.parse(backupPrefs);
      setAutoBackupEnabled(prefs.autoBackup);
    }

    // Programmer le backup automatique quotidien
    if (autoBackupEnabled) {
      scheduleDailyBackup();
    }
  }, [user, autoBackupEnabled]);

  const scheduleDailyBackup = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(2, 0, 0, 0); // 2h00 du matin

    const timeUntilBackup = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      createBackup('automatic');
      // Programmer le prochain backup
      scheduleDailyBackup();
    }, timeUntilBackup);
  };

  // Créer un backup
  const createBackup = async (type: Backup['backup_type'] = 'manual') => {
    if (!user) return;

    setLoading(true);
    try {
      // Créer l'enregistrement de backup
      const { data: backupData, error: backupError } = await supabase
        .from('backups')
        .insert({
          user_id: user.id,
          backup_type: type,
          status: 'processing',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (backupError) throw backupError;

      // Collecter toutes les données utilisateur
      const userData = await collectUserData();

      // Créer le snapshot
      const snapshot = {
        user: userData.user,
        products: userData.products,
        sales: userData.sales,
        employees: userData.employees,
        stock_movements: userData.stockMovements,
        settings: userData.settings,
        backup_metadata: {
          created_at: new Date().toISOString(),
          version: '1.0',
          user_id: user.id,
          data_count: {
            products: userData.products.length,
            sales: userData.sales.length,
            employees: userData.employees.length,
            stock_movements: userData.stockMovements.length
          }
        }
      };

      // Calculer la taille du fichier
      const fileSize = new Blob([JSON.stringify(snapshot)]).size;

      // Mettre à jour le backup avec les données
      const { error: updateError } = await supabase
        .from('backups')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          file_size: fileSize,
          data_snapshot: snapshot
        })
        .eq('id', backupData.id);

      if (updateError) throw updateError;

      // Mettre à jour l'état local
      setBackups(prev => [backupData, ...prev]);

      toast({
        title: "Backup créé",
        description: `Backup ${type} créé avec succès (${formatFileSize(fileSize)})`,
      });

      return backupData;
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Erreur de backup",
        description: "Impossible de créer le backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Collecter toutes les données utilisateur
  const collectUserData = async () => {
    if (!user) return null;

    try {
      const [userResult, productsResult, salesResult, employeesResult, stockResult, settingsResult] = await Promise.all([
        supabase.from('users').select('*').eq('id', user.id).single(),
        supabase.from('products').select('*').eq('user_id', user.id),
        supabase.from('sales').select('*').eq('user_id', user.id),
        supabase.from('employees').select('*').eq('user_id', user.id),
        supabase.from('stock_movements').select('*').eq('user_id', user.id),
        supabase.from('user_settings').select('*').eq('user_id', user.id)
      ]);

      return {
        user: userResult.data,
        products: productsResult.data || [],
        sales: salesResult.data || [],
        employees: employeesResult.data || [],
        stockMovements: stockResult.data || [],
        settings: settingsResult.data || []
      };
    } catch (error) {
      console.error('Error collecting user data:', error);
      return null;
    }
  };

  // Restaurer un backup
  const restoreBackup = async (backupId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Récupérer le backup
      const { data: backup, error: backupError } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .eq('user_id', user.id)
        .single();

      if (backupError) throw backupError;

      if (!backup.data_snapshot) {
        throw new Error('Aucune donnée de backup trouvée');
      }

      const snapshot = backup.data_snapshot;

      // Restaurer les données
      await Promise.all([
        // Restaurer les produits
        supabase.from('products').upsert(snapshot.products),
        // Restaurer les ventes
        supabase.from('sales').upsert(snapshot.sales),
        // Restaurer les employés
        supabase.from('employees').upsert(snapshot.employees),
        // Restaurer les mouvements de stock
        supabase.from('stock_movements').upsert(snapshot.stock_movements),
        // Restaurer les paramètres
        supabase.from('user_settings').upsert(snapshot.settings)
      ]);

      toast({
        title: "Backup restauré",
        description: "Vos données ont été restaurées avec succès",
      });

      return true;
    } catch (error) {
      console.error('Restore error:', error);
      toast({
        title: "Erreur de restauration",
        description: "Impossible de restaurer le backup",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Télécharger un backup
  const downloadBackup = async (backupId: string) => {
    if (!user) return;

    try {
      const { data: backup, error } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (!backup.data_snapshot) {
        throw new Error('Aucune donnée de backup trouvée');
      }

      // Créer et télécharger le fichier
      const blob = new Blob([JSON.stringify(backup.data_snapshot, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ebo-gest-backup-${backupId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup téléchargé",
        description: "Le fichier de backup a été téléchargé",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le backup",
        variant: "destructive"
      });
    }
  };

  // Supprimer un backup
  const deleteBackup = async (backupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('backups')
        .delete()
        .eq('id', backupId)
        .eq('user_id', user.id);

      if (error) throw error;

      setBackups(prev => prev.filter(backup => backup.id !== backupId));

      toast({
        title: "Backup supprimé",
        description: "Le backup a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Erreur de suppression",
        description: "Impossible de supprimer le backup",
        variant: "destructive"
      });
    }
  };

  // Obtenir tous les backups
  const fetchBackups = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  // Configurer le backup automatique
  const configureAutoBackup = (enabled: boolean) => {
    setAutoBackupEnabled(enabled);
    localStorage.setItem('backup_preferences', JSON.stringify({ autoBackup: enabled }));
    
    if (enabled) {
      scheduleDailyBackup();
    }
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (user) {
      fetchBackups();
    }
  }, [user]);

  return {
    backups,
    loading,
    autoBackupEnabled,
    createBackup,
    restoreBackup,
    downloadBackup,
    deleteBackup,
    fetchBackups,
    configureAutoBackup,
    formatFileSize
  };
};
