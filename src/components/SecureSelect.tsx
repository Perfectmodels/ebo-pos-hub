import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; sensitive?: boolean }[];
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SecureSelect: React.FC<SecureSelectProps> = ({
  value,
  onValueChange,
  options,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  placeholder = 'Sélectionner...'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveSelect = () => {
    if (sensitive) return true;
    
    // Vérifier si le select contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: string) => {
    if (isSensitiveSelect() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveSelect() && !isVisible) {
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
          {isSensitiveSelect() && (
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
      
      {/* Select */}
      <div className="relative">
        <Select
          value={getDisplayValue()}
          onValueChange={handleValueChange}
          disabled={disabled || (isSensitiveSelect() && !isVisible)}
        >
          <SelectTrigger className={isSensitiveSelect() && !isVisible ? 'blur-sm' : ''}>
            <SelectValue placeholder={isSensitiveSelect() && !isVisible ? '***' : placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={disabled || (isSensitiveSelect() && !isVisible)}
              >
                {isSensitiveSelect() && !isVisible ? '***' : option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isSensitiveSelect() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveSelect() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveSelect() && !isVisible ? '***' : value}
        </span>
        {isSensitiveSelect() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureSelect;
