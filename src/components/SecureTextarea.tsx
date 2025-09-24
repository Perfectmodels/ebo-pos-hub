import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureTextareaProps {
  value: string;
  onChange: (value: string) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
}

export const SecureTextarea: React.FC<SecureTextareaProps> = ({
  value,
  onChange,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  placeholder,
  rows = 3
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveTextarea = () => {
    if (sensitive) return true;
    
    // Vérifier si le textarea contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${value}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSensitiveTextarea() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    onChange(e.target.value);
  };

  const getDisplayValue = () => {
    if (isSensitiveTextarea() && !isVisible) {
      return '***MASKED***';
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
          {isSensitiveTextarea() && (
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
      
      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={getDisplayValue()}
          onChange={handleChange}
          disabled={disabled || (isSensitiveTextarea() && !isVisible)}
          placeholder={isSensitiveTextarea() && !isVisible ? '***' : placeholder}
          rows={rows}
          className={isSensitiveTextarea() && !isVisible ? 'blur-sm' : ''}
        />
        
        {isSensitiveTextarea() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-2 right-2" />
        )}
      </div>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveTextarea() && !isVisible ? 'blur-sm' : ''}`}>
          {isSensitiveTextarea() && !isVisible ? '***' : `${value.length} caractères`}
        </span>
        {isSensitiveTextarea() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureTextarea;
