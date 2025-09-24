import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield, Upload, Image } from 'lucide-react';

interface SecureImageUploadProps {
  onImageSelect: (file: File) => void;
  sensitive?: boolean;
  className?: string;
  label?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
}

export const SecureImageUpload: React.FC<SecureImageUploadProps> = ({
  onImageSelect,
  sensitive = false,
  className = '',
  label,
  disabled = false,
  accept = 'image/*',
  multiple = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isSensitiveImageUpload = () => {
    if (sensitive) return true;
    
    // Vérifier si l'image upload contient des données sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'session', 'key', 'email', 'phone', 'address'];
    const content = `${label} ${selectedImage?.name}`;
    return sensitiveFields.some(field => 
      content.toLowerCase().includes(field)
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSensitiveImageUpload() && !isVisible) {
      return; // Empêcher les changements si masqué
    }
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      onImageSelect(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getDisplayImageName = () => {
    if (isSensitiveImageUpload() && !isVisible) {
      return '***MASKED***';
    }
    return selectedImage?.name || 'Aucune image sélectionnée';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          {isSensitiveImageUpload() && (
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
      
      {/* Image Upload */}
      <div className="relative">
        <input
          type="file"
          onChange={handleImageSelect}
          disabled={disabled || (isSensitiveImageUpload() && !isVisible)}
          accept={accept}
          multiple={multiple}
          className={`w-full px-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            isSensitiveImageUpload() && !isVisible ? 'blur-sm' : ''
          }`}
        />
        
        {isSensitiveImageUpload() && (
          <Lock className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
      
      {/* Image Preview */}
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className={`w-full h-32 object-cover rounded border ${
              isSensitiveImageUpload() && !isVisible ? 'blur-sm' : ''
            }`}
          />
        </div>
      )}
      
      {/* Image Display */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm text-muted-foreground ${isSensitiveImageUpload() && !isVisible ? 'blur-sm' : ''}`}>
          {getDisplayImageName()}
        </span>
        {isSensitiveImageUpload() && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" />
            <span>Protégé</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecureImageUpload;
