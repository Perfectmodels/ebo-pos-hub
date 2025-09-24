import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellOff, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  X
} from 'lucide-react';

interface PWANotificationsProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

const PWANotifications: React.FC<PWANotificationsProps> = ({ 
  onPermissionGranted, 
  onPermissionDenied 
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Vérifier le support des notifications
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        // Afficher le prompt si les notifications ne sont pas encore demandées
        if (Notification.permission === 'default') {
          setShowPrompt(true);
        }
      }
    };

    checkSupport();
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Notifications non supportées');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        console.log('Permission de notification accordée');
        onPermissionGranted?.();
        
        // Envoyer une notification de test
        showTestNotification();
      } else {
        console.log('Permission de notification refusée');
        onPermissionDenied?.();
      }
      
      setShowPrompt(false);
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      const notification = new Notification('Ebo\'o Gest', {
        body: 'Notifications activées avec succès !',
        icon: '/logo-ebo-gest.png',
        badge: '/logo-ebo-gest.png',
        tag: 'eboo-gest-notification',
        requireInteraction: false,
        silent: false
      });

      // Fermer automatiquement après 5 secondes
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Ne pas afficher si pas supporté ou déjà configuré
  if (!isSupported || permission !== 'default' || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="card-stats shadow-lg border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Activez les notifications pour rester informé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avantages des notifications */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Alertes de stock faible</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Nouvelles ventes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Mises à jour importantes</span>
            </div>
          </div>

          {/* Statut actuel */}
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">
              {permission === 'default' && 'Non configuré'}
              {permission === 'granted' && 'Activé'}
              {permission === 'denied' && 'Désactivé'}
            </Badge>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <Button 
              onClick={requestPermission}
              className="btn-gradient flex-1"
            >
              <Bell className="w-4 h-4 mr-2" />
              Activer
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDismiss}
            >
              Plus tard
            </Button>
          </div>

          {/* Note importante */}
          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Les notifications vous aident à gérer votre entreprise efficacement
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWANotifications;
