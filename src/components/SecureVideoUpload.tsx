import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Upload, Video } from 'lucide-react';

interface SecureVideoUploadProps {
  onVideoSelect: (file: File) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const SecureVideoUpload: React.FC<SecureVideoUploadProps> = ({
  onVideoSelect,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  accept = 'video/*',
  multiple = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveVideoUpload = () => {
    if (sensitive) return true;
    
    // Vérifier si la vidéo upload contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${selectedVideo?.name}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSensitiveVideoUpload() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      onVideoSelect(file);
      
      // Créer un aperçu de la vidéo
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDisplayVideoName = () => {
    if (isSensitiveVideoUpload() && !isVisible) {
      return '***MASKED***';
    }
    return selectedVideo?.name || 'Aucune vidéo sélectionnée';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveVideoUpload() && (
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
      
      {/* Video Upload */}
      <div className="relative">
        <input
          type="file"
          onChange={handleVideoSelect}
          disabled={disabled || (isSensitiveVideoUpload() && !isVisible)}
          accept={accept}
          multiple={multiple}
          className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveVideoUpload() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveVideoUpload() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Video Preview */}
      {preview && (
        <div className="mt-4">
          <video
            src={preview}
            controls
            className={`w-full h-32 object-cover rounded border ${
              isSensitiveVideoUpload() && !isVisible ? 'blur-sm' : ''
            }`}
          />
        </div>
      )}
      
      {/* Video Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveVideoUpload() && !isVisible ? 'blur-sm' : ''}`}>
          {getDisplayVideoName()}
        </span>
        {isSensitiveVideoUpload() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureVideoUpload;
