import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureRangeSliderProps {
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

export const SecureRangeSlider: React.FC<SecureRangeSliderProps> = ({
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

  const isSensitiveRangeSlider = () => {
    if (sensitive) return true;
    
    // Vérifier si le range slider contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: number[]) => {
    if (isSensitiveRangeSlider() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveRangeSlider() && !isVisible) {
      return [min];
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
          {isSensitiveRangeSlider() && (
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
      
      {/* Range Slider */}
      <div className="relative">
        <Slider
          value={getDisplayValue()}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled || (isSensitiveRangeSlider() && !isVisible)}
          className={isSensitiveRangeSlider() && !isVisible ? 'blur-sm' : ''}
        />
        
        {isSensitiveRangeSlider() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Value Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveRangeSlider() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveRangeSlider() && !isVisible ? '***' : `${value[0]} - ${value[1]}`}
        </span>
        {isSensitiveRangeSlider() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureRangeSlider;
