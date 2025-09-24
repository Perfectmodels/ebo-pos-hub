import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export const SecureCheckbox: React.FC<SecureCheckboxProps> = ({
  checked,
  onCheckedChange,
  sensitive = false,
  className = '',
  label,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveCheckbox = () => {
    if (sensitive) return true;
    
    // Vérifier si la checkbox contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${checked}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleCheckedChange = (newChecked: boolean) => {
    if (isSensitiveCheckbox() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onCheckedChange(newChecked);
  };

  const getDisplayChecked = () => {
    if (isSensitiveCheckbox() && !isVisible) {
      return false;
    }
    return checked;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveCheckbox() && (
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
      
      {/* Checkbox */}
      <div className="relative">
        <Checkbox
          checked={getDisplayChecked()}
          onCheckedChange={handleCheckedChange}
          disabled={disabled || (isSensitiveCheckbox() && !isVisible)}
          className={isSensitiveCheckbox() && !isVisible ? 'blur-sm' : ''}
        />
        
        {isSensitiveCheckbox() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveCheckbox() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveCheckbox() && !isVisible ? '***' : (checked ? 'Coché' : 'Décoché')}
        </span>
        {isSensitiveCheckbox() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureCheckbox;
