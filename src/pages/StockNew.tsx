import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useStockMovements, StockMovement } from "@/hooks/useStockMovements";
import { useToast } from "@/hooks/use-toast";
import { useActivity } from "@/contexts/ActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import ProductManager from "@/components/ProductManager";
import QRScanner from "@/components/QRScanner";
import { 
  Package, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  RefreshCw,
  Warehouse,
  QrCode,
  Plus
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function StockNew() {
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { movements: stockMovements, loading: movementsLoading, fetchMovements } = useStockMovements();
  const { currentActivity } = useActivity();
  const { user } = useAuth();
  const { toast } = useToast();

  // Debug: Vérifier le chargement de l'activité et de l'utilisateur
  useEffect(() => {
    console.log('StockNew - user:', user);
    console.log('StockNew - currentActivity:', currentActivity);
    if (!user) {
      console.warn('StockNew - Aucun utilisateur connecté');
    }
    if (!currentActivity) {
      console.warn('StockNew - Aucune activité chargée');
    }
  }, [user, currentActivity]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'movements' | 'analytics'>('products');

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
    fetchMovements();
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

  // Mouvements récents
  const recentMovements = stockMovements.slice(0, 10);

  // Graphique des mouvements (7 derniers jours)
  const movementsChart = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayMovements = stockMovements.filter(movement => {
      const movementDate = new Date(movement.created_at);
      return movementDate.toDateString() === date.toDateString();
    });
    
    movementsChart.push({
      date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
      entries: dayMovements.filter(m => m.type === 'in').length,
      exits: dayMovements.filter(m => m.type === 'out').length
    });
  }

  if (activeTab === 'products') {
    return <ProductManager />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion du Stock - {currentActivity?.name}
          </h1>
          <p className="text-muted-foreground">
            Surveillez et gérez votre inventaire
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={() => setShowQRScanner(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            Scanner QR
          </Button>
          <Button onClick={() => setActiveTab('products')} className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Gérer Produits
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'movements' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('movements')}
          className="flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Mouvements
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Produits</p>
                <p className="text-3xl font-bold text-blue-600">{stockStats.totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Faible</p>
                <p className="text-3xl font-bold text-orange-600">{stockStats.lowStock}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rupture</p>
                <p className="text-3xl font-bold text-red-600">{stockStats.outOfStock}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valeur Stock</p>
                <p className="text-3xl font-bold text-green-600">
                  {stockStats.totalValue.toLocaleString()} FCFA
                </p>
              </div>
              <Warehouse className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'movements' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mouvements récents */}
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Mouvements Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {movementsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : recentMovements.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun mouvement récent</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{movement.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(movement.created_at).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={movement.type === 'in' ? 'default' : 'destructive'}>
                          {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {movement.reason || 'Mouvement manuel'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertes stock */}
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertes Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-green-600 font-medium">✅ Tous les stocks sont OK</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aucune alerte de stock pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {outOfStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-red-200 rounded bg-red-50">
                      <div>
                        <p className="font-medium text-red-800">{product.name}</p>
                        <p className="text-xs text-red-600">Rupture de stock</p>
                      </div>
                      <Badge variant="destructive">
                        {product.current_stock} / {product.min_stock}
                      </Badge>
                    </div>
                  ))}
                  
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-orange-200 rounded bg-orange-50">
                      <div>
                        <p className="font-medium text-orange-800">{product.name}</p>
                        <p className="text-xs text-orange-600">Stock faible</p>
                      </div>
                      <Badge variant="destructive">
                        {product.current_stock} / {product.min_stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analyse des Mouvements (7 derniers jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={movementsChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="entries" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Entrées"
                />
                <Line 
                  type="monotone" 
                  dataKey="exits" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Sorties"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Scanner QR Modal */}
      {showQRScanner && (
        <QRScanner
          onProductFound={(product) => {
            toast({
              title: "Produit trouvé",
              description: `${product.name} détecté avec succès`,
            });
            setShowQRScanner(false);
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}
