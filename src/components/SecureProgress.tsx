import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureProgressProps {
  value: number;
  max?: number;
  sensitive?: boolean;
  className?: string;
  showValue?: boolean;
  label?: string;
}

export const SecureProgress: React.FC<SecureProgressProps> = ({
  value,
  max = 100,
  sensitive = false,
  className = '',
  showValue = true,
  label
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveProgress = () => {
    if (sensitive) return true;
    
    // Vérifier si le progress contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const getDisplayValue = () => {
    if (isSensitiveProgress() && !isVisible) {
      return '***';
    }
    return value;
  };

  const getDisplayMax = () => {
    if (isSensitiveProgress() && !isVisible) {
      return '***';
    }
    return max;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveProgress() && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="h-6 w-6 p-0"
            >
              {isVisible ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={isSensitiveProgress() && !isVisible ? 0 : value} 
          max={max}
          className={isSensitiveProgress() && !isVisible ? 'blur-sm' : ''}
        />
        
        {isSensitiveProgress() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Value Display */}
      {showValue && (
        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm text-muted-foreground ${isSensitiveProgress() && !isVisible ? 'blur-sm' : ''}`}>
            {getDisplayValue()} / {getDisplayMax()}
          </span>
          {isSensitiveProgress() && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Protégé</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecureProgress;
