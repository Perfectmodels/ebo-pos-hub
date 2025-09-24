import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SecureDatePickerProps {
  value: Date | undefined;
  onValueChange: (value: Date | undefined) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const SecureDatePicker: React.FC<SecureDatePickerProps> = ({
  value,
  onValueChange,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  placeholder = 'Sélectionner une date...'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveDatePicker = () => {
    if (sensitive) return true;
    
    // Vérifier si le date picker contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleValueChange = (newValue: Date | undefined) => {
    if (isSensitiveDatePicker() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onValueChange(newValue);
  };

  const getDisplayValue = () => {
    if (isSensitiveDatePicker() && !isVisible) {
      return undefined;
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
          {isSensitiveDatePicker() && (
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
      
      {/* Date Picker */}
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                isSensitiveDatePicker() && !isVisible ? 'blur-sm' : ''
              }`}
              disabled={disabled || (isSensitiveDatePicker() && !isVisible)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {isSensitiveDatePicker() && !isVisible ? (
                '***'
              ) : getDisplayValue() ? (
                format(getDisplayValue()!, 'PPP', { locale: fr })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={getDisplayValue()}
              onSelect={handleValueChange}
              disabled={disabled || (isSensitiveDatePicker() && !isVisible)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {isSensitiveDatePicker() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveDatePicker() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveDatePicker() && !isVisible ? '***' : (
            getDisplayValue() ? format(getDisplayValue()!, 'dd/MM/yyyy') : 'Aucune date sélectionnée'
          )}
        </span>
        {isSensitiveDatePicker() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureDatePicker;
