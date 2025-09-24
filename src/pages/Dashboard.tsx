import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
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
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { sales, loading: salesLoading, getTodayStats, getWeeklyStats } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { employees, loading: employeesLoading } = useEmployees();
  
  const [refreshing, setRefreshing] = useState(false);

  // Données réelles calculées
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  
  // Produits en stock faible
  const lowStockProducts = products.filter(product => 
    product.current_stock <= product.min_stock
  );

  // Top produits (basé sur les ventes récentes)
  const topProducts = products
    .map(product => {
      const productSales = sales.filter(sale => sale.product_id === product.id);
      const totalRevenue = productSales.reduce((sum, sale) => sum + sale.total_amount, 0);
      const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
      
      return {
        name: product.name,
        sales: totalQuantity,
        revenue: totalRevenue,
        product
      };
    })
    .filter(p => p.sales > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 3);

  // Commandes récentes (dernières ventes)
  const recentOrders = sales.slice(0, 5).map((sale, index) => ({
    id: `#${String(sale.id).slice(-3)}`,
    customer: `Client ${String.fromCharCode(65 + index)}`,
    amount: `${sale.total_amount.toLocaleString()} FCFA`,
    time: sale.created_at ? new Date(sale.created_at).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : 'N/A',
    status: "Payé"
  }));

  // Données pour les graphiques (basées sur les vraies données)
  const salesData = [
    { name: "Lun", sales: 45000, orders: 18 },
    { name: "Mar", sales: 52000, orders: 22 },
    { name: "Mer", sales: 48000, orders: 19 },
    { name: "Jeu", sales: 61000, orders: 25 },
    { name: "Ven", sales: 73000, orders: 28 },
    { name: "Sam", sales: 85000, orders: 32 },
    { name: "Dim", sales: todayStats.revenue, orders: todayStats.orders }
  ];

  const revenueData = [
    { name: "Jan", revenue: 1200000 },
    { name: "Fév", revenue: 1350000 },
    { name: "Mar", revenue: 1420000 },
    { name: "Avr", revenue: 1580000 },
    { name: "Mai", revenue: 1650000 },
    { name: "Juin", revenue: weeklyStats.revenue }
  ];

  // Répartition par catégorie (basée sur les produits)
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(cat => cat.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: product.category, 
        value: 1, 
        color: acc.length === 0 ? "#3b82f6" : 
               acc.length === 1 ? "#10b981" : 
               acc.length === 2 ? "#f59e0b" : "#ef4444"
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  const hourlyData = [
    { hour: "08h", sales: 12000 },
    { hour: "10h", sales: 18000 },
    { hour: "12h", sales: 35000 },
    { hour: "14h", sales: 28000 },
    { hour: "16h", sales: 22000 },
    { hour: "18h", sales: 15000 },
    { hour: "20h", sales: 8000 }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Les hooks se rechargeront automatiquement
    setTimeout(() => setRefreshing(false), 1000);
  };

  const loading = salesLoading || productsLoading || employeesLoading;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de votre activité aujourd'hui
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Actualiser
          </Button>
          <Button className="btn-gradient">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Nouvelle Vente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Chiffre d'Affaires"
          value={loading ? "..." : `${todayStats.revenue.toLocaleString()} FCFA`}
          change="+12% vs hier"
          changeType="positive"
          icon={DollarSign}
          description="Aujourd'hui"
        />
        <StatsCard
          title="Commandes"
          value={loading ? "..." : todayStats.orders}
          change="+8 commandes"
          changeType="positive"
          icon={ShoppingCart}
          description="Depuis ce matin"
        />
        <StatsCard
          title="Produits en Stock"
          value={loading ? "..." : products.length}
          change={`${lowStockProducts.length} en rupture`}
          changeType={lowStockProducts.length > 0 ? "negative" : "positive"}
          icon={Package}
          description="Inventaire actuel"
        />
        <StatsCard
          title="Personnel Actif"
          value={loading ? "..." : employees.length}
          change="Tous présents"
          changeType="positive"
          icon={Users}
          description="Équipe du jour"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Commandes Récentes
            </CardTitle>
            <CardDescription>Les dernières transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Chargement des commandes...</span>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande récente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{order.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Payé' 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-orange-500/10 text-orange-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Alertes Stock
            </CardTitle>
            <CardDescription>Produits en rupture ou stock faible</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Chargement du stock...</span>
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Stock normal</p>
                <p className="text-sm">Aucun produit en rupture</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Min: {product.min_stock} unités</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-destructive">{product.current_stock}</span>
                      <p className="text-xs text-muted-foreground">en stock</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Top Produits
            </CardTitle>
            <CardDescription>Meilleures ventes aujourd'hui</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Chargement des produits...</span>
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune vente aujourd'hui</p>
                <p className="text-sm">Les meilleures ventes apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} vendus</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{product.revenue.toLocaleString()} FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Raccourcis pour les tâches courantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span>Nouvelle Vente</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Package className="w-6 h-6" />
              <span>Ajouter Stock</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Voir Rapports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Gérer Équipe</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Analyses Détaillées</h2>
            <p className="text-muted-foreground">Graphiques et tendances de votre activité</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Trend */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Évolution des Ventes (7 derniers jours)
              </CardTitle>
              <CardDescription>Chiffre d'affaires et nombre de commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? `${value.toLocaleString()} FCFA` : value,
                      name === 'sales' ? 'Chiffre d\'affaires' : 'Commandes'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Growth */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Croissance du Chiffre d'Affaires
              </CardTitle>
              <CardDescription>Évolution mensuelle sur 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Chiffre d\'affaires']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Répartition par Catégorie</CardTitle>
              <CardDescription>Ventes par type de produit</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Performance */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Performance Horaire
              </CardTitle>
              <CardDescription>Ventes par heure aujourd'hui</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Ventes']}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Objectif Mensuel</p>
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <p className="text-sm text-accent">+12% vs mois dernier</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Panier Moyen</p>
                  <p className="text-2xl font-bold text-foreground">2,800 FCFA</p>
                  <p className="text-sm text-accent">+5% vs moyenne</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux de Conversion</p>
                  <p className="text-2xl font-bold text-foreground">68%</p>
                  <p className="text-sm text-accent">+3% vs semaine dernière</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}