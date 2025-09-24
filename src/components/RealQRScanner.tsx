import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, Search, X, Loader2, Package, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAuditTrail } from '@/hooks/useAuditTrail';
import { useAuth } from '@/contexts/AuthContext';

interface RealQRScannerProps {
  onProductFound: (productData: any) => void;
  onProductNotFound?: (code: string) => void;
  mode: 'add' | 'sell' | 'search';
  title?: string;
  description?: string;
}

const RealQRScanner: React.FC<RealQRScannerProps> = ({
  onProductFound,
  onProductNotFound,
  mode,
  title = "Scanner QR Code",
  description = "Scannez un code QR pour interagir avec un produit."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedProducts, setScannedProducts] = useState<any[]>([]);
  const scannerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { addProduct, products } = useProducts();
  const { logProductAction } = useAuditTrail();
  const { user } = useAuth();

  const qrCodeRegionId = "qr-code-full-region";

  // Initialiser le scanner QR
  useEffect(() => {
    if (isOpen && isScanning) {
      try {
        scannerRef.current = new (window as any).Html5QrcodeScanner(
          qrCodeRegionId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [
              (window as any).Html5QrcodeSupportedFormats.QR_CODE,
              (window as any).Html5QrcodeSupportedFormats.EAN_13,
              (window as any).Html5QrcodeSupportedFormats.CODE_128,
              (window as any).Html5QrcodeSupportedFormats.CODE_39,
            ],
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true
            }
          },
          false
        );

        const onScanSuccess = (decodedText: string) => {
          setScanResult(decodedText);
          setIsScanning(false);
          scannerRef.current?.clear().catch((error: any) => {
            console.error("Failed to clear html5QrcodeScanner", error);
          });
          handleDecodedCode(decodedText);
        };

        const onScanError = (errorMessage: string) => {
          // Ne pas afficher les erreurs de scan normales
          if (!errorMessage.includes('NotFoundException')) {
            console.warn(`QR Code Scan Error: ${errorMessage}`);
          }
        };

        scannerRef.current.render(onScanSuccess, onScanError);
      } catch (error) {
        console.error('Scanner initialization error:', error);
        setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      }
    } else if (scannerRef.current) {
      scannerRef.current.clear().catch((error: any) => {
        console.error("Failed to clear html5QrcodeScanner", error);
      });
      scannerRef.current = null;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error: any) => {
          console.error("Failed to clear html5QrcodeScanner on unmount", error);
        });
      }
    };
  }, [isOpen, isScanning]);

  const handleDecodedCode = async (code: string) => {
    try {
      // Vérifier si c'est un code produit existant
      const existingProduct = products.find(p => p.barcode === code || p.code === code);
      
      if (existingProduct) {
        // Produit existant trouvé
        const productData = {
          id: existingProduct.id,
          name: existingProduct.name,
          code: code,
          price: existingProduct.selling_price,
          stock: existingProduct.current_stock,
          category: existingProduct.category
        };
        
        setScannedProducts(prev => [...prev, productData]);
        onProductFound(productData);
        
        toast({
          title: "Produit trouvé !",
          description: `${existingProduct.name} - Stock: ${existingProduct.current_stock}`,
        });

        // Log d'audit
        logProductAction('qr_scan_found', existingProduct.id, undefined, { scanned_code: code });
        
      } else {
        // Produit non trouvé - proposer de l'ajouter
        const productData = {
          name: `Produit ${code}`,
          code: code,
          barcode: code,
          price: 0,
          stock: 0,
          category: 'Non classé'
        };
        
        setScannedProducts(prev => [...prev, productData]);
        
        toast({
          title: "Produit non trouvé",
          description: "Ce produit n'existe pas dans votre stock. Voulez-vous l'ajouter ?",
          action: (
            <Button 
              size="sm" 
              onClick={() => handleAddNewProduct(productData)}
            >
              Ajouter
            </Button>
          )
        });

        onProductNotFound?.(code);
      }
    } catch (error) {
      console.error('Error handling decoded code:', error);
      toast({
        title: "Erreur de scan",
        description: "Impossible de traiter le code scanné",
        variant: "destructive"
      });
    }
  };

  const handleAddNewProduct = async (productData: any) => {
    try {
      const newProduct = {
        name: productData.name,
        code: productData.code,
        barcode: productData.barcode,
        selling_price: productData.price || 0,
        purchase_price: 0,
        current_stock: 0,
        min_stock: 5,
        category: productData.category,
        description: `Produit ajouté via scan QR - Code: ${productData.code}`,
        user_id: user?.id
      };

      const result = await addProduct(newProduct);
      
      if (result.data) {
        toast({
          title: "Produit ajouté !",
          description: `${newProduct.name} a été ajouté à votre stock`,
        });

        // Log d'audit
        logProductAction('product_added_via_qr', result.data[0].id, undefined, { 
          scanned_code: productData.code,
          method: 'qr_scanner'
        });

        onProductFound(result.data[0]);
      }
    } catch (error) {
      console.error('Error adding new product:', error);
      toast({
        title: "Erreur d'ajout",
        description: "Impossible d'ajouter le produit",
        variant: "destructive"
      });
    }
  };

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      handleDecodedCode(manualCode.trim());
      setManualCode('');
    } else {
      toast({
        title: "Code manquant",
        description: "Veuillez entrer un code produit",
        variant: "destructive"
      });
    }
  };

  const openScanner = () => {
    setIsOpen(true);
    setIsScanning(true);
    setScanResult(null);
    setManualCode('');
    setCameraError(null);
  };

  const closeScanner = () => {
    setIsOpen(false);
    setIsScanning(false);
    setScannedProducts([]);
  };

  const clearScannedProducts = () => {
    setScannedProducts([]);
  };

  return (
    <>
      <Button variant="outline" onClick={openScanner}>
        <QrCode className="w-4 h-4 mr-2" />
        Scanner QR
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Scanner QR */}
            {isScanning && (
              <div className="space-y-4">
                {cameraError ? (
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{cameraError}</span>
                    </div>
                  </Card>
                ) : (
                  <div className="relative">
                    <div id={qrCodeRegionId} className="w-full"></div>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setIsScanning(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recherche manuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recherche manuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Entrez le code produit..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                  />
                  <Button onClick={handleManualSearch} disabled={!manualCode.trim()}>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Produits scannés */}
            {scannedProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Produits scannés</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {scannedProducts.length} produit{scannedProducts.length > 1 ? 's' : ''}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={clearScannedProducts}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scannedProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Code: {product.code} | Stock: {product.stock}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.id ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Existant
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddNewProduct(product)}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Ajouter
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              <div className="flex gap-2">
                {!isScanning && (
                  <Button onClick={() => setIsScanning(true)}>
                    <Camera className="w-4 h-4 mr-2" />
                    Démarrer le scan
                  </Button>
                )}
                {isScanning && (
                  <Button variant="outline" onClick={() => setIsScanning(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Arrêter le scan
                  </Button>
                )}
              </div>
              
              <Button variant="outline" onClick={closeScanner}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RealQRScanner;
