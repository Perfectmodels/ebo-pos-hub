import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Clock } from 'lucide-react';

interface SecureTimePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SecureTimePicker: React.FC<SecureTimePickerProps> = ({
  value,
  onValueChange,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  placeholder = 'Sélectionner une heure...'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveTimePicker = () => {
    if (sensitive) return true;
    
    // Vérifier si le time picker contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: string) => {
    if (isSensitiveTimePicker() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveTimePicker() && !isVisible) {
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
          {isSensitiveTimePicker() && (
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
      
      {/* Time Picker */}
      <div className="relative">
        <input
          type="time"
          value={getDisplayValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={disabled || (isSensitiveTimePicker() && !isVisible)}
          placeholder={isSensitiveTimePicker() && !isVisible ? '***' : placeholder}
          className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveTimePicker() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveTimePicker() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveTimePicker() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveTimePicker() && !isVisible ? '***' : (
            getDisplayValue() || 'Aucune heure sélectionnée'
          )}
        </span>
        {isSensitiveTimePicker() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureTimePicker;
