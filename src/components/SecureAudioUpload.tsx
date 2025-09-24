import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Upload, Music } from 'lucide-react';

interface SecureAudioUploadProps {
  onAudioSelect: (file: File) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const SecureAudioUpload: React.FC<SecureAudioUploadProps> = ({
  onAudioSelect,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  accept = 'audio/*',
  multiple = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveAudioUpload = () => {
    if (sensitive) return true;
    
    // Vérifier si l'audio upload contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${selectedAudio?.name}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSensitiveAudioUpload() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAudio(file);
      onAudioSelect(file);
      
      // Créer un aperçu de l'audio
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDisplayAudioName = () => {
    if (isSensitiveAudioUpload() && !isVisible) {
      return '***MASKED***';
    }
    return selectedAudio?.name || 'Aucun audio sélectionné';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveAudioUpload() && (
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
      
      {/* Audio Upload */}
      <div className="relative">
        <input
          type="file"
          onChange={handleAudioSelect}
          disabled={disabled || (isSensitiveAudioUpload() && !isVisible)}
          accept={accept}
          multiple={multiple}
          className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveAudioUpload() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveAudioUpload() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Audio Preview */}
      {preview && (
        <div className="mt-4">
          <audio
            src={preview}
            controls
            className={`w-full h-16 rounded border ${
              isSensitiveAudioUpload() && !isVisible ? 'blur-sm' : ''
            }`}
          />
        </div>
      )}
      
      {/* Audio Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveAudioUpload() && !isVisible ? 'blur-sm' : ''}`}>
          {getDisplayAudioName()}
        </span>
        {isSensitiveAudioUpload() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureAudioUpload;
