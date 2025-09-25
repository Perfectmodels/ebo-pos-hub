import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { useActivity } from "@/contexts/ActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  Star,
  Award,
  ChefHat,
  Coffee,
  Wine,
  Pizza,
  ShoppingBag,
  Utensils
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function ActivitySpecificDashboard() {
  const { currentActivity } = useActivity();
  const { user } = useAuth();
  const { sales, fetchSales } = useSales();
  const { products } = useProducts();
  const { employees } = useEmployees();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSales();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSales]);

  // Calculer les statistiques spécifiques à l'activité
  const activityStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = sales.filter(sale => {
      const saleDate = sale.createdAt.toDate();
      return saleDate >= today;
    });

    const totalTodaySales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayOrders = todaySales.length;
    const averageOrder = todayOrders > 0 ? totalTodaySales / todayOrders : 0;

    // Produits spécifiques à l'activité
    const activityProducts = products.filter(product => 
      currentActivity?.defaultSettings?.categories?.includes(product.category) ||
      currentActivity?.defaultSettings?.menuCategories?.includes(product.category) ||
      currentActivity?.defaultSettings?.drinkCategories?.includes(product.category) ||
      currentActivity?.defaultSettings?.productCategories?.includes(product.category)
    );

    // Top produits de l'activité
    const productSales = new Map();
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        const product = activityProducts.find(p => p.id === item.id);
        if (product) {
          const current = productSales.get(product.name) || { name: product.name, sales: 0, quantity: 0 };
          current.sales += item.price * item.quantity;
          current.quantity += item.quantity;
          productSales.set(product.name, current);
        }
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Alertes stock spécifiques
    const lowStockProducts = activityProducts.filter(p => p.current_stock <= p.min_stock);

    // Performance employés
    const employeePerformance = employees.map(emp => {
      const empSales = todaySales.filter(sale => sale.employee_id === emp.id);
      const empTotal = empSales.reduce((sum, sale) => sum + sale.total, 0);
      return {
        name: emp.full_name,
        role: emp.role,
        sales: empTotal,
        orders: empSales.length,
        average: empSales.length > 0 ? empTotal / empSales.length : 0
      };
    }).sort((a, b) => b.sales - a.sales);

    // Tendance des ventes (7 derniers jours)
    const salesTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const daySales = sales.filter(sale => {
        const saleDate = sale.createdAt.toDate();
        return saleDate.toDateString() === date.toDateString();
      });

      salesTrend.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        sales: daySales.reduce((sum, sale) => sum + sale.total, 0),
        orders: daySales.length
      });
    }

    return {
      totalTodaySales,
      todayOrders,
      averageOrder,
      topProducts,
      lowStockProducts,
      employeePerformance,
      salesTrend,
      activityProducts: activityProducts.length
    };
  }, [sales, products, employees, currentActivity]);

  // Obtenir l'icône de l'activité
  const getActivityIcon = () => {
    switch (currentActivity?.id) {
      case 'restaurant': return <Utensils className="w-8 h-8" />;
      case 'bar': return <Wine className="w-8 h-8" />;
      case 'cafe': return <Coffee className="w-8 h-8" />;
      case 'snack': return <Pizza className="w-8 h-8" />;
      case 'commerce': return <ShoppingBag className="w-8 h-8" />;
      case 'epicerie': return <ShoppingBag className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };

  // Couleurs pour les graphiques
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      {/* Header avec informations de l'activité */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {getActivityIcon()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de Bord - {currentActivity?.name}
            </h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre activité • Dernière MAJ: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Temps réel
        </Badge>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'Affaires</p>
                <p className="text-3xl font-bold text-green-600">
                  {activityStats.totalTodaySales.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-3xl font-bold text-blue-600">
                  {activityStats.todayOrders}
                </p>
                <p className="text-xs text-muted-foreground">Aujourd'hui</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier Moyen</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.round(activityStats.averageOrder).toLocaleString()} FCFA
                </p>
                <p className="text-xs text-muted-foreground">Par commande</p>
              </div>
              <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produits en Stock</p>
                <p className="text-3xl font-bold text-orange-600">
                  {activityStats.activityProducts}
                </p>
                <p className="text-xs text-muted-foreground">Disponibles</p>
              </div>
              <Package className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tendance des ventes */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendance des Ventes (7 jours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityStats.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Ventes']} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top produits de l'activité */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top 5 Produits {currentActivity?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityStats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {activityStats.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.quantity} unités vendues</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {product.sales.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune vente aujourd'hui</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertes et performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alertes stock */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertes Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityStats.lowStockProducts.length === 0 ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">✅ Stock OK</p>
                <p className="text-xs text-muted-foreground">Tous les produits sont disponibles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activityStats.lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 border border-orange-200 rounded bg-orange-50">
                    <span className="font-medium text-sm">{product.name}</span>
                    <Badge variant="destructive" className="text-xs">
                      {product.current_stock}/{product.min_stock}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance employés */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Performance Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityStats.employeePerformance.length > 0 ? (
              <div className="space-y-3">
                {activityStats.employeePerformance.slice(0, 3).map((emp, index) => (
                  <div key={emp.name} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
                        #{index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{emp.sales.toLocaleString()} FCFA</p>
                      <p className="text-xs text-muted-foreground">{emp.orders} commandes</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Aucun employé actif</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques rapides */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Statistiques Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Employés actifs</span>
                <span className="font-semibold">{employees.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Produits en catalogue</span>
                <span className="font-semibold">{activityStats.activityProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stock faible</span>
                <span className="font-semibold text-orange-600">{activityStats.lowStockProducts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Heure de pointe</span>
                <span className="font-semibold">12h-14h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides spécifiques à l'activité */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle>Actions Rapides - {currentActivity?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="outline" className="h-16 flex-col" onClick={() => window.location.href = '/ventes'}>
              <ShoppingCart className="mb-1" />
              Nouvelle Vente
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => window.location.href = '/stock'}>
              <Package className="mb-1" />
              Gérer Stock
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => window.location.href = '/personnel'}>
              <Users className="mb-1" />
              Personnel
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => window.location.href = '/rapports'}>
              <TrendingUp className="mb-1" />
              Rapports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
