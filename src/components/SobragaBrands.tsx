import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Plus,
  Droplets,
  Wine,
  Coffee
} from "lucide-react";

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

interface SobragaBrandsProps {
  onProductSelect?: (product: any) => void;
}

export default function SobragaBrands({ onProductSelect }: SobragaBrandsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Générer toutes les combinaisons de produits
  const generateAllProducts = () => {
    const products: Array<{
      name: string;
      category: string;
      variant: string;
      suggestedPrice: number;
      unit: string;
    }> = [];

    Object.entries(SOBRAGA_BRANDS).forEach(([category, brands]) => {
      brands.forEach(brand => {
        brand.variants.forEach(variant => {
          const fullName = `${brand.name} ${variant}`;
          let suggestedPrice = 0;

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

          products.push({
            name: fullName,
            category,
            variant,
            suggestedPrice,
            unit: "unité"
          });
        });
      });
    });

    return products;
  };

  const allProducts = generateAllProducts();
  
  // Filtrer les produits
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(SOBRAGA_BRANDS);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Boissons gazeuses / sodas":
        return <Coffee className="w-4 h-4" />;
      case "Eaux minérales":
        return <Droplets className="w-4 h-4" />;
      case "Bières / boisson alcoolisée":
        return <Wine className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleProductSelect = (product: any) => {
    if (onProductSelect) {
      onProductSelect({
        name: product.name,
        category: product.category,
        selling_price: product.suggestedPrice,
        unit: product.unit,
        description: `Produit Sobraga - ${product.category}`
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Marques Sobraga disponibles
        </CardTitle>
        <CardDescription>
          {allProducts.length} produits Sobraga avec prix suggérés
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une marque Sobraga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {filteredProducts.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {getCategoryIcon(product.category)}
                </div>
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category} • {product.variant}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {product.suggestedPrice.toLocaleString()} FCFA
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prix suggéré
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleProductSelect(product)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
