import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  sensitive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SecureAvatar: React.FC<SecureAvatarProps> = ({
  src,
  alt,
  fallback,
  sensitive = false,
  className = '',
  size = 'md'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveAvatar = () => {
    if (sensitive) return true;
    
    // Vérifier si l'avatar contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${src} ${alt} ${fallback}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8';
      case 'md':
        return 'h-10 w-10';
      case 'lg':
        return 'h-12 w-12';
      case 'xl':
        return 'h-16 w-16';
      default:
        return 'h-10 w-10';
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <Avatar className={`${getSizeClasses()} ${className}`}>
        <AvatarImage 
          src={isSensitiveAvatar() && !isVisible ? undefined : src} 
          alt={alt}
          className={isSensitiveAvatar() && !isVisible ? 'blur-sm' : ''}
        />
        <AvatarFallback className={isSensitiveAvatar() && !isVisible ? 'blur-sm' : ''}>
          {isSensitiveAvatar() && !isVisible ? '***' : fallback}
        </AvatarFallback>
      </Avatar>
      
      {isSensitiveAvatar() && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
          className="h-6 w-6 p-0 absolute -top-1 -right-1"
        >
          {isVisible ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      )}
      
      {isSensitiveAvatar() && (
        <Lock className="w-3 h-3 text-muted-foreground absolute -bottom-1 -left-1" />
      )}
    </div>
  );
};

export default SecureAvatar;
