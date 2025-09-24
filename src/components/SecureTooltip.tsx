import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

interface SecureTooltipProps {
  children: React.ReactNode;
  content: string;
  sensitive?: boolean;
  className?: string;
  delayDuration?: number;
}

export const SecureTooltip: React.FC<SecureTooltipProps> = ({
  children,
  content,
  sensitive = false,
  className = '',
  delayDuration = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveTooltip = () => {
    if (sensitive) return true;
    
    // Vérifier si le contenu contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-flex items-center gap-1">
            {children}
            {isSensitiveTooltip() && (
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
            {isSensitiveTooltip() && (
              <Lock className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className={className}>
          <div className={isSensitiveTooltip() && !isVisible ? 'blur-sm' : ''}>
            {isSensitiveTooltip() && !isVisible ? '***MASKED***' : content}
          </div>
          {isSensitiveTooltip() && (
            <div className="mt-2 p-2 bg-muted/50 rounded border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>Données sensibles protégées</span>
              </div>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SecureTooltip;
