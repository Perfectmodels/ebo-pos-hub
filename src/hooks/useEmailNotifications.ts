// @ts-nocheck - Temporarily disabled until Supabase tables are created
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailNotificationData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const useEmailNotifications = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Configuration des templates d'email
  const emailTemplates = {
    newUserRegistration: {
      subject: "Nouvelle inscription utilisateur - Ebo'o Gest",
      template: "new_user_registration",
      getContent: (userData: any) => ({
        userName: userData.name || userData.email,
        userEmail: userData.email,
        registrationDate: new Date().toLocaleDateString('fr-FR'),
        companyName: userData.companyName || 'N/A',
        activityType: userData.activityType || 'N/A',
        userRole: userData.role || 'Utilisateur'
      })
    },
    newPMERegistration: {
      subject: "Nouvelle inscription PME - Ebo'o Gest",
      template: "new_pme_registration", 
      getContent: (pmeData: any) => ({
        companyName: pmeData.nomEntreprise,
        contactName: pmeData.nomPrenomContact,
        contactEmail: pmeData.emailPro,
        activityType: pmeData.categorieActivite,
        city: pmeData.ville,
        phone: pmeData.telephone,
        registrationDate: new Date().toLocaleDateString('fr-FR'),
        employeeCount: pmeData.nombreEmployes,
        businessHours: pmeData.horairesOuverture
      })
    },
    lowStockAlert: {
      subject: "Alerte Stock Faible - Ebo'o Gest",
      template: "low_stock_alert",
      getContent: (stockData: any) => ({
        productName: stockData.name,
        currentStock: stockData.current_stock,
        minStock: stockData.min_stock,
        category: stockData.category,
        alertDate: new Date().toLocaleDateString('fr-FR')
      })
    },
    dailySalesReport: {
      subject: "Rapport de Ventes Quotidien - Ebo'o Gest",
      template: "daily_sales_report",
      getContent: (salesData: any) => ({
        totalSales: salesData.totalSales,
        totalOrders: salesData.totalOrders,
        topProducts: salesData.topProducts,
        reportDate: new Date().toLocaleDateString('fr-FR'),
        salesGrowth: salesData.growth || 0
      })
    }
  };

  // Fonction pour envoyer un email de notification
  const sendEmailNotification = async (notificationData: EmailNotificationData) => {
    setLoading(true);
    
    try {
      // En production, utiliser un service d'email comme Resend, SendGrid, ou Supabase Edge Functions
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      toast({
        title: "Email envoyé !",
        description: "La notification a été envoyée avec succès",
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email de notification",
        variant: "destructive"
      });
      return { error: error instanceof Error ? error.message : 'Erreur inconnue' };
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour notifier une nouvelle inscription utilisateur
  const notifyNewUserRegistration = async (userData: any, adminEmails: string[] = []) => {
    const template = emailTemplates.newUserRegistration;
    const content = template.getContent(userData);

    // Envoyer à tous les administrateurs
    for (const adminEmail of adminEmails) {
      await sendEmailNotification({
        to: adminEmail,
        subject: template.subject,
        template: template.template,
        data: content
      });
    }
  };

  // Fonction pour notifier une nouvelle inscription PME
  const notifyNewPMERegistration = async (pmeData: any, adminEmails: string[] = []) => {
    const template = emailTemplates.newPMERegistration;
    const content = template.getContent(pmeData);

    // Envoyer à tous les administrateurs
    for (const adminEmail of adminEmails) {
      await sendEmailNotification({
        to: adminEmail,
        subject: template.subject,
        template: template.template,
        data: content
      });
    }
  };

  // Fonction pour notifier les alertes de stock
  const notifyLowStockAlert = async (stockData: any, adminEmails: string[] = []) => {
    const template = emailTemplates.lowStockAlert;
    const content = template.getContent(stockData);

    for (const adminEmail of adminEmails) {
      await sendEmailNotification({
        to: adminEmail,
        subject: template.subject,
        template: template.template,
        data: content
      });
    }
  };

  // Fonction pour envoyer le rapport quotidien
  const sendDailySalesReport = async (salesData: any, adminEmails: string[] = []) => {
    const template = emailTemplates.dailySalesReport;
    const content = template.getContent(salesData);

    for (const adminEmail of adminEmails) {
      await sendEmailNotification({
        to: adminEmail,
        subject: template.subject,
        template: template.template,
        data: content
      });
    }
  };

  // Fonction pour obtenir les emails des administrateurs
  const getAdminEmails = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('role', 'admin');

      if (error) throw error;
      
      return data.map(user => user.email).filter(Boolean);
    } catch (error) {
      console.error('Erreur récupération emails admin:', error);
      return [];
    }
  };

  return {
    loading,
    sendEmailNotification,
    notifyNewUserRegistration,
    notifyNewPMERegistration,
    notifyLowStockAlert,
    sendDailySalesReport,
    getAdminEmails
  };
};
