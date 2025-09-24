// Configuration de sécurité pour empêcher l'affichage des données sensibles dans la console
export const securityConfig = {
  // Désactiver les logs en production
  disableConsoleInProduction: process.env.NODE_ENV === 'production',
  
  // Masquer les données sensibles
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'key',
    'auth',
    'credential',
    'session',
    'cookie',
    'private',
    'confidential',
    'sensitive',
    'personal',
    'email',
    'phone',
    'address',
    'rccm',
    'nif',
    'bank',
    'account',
    'card',
    'pin',
    'ssn',
    'id_number'
  ],
  
  // Messages d'avertissement de sécurité
  securityWarnings: {
    consoleAccess: '⚠️ Accès à la console détecté - Données sensibles protégées',
    dataAccess: '🔒 Accès aux données utilisateur restreint',
    debugMode: '🚫 Mode debug désactivé pour la sécurité'
  }
};

// Fonction pour masquer les données sensibles
export const sanitizeData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = Array.isArray(data) ? [] : {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = securityConfig.sensitiveFields.some(field => 
      lowerKey.includes(field)
    );
    
    if (isSensitive) {
      (sanitized as any)[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = sanitizeData(value);
    } else {
      (sanitized as any)[key] = value;
    }
  }
  
  return sanitized;
};

// Fonction pour sécuriser les logs
export const secureLog = (message: string, data?: any) => {
  if (securityConfig.disableConsoleInProduction) {
    return;
  }
  
  const sanitizedData = data ? sanitizeData(data) : undefined;
  console.log(`[SECURE] ${message}`, sanitizedData);
};

// Fonction pour masquer les erreurs sensibles
export const secureError = (message: string, error?: any) => {
  if (securityConfig.disableConsoleInProduction) {
    return;
  }
  
  const sanitizedError = error ? sanitizeData(error) : undefined;
  console.error(`[SECURE ERROR] ${message}`, sanitizedError);
};

// Désactiver les méthodes de console dangereuses
export const disableDangerousConsoleMethods = () => {
  if (typeof window !== 'undefined') {
    // Désactiver eval
    if (window.eval) {
      window.eval = () => {
        throw new Error('eval() est désactivé pour la sécurité');
      };
    }
    
    // Désactiver Function constructor
    if (window.Function) {
      window.Function = () => {
        throw new Error('Function() est désactivé pour la sécurité');
      };
    }
    
    // Masquer les données sensibles dans la console
    const originalConsole = { ...console };
    
    // Override console.log
    console.log = (...args: any[]) => {
      if (securityConfig.disableConsoleInProduction) return;
      
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.log(...sanitizedArgs);
    };
    
    // Override console.error
    console.error = (...args: any[]) => {
      if (securityConfig.disableConsoleInProduction) return;
      
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.error(...sanitizedArgs);
    };
    
    // Override console.warn
    console.warn = (...args: any[]) => {
      if (securityConfig.disableConsoleInProduction) return;
      
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.warn(...sanitizedArgs);
    };
    
    // Override console.info
    console.info = (...args: any[]) => {
      if (securityConfig.disableConsoleInProduction) return;
      
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.info(...sanitizedArgs);
    };
    
    // Override console.debug
    console.debug = (...args: any[]) => {
      if (securityConfig.disableConsoleInProduction) return;
      
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.debug(...sanitizedArgs);
    };
  }
};

// Détecter l'accès à la console
export const detectConsoleAccess = () => {
  if (typeof window !== 'undefined') {
    let devtools = false;
    
    const checkDevtools = () => {
      if (window.outerHeight - window.innerHeight > 160 || 
          window.outerWidth - window.innerWidth > 160) {
        if (!devtools) {
          devtools = true;
          console.warn(securityConfig.securityWarnings.consoleAccess);
        }
      } else {
        devtools = false;
      }
    };
    
    setInterval(checkDevtools, 500);
    
    // Détecter l'ouverture de la console
    let consoleOpened = false;
    const detectConsole = () => {
      if (!consoleOpened) {
        consoleOpened = true;
        console.warn(securityConfig.securityWarnings.dataAccess);
      }
    };
    
    // Détecter F12, Ctrl+Shift+I, etc.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J')) {
        detectConsole();
      }
    });
    
    // Détecter le clic droit
    document.addEventListener('contextmenu', detectConsole);
  }
};

// Initialiser la sécurité
export const initSecurity = () => {
  disableDangerousConsoleMethods();
  detectConsoleAccess();
  
  // Masquer les données sensibles dans le localStorage
  if (typeof window !== 'undefined') {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = (key: string, value: string) => {
      const isSensitive = securityConfig.sensitiveFields.some(field => 
        key.toLowerCase().includes(field)
      );
      
      if (isSensitive) {
        console.warn(`[SECURITY] Tentative d'accès à un champ sensible: ${key}`);
        return;
      }
      
      originalSetItem.call(localStorage, key, value);
    };
  }
};
