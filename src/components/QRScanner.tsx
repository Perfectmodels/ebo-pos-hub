import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  QrCode, 
  Camera, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  X,
  Package,
  DollarSign,
  Hash
} from "lucide-react";

interface QRScannerProps {
  onProductFound: (productData: any) => void;
  onProductNotFound: (code: string) => void;
  mode?: 'add' | 'search' | 'sell';
  title?: string;
  description?: string;
}

interface ProductData {
  code: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export default function QRScanner({ 
  onProductFound, 
  onProductNotFound, 
  mode = 'add',
  title = "Scanner QR Code",
  description = "Scannez un code QR pour ajouter un produit"
}: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simuler la détection de QR code (en production, utiliser une vraie librairie)
  const simulateQRDetection = (code: string) => {
    // Simulation de données produit basées sur le code
    const mockProducts: Record<string, ProductData> = {
      "1234567890123": {
        code: "1234567890123",
        name: "Coca Cola 33cl",
        price: 500,
        category: "Boissons",
        description: "Boisson gazeuse"
      },
      "2345678901234": {
        code: "2345678901234",
        name: "Pain de Mie",
        price: 400,
        category: "Boulangerie",
        description: "Pain de mie blanc"
      },
      "3456789012345": {
        code: "3456789012345",
        name: "Attiéké",
        price: 1500,
        category: "Plats",
        description: "Attiéké traditionnel"
      },
      "4567890123456": {
        code: "4567890123456",
        name: "Café au Lait",
        price: 300,
        category: "Boissons",
        description: "Café au lait chaud"
      }
    };

    return mockProducts[code] || null;
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setLoading(true);

      // Demander l'accès à la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Caméra arrière pour mobile
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simuler la détection de QR code
      setTimeout(() => {
        // En production, utiliser une vraie librairie comme jsQR ou QuaggaJS
        const mockCode = "1234567890123"; // Code simulé
        handleQRDetected(mockCode);
      }, 2000);

    } catch (error) {
      console.error('Erreur accès caméra:', error);
      toast({
        title: "Erreur caméra",
        description: "Impossible d'accéder à la caméra. Vérifiez les permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleQRDetected = (code: string) => {
    setScanResult(code);
    stopScanning();
    
    // Simuler la recherche du produit
    const product = simulateQRDetection(code);
    
    if (product) {
      setProductData(product);
      onProductFound(product);
      toast({
        title: "Produit trouvé !",
        description: `${product.name} détecté avec succès`,
      });
    } else {
      onProductNotFound(code);
      toast({
        title: "Produit non trouvé",
        description: `Aucun produit trouvé pour le code: ${code}`,
        variant: "destructive"
      });
    }
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;
    
    setLoading(true);
    
    // Simuler la recherche
    setTimeout(() => {
      const product = simulateQRDetection(manualCode);
      
      if (product) {
        setProductData(product);
        onProductFound(product);
        toast({
          title: "Produit trouvé !",
          description: `${product.name} trouvé avec succès`,
        });
      } else {
        onProductNotFound(manualCode);
        toast({
          title: "Produit non trouvé",
          description: `Aucun produit trouvé pour le code: ${manualCode}`,
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  const resetScanner = () => {
    setScanResult(null);
    setProductData(null);
    setManualCode("");
    stopScanning();
  };

  const handleClose = () => {
    resetScanner();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          Scanner QR
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scanner Section */}
          {!scanResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scanner de code QR</CardTitle>
                <CardDescription>
                  Positionnez le code QR dans le cadre pour le scanner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Preview */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    playsInline
                    muted
                  />
                  {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-lg p-4">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                        <p className="text-white text-sm mt-2">Scan en cours...</p>
                      </div>
                    </div>
                  )}
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Caméra non active</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scanner Controls */}
                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button onClick={startScanning} className="flex-1">
                      <Camera className="w-4 h-4 mr-2" />
                      {loading ? "Démarrage..." : "Démarrer le scan"}
                    </Button>
                  ) : (
                    <Button onClick={stopScanning} variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Arrêter le scan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recherche manuelle</CardTitle>
              <CardDescription>
                Entrez manuellement le code du produit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Entrez le code produit..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                />
                <Button 
                  onClick={handleManualSearch}
                  disabled={loading || !manualCode.trim()}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Found */}
          {productData && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Produit trouvé !
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nom du produit</Label>
                    <p className="text-lg font-semibold">{productData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Code</Label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {productData.code}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prix</Label>
                    <p className="text-lg font-semibold text-primary">
                      {productData.price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Catégorie</Label>
                    <Badge variant="secondary">{productData.category}</Badge>
                  </div>
                </div>
                
                {productData.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-muted-foreground">{productData.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleClose} className="flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmer
                  </Button>
                  <Button onClick={resetScanner} variant="outline">
                    Scanner un autre
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Not Found */}
          {scanResult && !productData && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800">
                  <AlertCircle className="w-5 h-5" />
                  Produit non trouvé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Aucun produit trouvé pour le code: <strong>{scanResult}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Voulez-vous ajouter ce produit à votre base de données ?
                </p>
                
                <div className="flex gap-2">
                  <Button onClick={handleClose} variant="outline">
                    Annuler
                  </Button>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le produit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
