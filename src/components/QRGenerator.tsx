import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  QrCode, 
  Download, 
  Copy, 
  CheckCircle,
  Package,
  Hash,
  DollarSign,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRGeneratorProps {
  product?: {
    id: string;
    name: string;
    code: string;
    selling_price: number;
    category: string;
  };
  onClose?: () => void;
}

export default function QRGenerator({ product, onClose }: QRGeneratorProps) {
  const [qrData, setQrData] = useState("");
  const [customData, setCustomData] = useState("");
  const { toast } = useToast();

  // Générer les données QR basées sur le produit
  const generateQRData = () => {
    if (product) {
      const productData = {
        code: product.code,
        name: product.name,
        price: product.selling_price,
        category: product.category,
        id: product.id
      };
      setQrData(JSON.stringify(productData));
    } else if (customData) {
      setQrData(customData);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData);
    toast({
      title: "Copié !",
      description: "Données QR copiées dans le presse-papiers",
    });
  };

  const downloadQR = () => {
    // En production, utiliser une vraie librairie comme qrcode.js
    toast({
      title: "Fonctionnalité en développement",
      description: "Le téléchargement du QR code sera disponible prochainement",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          Générer QR
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            Générateur de Code QR
          </DialogTitle>
          <DialogDescription>
            Générez un code QR pour vos produits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Informations du produit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nom</Label>
                    <p className="text-sm">{product.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Code</Label>
                    <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {product.code}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prix</Label>
                    <p className="text-sm font-semibold text-primary">
                      {product.selling_price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Catégorie</Label>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Data Input */}
          {!product && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Données personnalisées</CardTitle>
                <CardDescription>
                  Entrez les données que vous souhaitez encoder dans le QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customData">Données QR</Label>
                    <Input
                      id="customData"
                      value={customData}
                      onChange={(e) => setCustomData(e.target.value)}
                      placeholder="Entrez les données à encoder..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Preview */}
          {qrData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aperçu du QR Code</CardTitle>
                <CardDescription>
                  Code QR généré pour vos données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Placeholder pour le QR code */}
                <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Aperçu du QR Code
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      En production, le vrai QR code s'affichera ici
                    </p>
                  </div>
                </div>

                {/* QR Data */}
                <div>
                  <Label className="text-sm font-medium">Données encodées</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <code className="text-xs break-all">{qrData}</code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier les données
                  </Button>
                  <Button onClick={downloadQR} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button onClick={generateQRData} className="flex-1">
              <QrCode className="w-4 h-4 mr-2" />
              Générer le QR Code
            </Button>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
            )}
          </div>

          {/* Usage Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Comment utiliser</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Le QR code contient toutes les informations du produit</li>
                    <li>• Scannez-le avec l'application pour ajouter rapidement le produit</li>
                    <li>• Vous pouvez imprimer le QR code sur les étiquettes produits</li>
                    <li>• Compatible avec tous les scanners QR standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
