import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WebhookEvent {
  id: string;
  type: 'user_registration' | 'pme_registration' | 'sale_completed' | 'stock_alert' | 'system_alert';
  data: any;
  timestamp: string;
  processed: boolean;
}

export const useWebhooks = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Écouter les changements en temps réel
  useEffect(() => {
    const subscription = supabase
      .channel('webhook_events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'webhook_events' },
        (payload) => {
          console.log('Webhook event received:', payload);
          handleWebhookEvent(payload.new as WebhookEvent);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleWebhookEvent = useCallback((event: WebhookEvent) => {
    setEvents(prev => [event, ...prev]);
    
    // Notifications toast selon le type d'événement
    switch (event.type) {
      case 'user_registration':
        toast({
          title: "Nouvel utilisateur",
          description: "Un nouvel utilisateur s'est inscrit",
        });
        break;
      case 'pme_registration':
        toast({
          title: "Nouvelle PME",
          description: "Une nouvelle PME s'est inscrite",
        });
        break;
      case 'sale_completed':
        toast({
          title: "Vente enregistrée",
          description: `Vente de ${event.data.amount} FCFA`,
        });
        break;
      case 'stock_alert':
        toast({
          title: "Alerte Stock",
          description: `${event.data.product_name} en rupture`,
          variant: "destructive"
        });
        break;
    }
  }, [toast]);

  const sendWebhook = async (type: WebhookEvent['type'], data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('webhook_events')
        .insert({
          type,
          data,
          timestamp: new Date().toISOString(),
          processed: false
        });

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Webhook error:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const markAsProcessed = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('webhook_events')
        .update({ processed: true })
        .eq('id', eventId);

      if (error) throw error;
      
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, processed: true } : event
        )
      );
    } catch (error) {
      console.error('Error marking webhook as processed:', error);
    }
  };

  return {
    events,
    loading,
    sendWebhook,
    markAsProcessed
  };
};
