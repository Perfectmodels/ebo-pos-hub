import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements } from "@/hooks/useStockMovements";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/QRScanner";
import QuickAddProduct from "@/components/QuickAddProduct";
import QRGenerator from "@/components/QRGenerator";
import SobragaBrands from "@/components/SobragaBrands";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle,
  Edit,
  Trash2,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  price: number;
  unit: string;
}

export default function Stock() {
  const { products, loading: productsLoading, updateProduct, deleteProduct } = useProducts();
  const { movements, loading: movementsLoading, updateStock } = useStockMovements();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [updating, setUpdating] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showSobragaBrands, setShowSobragaBrands] = useState(false);

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Tous" || product.category === selectedCategory)
    );

  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);

  const getStockStatus = (product: typeof products[0]) => {
    if (product.current_stock <= product.min_stock * 0.5) {
      return { status: 'critical', color: 'bg-destructive text-destructive-foreground' };
    } else if (product.current_stock <= product.min_stock) {
      return { status: 'low', color: 'bg-orange-500 text-white' };
    }
    return { status: 'normal', color: 'bg-accent text-accent-foreground' };
  };

  const handleStockUpdate = async (productId: string, type: 'in' | 'out', quantity: number) => {
    setUpdating(productId);
    try {
      const { error } = await updateStock(productId, quantity, type);
      if (error) {
        throw new Error(error);
      }
      toast({
        title: "Stock mis à jour",
        description: `Stock ${type === 'in' ? 'ajouté' : 'retiré'} avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await deleteProduct(productId);
      if (error) {
        throw new Error(error);
      }
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Stock</h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos inventaires et gérez vos approvisionnements
          </p>
        </div>
        <div className="flex gap-2">
          <QRScanner 
            onProductFound={(productData) => {
              // Pré-remplir le formulaire d'ajout avec les données scannées
              setShowAddProduct(true);
            }}
            onProductNotFound={(code) => {
              toast({
                title: "Produit non trouvé",
                description: `Aucun produit trouvé pour le code: ${code}`,
                variant: "destructive"
              });
            }}
            mode="add"
            title="Scanner produit"
            description="Scannez un code QR pour ajouter un produit"
          />
          <Button variant="outline" onClick={() => setShowSobragaBrands(true)}>
            <Package className="w-4 h-4 mr-2" />
            Marques Sobraga
          </Button>
          <Button className="btn-gradient" onClick={() => setShowAddProduct(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Produit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Produits</p>
                <p className="text-2xl font-bold">
                  {productsLoading ? "..." : products.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Faible</p>
                <p className="text-2xl font-bold text-destructive">
                  {productsLoading ? "..." : lowStockProducts.length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Catégories</p>
              <p className="text-2xl font-bold">
                {productsLoading ? "..." : categories.length - 1}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Valeur Stock</p>
              <p className="text-2xl font-bold">
                {productsLoading ? "..." : `${products.reduce((sum, p) => sum + (p.current_stock * p.selling_price), 0).toLocaleString()} FCFA`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Alerte Stock Faible ({lowStockProducts.length} produits)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-3 rounded bg-card border border-destructive/20">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock: <span className="text-destructive font-semibold">{product.currentStock}</span> / Min: {product.minStock} {product.unit}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Chargement des produits...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit trouvé</p>
              <p className="text-sm">
                {searchTerm ? "Essayez un autre terme de recherche" : "Aucun produit enregistré"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold">Produit</th>
                    <th className="pb-3 font-semibold">Catégorie</th>
                    <th className="pb-3 font-semibold">Stock Actuel</th>
                    <th className="pb-3 font-semibold">Stock Min</th>
                    <th className="pb-3 font-semibold">Prix Unitaire</th>
                    <th className="pb-3 font-semibold">Statut</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">{product.name}</td>
                        <td className="py-3">
                          <Badge variant="secondary">{product.category}</Badge>
                        </td>
                        <td className="py-3">{product.current_stock} {product.unit}</td>
                        <td className="py-3 text-muted-foreground">{product.min_stock} {product.unit}</td>
                        <td className="py-3 font-semibold">{product.selling_price.toLocaleString()} FCFA</td>
                        <td className="py-3">
                          <Badge className={stockStatus.color}>
                            {stockStatus.status === 'critical' ? 'Critique' : 
                             stockStatus.status === 'low' ? 'Faible' : 'Normal'}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, 'in', 10)}
                              disabled={updating === product.id}
                            >
                              {updating === product.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <TrendingUp className="w-3 h-3" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, 'out', 5)}
                              disabled={updating === product.id}
                            >
                              {updating === product.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                            </Button>
                            <QRGenerator 
                              product={{
                                id: product.id,
                                name: product.name,
                                code: product.code || '',
                                selling_price: product.selling_price,
                                category: product.category
                              }}
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <QuickAddProduct 
              onProductAdded={(product) => {
                setShowAddProduct(false);
                toast({
                  title: "Produit ajouté !",
                  description: `${product.name} a été ajouté avec succès`,
                });
              }}
              onClose={() => setShowAddProduct(false)}
            />
          </div>
        </div>
      )}

      {/* Sobraga Brands Modal */}
      {showSobragaBrands && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Marques Sobraga</h2>
                <Button variant="outline" onClick={() => setShowSobragaBrands(false)}>
                  Fermer
                </Button>
              </div>
              <SobragaBrands 
                onProductSelect={(productData) => {
                  // Pré-remplir le formulaire d'ajout avec les données Sobraga
                  setShowSobragaBrands(false);
                  setShowAddProduct(true);
                  // Les données seront pré-remplies dans QuickAddProduct
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}