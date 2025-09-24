import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  sensitive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SecureBadge: React.FC<SecureBadgeProps> = ({
  children,
  variant = 'default',
  sensitive = false,
  className = '',
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveBadge = () => {
    if (sensitive) return true;
    
    // Vérifier si le contenu contient des données sensibles
    const content = String(children);
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <Badge
        variant={variant}
        className={`${className} ${isSensitiveBadge() ? 'pr-8' : ''}`}
        onClick={onClick}
      >
        <span className={isSensitiveBadge() && !isVisible ? 'blur-sm' : ''}>
          {isSensitiveBadge() && !isVisible ? '***MASKED***' : children}
        </span>
      </Badge>
      
      {isSensitiveBadge() && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          className="h-6 w-6 p-0 absolute right-1"
        >
          {isVisible ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      )}
      
      {isSensitiveBadge() && (
        <Lock className="w-3 h-3 text-muted-foreground absolute left-1" />
      )}
    </div>
  );
};

export default SecureBadge;
