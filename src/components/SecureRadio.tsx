import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureRadioProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; sensitive?: boolean }[];
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export const SecureRadio: React.FC<SecureRadioProps> = ({
  value,
  onValueChange,
  options,
  sensitive = false,
  className = '',
  label,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveRadio = () => {
    if (sensitive) return true;
    
    // Vérifier si le radio contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: string) => {
    if (isSensitiveRadio() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveRadio() && !isVisible) {
      return '';
    }
    return value;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveRadio() && (
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
      
      {/* Radio Group */}
      <div className="relative">
        <RadioGroup
          value={getDisplayValue()}
          onValueChange={handleValueChange}
          disabled={disabled || (isSensitiveRadio() && !isVisible)}
          className={isSensitiveRadio() && !isVisible ? 'blur-sm' : ''}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                disabled={disabled || (isSensitiveRadio() && !isVisible)}
              />
              <label
                htmlFor={option.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {isSensitiveRadio() && !isVisible ? '***' : option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
        
        {isSensitiveRadio() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveRadio() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveRadio() && !isVisible ? '***' : value}
        </span>
        {isSensitiveRadio() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureRadio;
