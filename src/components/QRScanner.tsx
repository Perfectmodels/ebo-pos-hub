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
import { useProducts } from "@/hooks/useProducts";
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
  onProductNotFound?: (code: string) => void;
  onClose?: () => void;
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
  const { products } = useProducts();
  
  const scannerRef = useRef<any>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  // Rechercher un produit existant dans la base de données
  const findProductByCode = (code: string) => {
    return products.find(product => product.id === code || product.name.toLowerCase().includes(code.toLowerCase()));
  };

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setLoading(true);

      // Charger la librairie html5-qrcode dynamiquement
      const { Html5QrcodeScanner } = await import('html5-qrcode');

      if (!scannerElementRef.current) return;

      // Nettoyer le scanner précédent s'il existe
      if (scannerRef.current) {
        await scannerRef.current.clear();
      }

      // Créer le scanner
      scannerRef.current = new Html5QrcodeScanner(
        scannerElementRef.current.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: []
        },
        false
      );

      // Démarrer le scan
      scannerRef.current.render(
        (decodedText: string) => {
          handleQRDetected(decodedText);
        },
        (errorMessage: string) => {
          // Erreur silencieuse pour éviter trop de logs
          console.log('Scan error:', errorMessage);
        }
      );

    } catch (error) {
      console.error('Erreur initialisation scanner:', error);
      toast({
        title: "Erreur scanner",
        description: "Impossible d'initialiser le scanner QR. Vérifiez les permissions de la caméra.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stopScanning = async () => {
    setIsScanning(false);
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear();
      } catch (error) {
        console.log('Erreur arrêt scanner:', error);
      }
    }
  };

  const handleQRDetected = async (code: string) => {
    setScanResult(code);
    await stopScanning();
    
    // Rechercher le produit dans la base de données
    const existingProduct = findProductByCode(code);
    
    if (existingProduct) {
      const productData = {
        code: code,
        name: existingProduct.name,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.name
      };
      
      setProductData(productData);
      onProductFound(productData);
      toast({
        title: "Produit trouvé !",
        description: `${productData.name} détecté avec succès`,
      });
    } else {
      // Si c'est un nouveau produit, créer les données de base
      const newProductData = {
        code: code,
        name: `Produit ${code}`,
        price: 0,
        category: "Non classé",
        description: "Nouveau produit détecté"
      };
      
      setProductData(newProductData);
      onProductFound(newProductData);
      toast({
        title: "Nouveau produit détecté",
        description: `Code: ${code}. Veuillez compléter les informations.`,
      });
    }
  };

  const handleManualSearch = () => {
    if (!manualCode.trim()) return;
    
    const existingProduct = findProductByCode(manualCode);
    
    if (existingProduct) {
      const productData = {
        code: manualCode,
        name: existingProduct.name,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.name
      };
      
      setProductData(productData);
      onProductFound(productData);
      toast({
        title: "Produit trouvé !",
        description: `${productData.name} trouvé manuellement`,
      });
    } else {
      onProductNotFound(manualCode);
      toast({
        title: "Produit non trouvé",
        description: `Aucun produit trouvé pour le code: ${manualCode}`,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    stopScanning();
    setIsOpen(false);
    setScanResult(null);
    setProductData(null);
    setManualCode("");
  };

  // Nettoyer le scanner quand le composant se démonte
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.log);
      }
    };
  }, []);

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
            <QrCode className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Scanner QR */}
          {isScanning ? (
            <div className="relative">
              <div 
                id="qr-scanner" 
                ref={scannerElementRef}
                className="w-full h-64 bg-black rounded-lg flex items-center justify-center"
              >
                {loading && (
                  <div className="flex flex-col items-center gap-2 text-white">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p>Initialisation du scanner...</p>
                  </div>
                )}
              </div>
              
              <Button
                onClick={stopScanning}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Camera className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Scanner QR Code</p>
                <p className="text-sm text-muted-foreground">
                  Cliquez pour démarrer le scanner
                </p>
              </div>
              <Button onClick={startScanning} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Démarrage...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Démarrer le scan
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Recherche manuelle */}
          <div className="space-y-2">
            <Label htmlFor="manual-code">Ou saisissez le code manuellement</Label>
            <div className="flex gap-2">
              <Input
                id="manual-code"
                placeholder="Code produit ou nom..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
              <Button onClick={handleManualSearch} variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Résultat du scan */}
          {productData && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">Produit détecté</h4>
                    <div className="space-y-1 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{productData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-green-600" />
                        <span className="text-muted-foreground">{productData.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{productData.price} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informations sur les codes supportés */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            <p className="font-medium mb-1">Codes supportés :</p>
            <ul className="space-y-1">
              <li>• QR Code</li>
              <li>• Code-barres EAN-13</li>
              <li>• Code-barres Code-128</li>
              <li>• Recherche par nom de produit</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}