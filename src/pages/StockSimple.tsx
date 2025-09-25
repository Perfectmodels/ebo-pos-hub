import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useActivity } from "@/contexts/ActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  RefreshCw,
  Plus
} from "lucide-react";

export default function StockSimple() {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { currentActivity } = useActivity();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");

  // Debug: Vérifier le chargement de l'activité et de l'utilisateur
  useEffect(() => {
    console.log('StockSimple - user:', user);
    console.log('StockSimple - currentActivity:', currentActivity);
    if (!user) {
      console.warn('StockSimple - Aucun utilisateur connecté');
    }
    if (!currentActivity) {
      console.warn('StockSimple - Aucune activité chargée');
    }
  }, [user, currentActivity]);

  // Vérification de sécurité - afficher un état de chargement si pas d'utilisateur ou d'activité
  if (!user || !currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-muted rounded mb-6 w-1/2"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rafraîchir les données
  const refreshData = () => {
    fetchProducts();
    toast({
      title: "Données actualisées",
      description: "Les informations de stock ont été mises à jour.",
    });
  };

  // Produits avec stock faible
  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);
  
  // Produits en rupture de stock
  const outOfStockProducts = products.filter(p => p.current_stock === 0);

  // Statistiques du stock
  const stockStats = {
    totalProducts: products.length,
    lowStock: lowStockProducts.length,
    outOfStock: outOfStockProducts.length,
    totalValue: products.reduce((sum, p) => sum + (p.current_stock * p.price), 0)
  };

  // Produits filtrés
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-bg p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
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
            <h1 className="text-3xl font-bold text-foreground">Gestion du Stock</h1>
            <p className="text-muted-foreground">
              Gérez votre inventaire pour votre activité {currentActivity.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un Produit
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="card-stats">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockStats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produits en stock
              </p>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockStats.totalValue.toLocaleString('fr-FR')} FCFA
              </div>
              <p className="text-xs text-muted-foreground">
                Valeur du stock
              </p>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Faible</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stockStats.lowStock}</div>
              <p className="text-xs text-muted-foreground">
                Attention requise
              </p>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rupture</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stockStats.outOfStock}</div>
              <p className="text-xs text-muted-foreground">
                Produits épuisés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recherche */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Rechercher des Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des Produits */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle>Inventaire des Produits</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun produit trouvé" : "Aucun produit en stock"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                      <Badge 
                        variant={
                          product.current_stock === 0 ? "destructive" :
                          product.current_stock <= product.min_stock ? "secondary" :
                          "default"
                        }
                      >
                        {product.current_stock === 0 ? "Rupture" :
                         product.current_stock <= product.min_stock ? "Stock faible" :
                         "En stock"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Prix:</span>
                          <span className="font-semibold">{product.price.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Stock actuel:</span>
                          <span className="font-semibold">{product.current_stock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Stock minimum:</span>
                          <span className="font-semibold">{product.min_stock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Catégorie:</span>
                          <span className="font-semibold">{product.category}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
