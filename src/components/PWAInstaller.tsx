import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  X, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  RefreshCw,
  Settings
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallerProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

const PWAInstaller: React.FC<PWAInstallerProps> = ({ onInstall, onDismiss }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installSupported, setInstallSupported] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
    };

    // Vérifier le support d'installation
    const checkInstallSupport = () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
      setInstallSupported(isSupported);
    };

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      onInstall?.();
    };

    // Écouter les changements de connectivité
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Initialisation
    checkIfInstalled();
    checkInstallSupport();

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onInstall]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation acceptée');
        onInstall?.();
      } else {
        console.log('PWA installation refusée');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    onDismiss?.();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Ne pas afficher si déjà installé ou pas de support
  if (isInstalled || !installSupported || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="card-stats shadow-lg border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Installer l'app</CardTitle>
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
            Installez Ebo'o Gest sur votre appareil pour une meilleure expérience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avantages de l'installation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Accès hors ligne</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Notifications push</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Performance optimisée</span>
            </div>
          </div>

          {/* Statut de connexion */}
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-600">En ligne</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-600">Hors ligne</span>
              </>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              className="btn-gradient flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Installer
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground">
            <p>• Sur mobile: Ajouter à l'écran d'accueil</p>
            <p>• Sur desktop: Installer l'application</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstaller;
