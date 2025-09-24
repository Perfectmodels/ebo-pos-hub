import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export const SecureSlider: React.FC<SecureSliderProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  sensitive = false,
  className = '',
  label,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveSlider = () => {
    if (sensitive) return true;
    
    // Vérifier si le slider contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: number[]) => {
    if (isSensitiveSlider() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveSlider() && !isVisible) {
      return ['***'];
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
          {isSensitiveSlider() && (
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
      
      {/* Slider */}
      <div className="relative">
        <Slider
          value={getDisplayValue()}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled || (isSensitiveSlider() && !isVisible)}
          className={isSensitiveSlider() && !isVisible ? 'blur-sm' : ''}
        />
        
        {isSensitiveSlider() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Value Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveSlider() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveSlider() && !isVisible ? '***' : value.join(' - ')}
        </span>
        {isSensitiveSlider() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureSlider;
