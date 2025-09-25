import React from 'react';
import { sanitizeData, secureLog, secureError } from '@/config/security';

// Composant de protection des données sensibles (version simplifiée)
export const DataProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Version simplifiée qui ne casse pas l'application
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
