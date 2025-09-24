import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Upload, File } from 'lucide-react';

interface SecureFileUploadProps {
  onFileSelect: (file: File) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFileSelect,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  accept,
  multiple = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveFileUpload = () => {
    if (sensitive) return true;
    
    // Vérifier si le file upload contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${selectedFile?.name}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSensitiveFileUpload() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const getDisplayFileName = () => {
    if (isSensitiveFileUpload() && !isVisible) {
      return '***MASKED***';
    }
    return selectedFile?.name || 'Aucun fichier sélectionné';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveFileUpload() && (
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
      
      {/* File Upload */}
      <div className="relative">
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={disabled || (isSensitiveFileUpload() && !isVisible)}
          accept={accept}
          multiple={multiple}
          className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveFileUpload() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveFileUpload() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* File Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveFileUpload() && !isVisible ? 'blur-sm' : ''}`}>
          {getDisplayFileName()}
        </span>
        {isSensitiveFileUpload() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureFileUpload;
