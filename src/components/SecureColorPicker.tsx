import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Palette } from 'lucide-react';

interface SecureColorPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SecureColorPicker: React.FC<SecureColorPickerProps> = ({
  value,
  onValueChange,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  placeholder = 'Sélectionner une couleur...'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveColorPicker = () => {
    if (sensitive) return true;
    
    // Vérifier si le color picker contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: string) => {
    if (isSensitiveColorPicker() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveColorPicker() && !isVisible) {
      return '#000000';
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
          {isSensitiveColorPicker() && (
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
      
      {/* Color Picker */}
      <div className="relative">
        <input
          type="color"
          value={getDisplayValue()}
          onChange={(e) => handleValueChange(e.target.value)}
          disabled={disabled || (isSensitiveColorPicker() && !isVisible)}
          className={`w-full h-10 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveColorPicker() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveColorPicker() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveColorPicker() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveColorPicker() && !isVisible ? '***' : (
            getDisplayValue() || 'Aucune couleur sélectionnée'
          )}
        </span>
        {isSensitiveColorPicker() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureColorPicker;
