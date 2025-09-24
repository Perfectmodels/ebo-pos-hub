import React, { useEffect } from 'react';
import { sanitizeData, secureLog, secureError } from '@/config/security';

// Composant de protection des données sensibles
export const DataProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Masquer les données sensibles dans le DOM
    const hideSensitiveData = () => {
      // Masquer les éléments avec des classes sensibles
      const sensitiveElements = document.querySelectorAll('[data-sensitive]');
      sensitiveElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.filter = 'blur(5px)';
          element.style.userSelect = 'none';
        }
      });
    };

    // Détecter les tentatives d'accès aux données sensibles
    const detectDataAccess = () => {
      // Détecter les tentatives de copie
      document.addEventListener('copy', (e) => {
        const selection = window.getSelection();
        if (selection && selection.toString().includes('password') || 
            selection.toString().includes('token') ||
            selection.toString().includes('secret')) {
          e.preventDefault();
          console.warn('🔒 Copie de données sensibles bloquée');
        }
      });

      // Détecter les tentatives de sélection
      document.addEventListener('selectstart', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.hasAttribute('data-sensitive')) {
          e.preventDefault();
          console.warn('🔒 Sélection de données sensibles bloquée');
        }
      });
    };

    // Détecter les tentatives d'inspection du code
    const detectCodeInspection = () => {
      // Détecter les tentatives d'accès aux propriétés sensibles
      const originalGetOwnPropertyNames = Object.getOwnPropertyNames;
      Object.getOwnPropertyNames = function(obj) {
        const names = originalGetOwnPropertyNames(obj);
        return names.filter(name => !name.toLowerCase().includes('password') && 
                                   !name.toLowerCase().includes('token') &&
                                   !name.toLowerCase().includes('secret'));
      };
    };

    hideSensitiveData();
    detectDataAccess();
    detectCodeInspection();

    // Nettoyer les données sensibles du localStorage
    const cleanSensitiveData = () => {
      const sensitiveKeys = ['password', 'token', 'secret', 'auth', 'session'];
      sensitiveKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.warn(`🔒 Données sensibles supprimées: ${key}`);
        }
      });
    };

    cleanSensitiveData();

    // Détecter les tentatives d'accès aux données via la console
    const detectConsoleAccess = () => {
      const originalConsole = { ...console };
      
      // Override des méthodes de console pour masquer les données sensibles
      console.log = (...args) => {
        const sanitizedArgs = args.map(arg => 
          typeof arg === 'object' ? sanitizeData(arg) : arg
        );
        originalConsole.log(...sanitizedArgs);
      };

      console.error = (...args) => {
        const sanitizedArgs = args.map(arg => 
          typeof arg === 'object' ? sanitizeData(arg) : arg
        );
        originalConsole.error(...sanitizedArgs);
      };

      console.warn = (...args) => {
        const sanitizedArgs = args.map(arg => 
          typeof arg === 'object' ? sanitizeData(arg) : arg
        );
        originalConsole.warn(...sanitizedArgs);
      };
    };

    detectConsoleAccess();

  }, []);

  return <>{children}</>;
};

// Hook pour sécuriser les données
export const useSecureData = () => {
  const secureData = (data: any) => {
    return sanitizeData(data);
  };

  const secureLogData = (message: string, data?: any) => {
    secureLog(message, data);
  };

  const secureErrorData = (message: string, error?: any) => {
    secureError(message, error);
  };

  return {
    secureData,
    secureLogData,
    secureErrorData
  };
};

// Composant pour masquer les données sensibles dans l'UI
export const SensitiveData: React.FC<{ 
  children: React.ReactNode;
  blur?: boolean;
  mask?: string;
}> = ({ children, blur = true, mask = '***' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <span
      data-sensitive
      onClick={handleClick}
      style={{
        filter: blur && !isVisible ? 'blur(5px)' : 'none',
        userSelect: 'none',
        cursor: 'pointer'
      }}
      title="Cliquez pour révéler/masquer"
    >
      {isVisible ? children : mask}
    </span>
  );
};

export default DataProtection;
