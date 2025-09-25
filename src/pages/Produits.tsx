import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/QRScanner";
import QuickAddProduct from "@/components/QuickAddProduct";
import QRGenerator from "@/components/QRGenerator";
import { 
  Package, 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Filter,
  Loader2,
  QrCode,
  Eye,
  DollarSign
} from "lucide-react";

export default function Produits() {
  const { products, loading: productsLoading, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showQRGenerator, setShowQRGenerator] = useState(false);

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "Tous" || product.category === selectedCategory)
  );

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await deleteProduct(id);
        toast({
          title: "Produit supprimé",
          description: "Le produit a été supprimé avec succès",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le produit",
          variant: "destructive"
        });
      }
    }
  };

  const handleQRScanned = (productData: any) => {
    toast({
      title: "Produit scanné",
      description: `${productData.name} détecté avec succès`,
    });
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produits & Services</h1>
            <p className="text-muted-foreground">Gérez votre catalogue de produits et services</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddProduct(true)} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-stats">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold truncate">
                      {product.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowQRGenerator(true);
                      }}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-semibold text-primary">
                    {product.price.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <span className={`font-semibold ${product.current_stock <= product.min_stock ? 'text-red-500' : 'text-green-500'}`}>
                    {product.current_stock} {product.unit}
                  </span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowAddProduct(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucun produit ne correspond à votre recherche." : "Commencez par ajouter votre premier produit."}
              </p>
              <Button onClick={() => setShowAddProduct(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        {showAddProduct && (
          <QuickAddProduct
            product={selectedProduct}
            onProductAdded={() => {
              setShowAddProduct(false);
              setSelectedProduct(null);
            }}
            onClose={() => {
              setShowAddProduct(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {showQRGenerator && selectedProduct && (
          <QRGenerator
            product={selectedProduct}
            onClose={() => {
              setShowQRGenerator(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
