import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  Image, 
  X, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface FileUploadProps {
  title: string;
  description: string;
  acceptedTypes: string[];
  maxSize: number; // in MB
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  required?: boolean;
}

export default function FileUpload({
  title,
  description,
  acceptedTypes,
  maxSize,
  onFileSelect,
  currentFile,
  required = false
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Le fichier est trop volumineux. Taille maximale : ${maxSize}MB`);
      return;
    }
    
    // Vérifier le type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedTypes.some(type => 
      type.includes(fileExtension || '') || file.type.includes(type)
    );
    
    if (!isValidType) {
      setError(`Type de fichier non supporté. Types acceptés : ${acceptedTypes.join(', ')}`);
      return;
    }
    
    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">
            {title}
            {required && <span className="text-destructive ml-1">*</span>}
          </h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {currentFile && (
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Fichier sélectionné
          </Badge>
        )}
      </div>

      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : currentFile 
              ? 'border-green-500 bg-green-50' 
              : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          {currentFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(currentFile)}
                <div>
                  <p className="font-medium text-sm">{currentFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(currentFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">
                Glissez-déposez votre fichier ici
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                ou cliquez pour sélectionner
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choisir un fichier
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Types acceptés : {acceptedTypes.join(', ')} • Max {maxSize}MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {error && (
        <div className="flex items-center space-x-2 text-destructive text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
