import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isInstallable: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isInstallable: false,
    isUpdateAvailable: false,
    registration: null
  });

  useEffect(() => {
    // Vérifier si l'app est installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      return isStandalone || (isIOS && isInStandaloneMode);
    };

    // Enregistrer le Service Worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          setPwaState(prev => ({ ...prev, registration }));

          // Vérifier les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
                }
              });
            }
          });

          console.log('Service Worker enregistré avec succès');
        } catch (error) {
          console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
        }
      }
    };

    // Gérer les événements d'installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({ ...prev, isInstallable: true }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false 
      }));
    };

    // Gérer la connectivité
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Initialisation
    setPwaState(prev => ({ ...prev, isInstalled: checkIfInstalled() }));
    registerServiceWorker();

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
  }, []);

  // Fonction pour mettre à jour l'app
  const updateApp = () => {
    if (pwaState.registration?.waiting) {
      pwaState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Fonction pour demander l'installation
  const requestInstall = async () => {
    if (pwaState.isInstallable) {
      // Cette fonction sera appelée par le composant PWAInstaller
      return true;
    }
    return false;
  };

  return {
    ...pwaState,
    updateApp,
    requestInstall
  };
};
