import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { 
  Package, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  QrCode,
  Hash,
  DollarSign,
  Tag,
  ChevronDown,
  Check
} from "lucide-react";
import QRScanner from "./QRScanner";
import { cn } from "@/lib/utils";

interface QuickAddProductProps {
  onProductAdded?: (product: any) => void;
  onClose?: () => void;
}

// Base de données des marques Sobraga
const SOBRAGA_BRANDS = {
  "Boissons gazeuses / sodas": [
    { name: "Coca-Cola", variants: ["33cl", "50cl", "1L", "1.5L", "2L"] },
    { name: "Orangina", variants: ["33cl", "50cl", "1L"] },
    { name: "Vimto", variants: ["33cl", "50cl", "1L"] },
    { name: "D'Jino", variants: ["33cl", "50cl", "1L"] },
    { name: "Schweppes", variants: ["33cl", "50cl", "1L"] },
    { name: "TOP", variants: ["33cl", "50cl", "1L"] },
    { name: "Fanta", variants: ["33cl", "50cl", "1L"] },
    { name: "Sprite", variants: ["33cl", "50cl", "1L"] },
    { name: "Malta", variants: ["33cl", "50cl", "1L"] },
    { name: "Sumol", variants: ["33cl", "50cl", "1L"] }
  ],
  "Eaux minérales": [
    { name: "Andza", variants: ["50cl", "1L", "1.5L"] },
    { name: "Akewa", variants: ["50cl", "1L", "1.5L"] },
    { name: "Aning'eau", variants: ["50cl", "1L", "1.5L"] }
  ],
  "Bières / boisson alcoolisée": [
    { name: "Régab", variants: ["33cl", "50cl", "65cl"] },
    { name: "Castel Beer", variants: ["33cl", "50cl", "65cl"] },
    { name: "33 Export", variants: ["33cl", "50cl", "65cl"] },
    { name: "Beaufort", variants: ["33cl", "50cl", "65cl"] },
    { name: "Doppel", variants: ["33cl", "50cl", "65cl"] }
  ]
};

// Générer toutes les combinaisons de produits
const generateProductSuggestions = () => {
  const suggestions: Array<{
    name: string;
    category: string;
    suggestedPrice: number;
    unit: string;
  }> = [];

  Object.entries(SOBRAGA_BRANDS).forEach(([category, brands]) => {
    brands.forEach(brand => {
      brand.variants.forEach(variant => {
        const fullName = `${brand.name} ${variant}`;
        let suggestedPrice = 0;
        let unit = "unité";

        // Prix suggérés basés sur la taille
        if (variant.includes("33cl")) {
          suggestedPrice = 500;
        } else if (variant.includes("50cl")) {
          suggestedPrice = 750;
        } else if (variant.includes("65cl")) {
          suggestedPrice = 1000;
        } else if (variant.includes("1L")) {
          suggestedPrice = 1200;
        } else if (variant.includes("1.5L")) {
          suggestedPrice = 1800;
        } else if (variant.includes("2L")) {
          suggestedPrice = 2500;
        }

        suggestions.push({
          name: fullName,
          category,
          suggestedPrice,
          unit
        });
      });
    });
  });

  return suggestions;
};

export default function QuickAddProduct({ onProductAdded, onClose }: QuickAddProductProps) {
  const { addProduct } = useProducts();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState(generateProductSuggestions());
  const [filteredSuggestions, setFilteredSuggestions] = useState(generateProductSuggestions());
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    selling_price: 0,
    buying_price: 0,
    current_stock: 0,
    min_stock: 0,
    unit: "unité",
    description: ""
  });

  const categories = [
    "Alimentaire",
    "Boissons", 
    "Boulangerie",
    "Hygiène",
    "Entretien",
    "Autres"
  ];

  const units = [
    "unité",
    "kg",
    "g",
    "L",
    "ml",
    "paquet",
    "boîte",
    "bouteille"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Filtrer les suggestions quand on tape le nom
    if (field === "name") {
      const filtered = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(value.length > 0);
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      category: suggestion.category,
      selling_price: suggestion.suggestedPrice,
      unit: suggestion.unit
    }));
    setShowSuggestions(false);
  };

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.suggestions-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQRScanned = (productData: any) => {
    setFormData(prev => ({
      ...prev,
      name: productData.name,
      code: productData.code,
      selling_price: productData.price,
      category: productData.category,
      description: productData.description || ""
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code || !formData.category) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au moins le nom, le code et la catégorie",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await addProduct({
        name: formData.name,
        code: formData.code,
        category: formData.category,
        selling_price: formData.selling_price,
        buying_price: formData.buying_price,
        current_stock: formData.current_stock,
        min_stock: formData.min_stock,
        unit: formData.unit,
        description: formData.description
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Produit ajouté !",
        description: `${formData.name} a été ajouté avec succès`,
      });

      onProductAdded?.(data);
      onClose?.();
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de l'ajout du produit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Ajout rapide de produit
        </CardTitle>
        <CardDescription>
          Ajoutez un nouveau produit à votre inventaire
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Scanner Section */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Scanner QR Code</p>
              <p className="text-sm text-muted-foreground">
                Scannez un code QR pour remplir automatiquement les informations
              </p>
            </div>
          </div>
          <QRScanner 
            onProductFound={handleQRScanned}
            onProductNotFound={(code) => {
              setFormData(prev => ({ ...prev, code }));
            }}
            mode="add"
            title="Scanner produit"
            description="Scannez le code QR du produit à ajouter"
          />
        </div>

        {/* Sobraga Brands Info */}
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Marques Sobraga disponibles</p>
              <p className="text-sm text-blue-700">
                {suggestions.length} produits Sobraga avec prix suggérés
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {suggestions.length} produits
          </Badge>
        </div>

        {/* Form */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <div className="relative suggestions-container">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Coca Cola 33cl"
                onFocus={() => setShowSuggestions(formData.name.length > 0)}
              />
              
              {/* Suggestions Sobraga */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Marques Sobraga disponibles
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowSuggestions(false)}
                      >
                        ×
                      </Button>
                    </div>
                    {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div>
                          <div className="font-medium">{suggestion.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {suggestion.category} • {suggestion.suggestedPrice.toLocaleString()} FCFA
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.unit}
                        </Badge>
                      </div>
                    ))}
                    {filteredSuggestions.length > 10 && (
                      <div className="text-xs text-muted-foreground text-center p-2">
                        +{filteredSuggestions.length - 10} autres suggestions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="code">Code produit *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Code-barres ou QR"
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="selling_price">Prix de vente (FCFA) *</Label>
            <Input
              id="selling_price"
              type="number"
              value={formData.selling_price}
              onChange={(e) => handleInputChange('selling_price', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="buying_price">Prix d'achat (FCFA)</Label>
            <Input
              id="buying_price"
              type="number"
              value={formData.buying_price}
              onChange={(e) => handleInputChange('buying_price', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="current_stock">Stock actuel</Label>
            <Input
              id="current_stock"
              type="number"
              value={formData.current_stock}
              onChange={(e) => handleInputChange('current_stock', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="min_stock">Stock minimum</Label>
            <Input
              id="min_stock"
              type="number"
              value={formData.min_stock}
              onChange={(e) => handleInputChange('min_stock', Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="unit">Unité</Label>
            <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du produit (optionnel)"
              rows={3}
            />
          </div>
        </div>

        {/* Summary */}
        {formData.name && formData.code && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Résumé du produit</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>{formData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span>{formData.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>{formData.selling_price.toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <Badge variant="secondary">{formData.category}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.code || !formData.category}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter le produit
              </>
            )}
          </Button>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
