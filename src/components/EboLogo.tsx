import { cn } from "@/lib/utils";

interface EboLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'icon';
  showText?: boolean;
}

export default function EboLogo({ 
  className, 
  size = 'md', 
  variant = 'default',
  showText = true 
}: EboLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const LogoIcon = () => (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size],
      className
    )}>
      {/* Fond du logo avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg"></div>
      
      {/* Icône clipboard avec checkmarks et graphique */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Clipboard outline */}
        <div className="w-3/4 h-3/4 border-2 border-white rounded-sm relative">
          {/* Clip du clipboard */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-sm"></div>
          
          {/* Contenu du clipboard */}
          <div className="absolute inset-1 flex flex-col justify-between">
            {/* Section checkmarks */}
            <div className="flex flex-col space-y-0.5">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-2 h-0.5 bg-white rounded"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1.5 h-0.5 bg-white rounded"></div>
              </div>
            </div>
            
            {/* Section graphique */}
            <div className="flex items-end space-x-0.5">
              <div className="w-0.5 h-1 bg-white rounded"></div>
              <div className="w-0.5 h-1.5 bg-white rounded"></div>
              <div className="w-0.5 h-1 bg-white rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <LogoIcon />
        {showText && (
          <div className={cn("font-bold text-teal-600", textSizeClasses[size])}>
            Ebo'o Gest
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoIcon />
      {showText && (
        <div className="flex flex-col">
          <div className={cn("font-bold text-teal-600 leading-tight", textSizeClasses[size])}>
            Ebo'o
          </div>
          <div className={cn("font-bold text-teal-600 leading-tight", textSizeClasses[size])}>
            Gest
          </div>
        </div>
      )}
    </div>
  );
}
