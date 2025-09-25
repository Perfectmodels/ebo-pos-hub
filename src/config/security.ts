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

// Désactiver les méthodes de console dangereuses (version simplifiée)
export const disableDangerousConsoleMethods = () => {
  // Version simplifiée pour éviter les conflits
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Seulement en production, masquer les données sensibles
    const originalConsole = { ...console };
    
    console.log = (...args: any[]) => {
      const sanitizedArgs = args.map(arg => 
        typeof arg === 'object' ? sanitizeData(arg) : arg
      );
      originalConsole.log(...sanitizedArgs);
    };
  }
};

// Détecter l'accès à la console (version simplifiée)
export const detectConsoleAccess = () => {
  // Version simplifiée qui ne bloque pas le développement
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.warn(securityConfig.securityWarnings.consoleAccess);
  }
};

// Initialiser la sécurité (version simplifiée)
export const initSecurity = () => {
  // Version simplifiée qui ne casse pas l'application
  if (process.env.NODE_ENV === 'production') {
    disableDangerousConsoleMethods();
    detectConsoleAccess();
  }
};
