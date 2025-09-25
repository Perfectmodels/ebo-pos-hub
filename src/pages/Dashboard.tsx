import { useState, useMemo } from 'react';
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSales, Sale } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { useUserSetup } from "@/hooks/useUserSetup";
import NewUserWelcome from "@/components/NewUserWelcome";
import GoogleUserSetup from "@/components/GoogleUserSetup";
import RealTimeCharts from "@/components/RealTimeCharts";
import SmartAlerts from "@/components/SmartAlerts";
import RoleBasedDashboard from "@/components/RoleBasedDashboard";
import PDFReports from "@/components/PDFReports";
import ActivitySpecificDashboard from "@/components/ActivitySpecificDashboard";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle, RefreshCw, BarChart3, Bell, FileText, Settings } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from 'react-router-dom';

// --- Data Processing Functions --- //
const getSalesTrendData = (sales: Sale[]) => {
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  return last7Days.map(day => {
    const dayString = day.toLocaleDateString('fr-FR', { weekday: 'short' });
    const dailySales = sales.filter(s => s.createdAt.toDate().toDateString() === day.toDateString());
    const totalRevenue = dailySales.reduce((sum, s) => sum + s.total, 0);
    return { name: dayString, "Chiffre d'Affaires": totalRevenue };
  });
};

const getRevenueGrowthData = (sales: Sale[]) => {
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();

  return last6Months.map(month => {
    const monthString = month.toLocaleDateString('fr-FR', { month: 'short' });
    const monthlySales = sales.filter(s => s.createdAt.toDate().getMonth() === month.getMonth() && s.createdAt.toDate().getFullYear() === month.getFullYear());
    const totalRevenue = monthlySales.reduce((sum, s) => sum + s.total, 0);
    return { name: monthString, Revenu: totalRevenue };
  });
};

// --- Main Component --- //
export default function Dashboard() {
  const navigate = useNavigate();
  const { sales, loading: salesLoading, fetchSales } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { employees, loading: employeesLoading } = useEmployees();
  const { needsSetup, loading: setupLoading, markSetupComplete } = useUserSetup();
  const [activeView, setActiveView] = useState<'overview' | 'charts' | 'alerts' | 'reports' | 'role-based'>('overview');

  const loading = salesLoading || productsLoading || employeesLoading;

  // --- Memos for Performance --- //
  const { todayStats, lowStockProducts, topProducts, recentOrders } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySales = sales.filter(s => s.createdAt.toDate() >= today);
    
    return {
      todayStats: { revenue: todaySales.reduce((sum, s) => sum + s.total, 0), orders: todaySales.length },
      lowStockProducts: products.filter(p => p.current_stock <= p.min_stock),
      topProducts: products.map(p => {
          const productSales = sales.filter(s => s.items.some(i => i.id === p.id));
          return { name: p.name, revenue: productSales.reduce((sum, s) => sum + s.total, 0) };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      recentOrders: sales.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()).slice(0, 5),
    };
  }, [sales, products]);

  const salesTrendData = useMemo(() => getSalesTrendData(sales), [sales]);
  const revenueGrowthData = useMemo(() => getRevenueGrowthData(sales), [sales]);

  // --- Conditional Rendering --- //
  
  // Afficher le setup Google si l'utilisateur a besoin de finaliser sa configuration
  if (setupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de votre profil...</p>
        </div>
      </div>
    );
  }

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <GoogleUserSetup onComplete={markSetupComplete} />
      </div>
    );
  }

  if (!loading && sales.length === 0 && products.length === 0) {
    return <NewUserWelcome onComplete={() => navigate('/products')} />;
  }

  // --- Render --- //
  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchSales()} disabled={loading}>
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`}/>
            Actualiser
          </Button>
          <Button onClick={() => navigate('/ventes')}>
            <ShoppingCart size={16} className="mr-2"/>
            Nouvelle Vente
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        <Button
          variant={activeView === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveView('overview')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Vue d'ensemble
        </Button>
        <Button
          variant={activeView === 'charts' ? 'default' : 'ghost'}
          onClick={() => setActiveView('charts')}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Graphiques Temps Réel
        </Button>
        <Button
          variant={activeView === 'alerts' ? 'default' : 'ghost'}
          onClick={() => setActiveView('alerts')}
          className="flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Alertes Intelligentes
        </Button>
        <Button
          variant={activeView === 'reports' ? 'default' : 'ghost'}
          onClick={() => setActiveView('reports')}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Rapports PDF
        </Button>
        <Button
          variant={activeView === 'role-based' ? 'default' : 'ghost'}
          onClick={() => setActiveView('role-based')}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Tableaux Personnalisés
        </Button>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Chiffre d'Affaires (Jour)" value={`${todayStats.revenue.toLocaleString()} FCFA`} icon={DollarSign} />
            <StatsCard title="Commandes (Jour)" value={todayStats.orders} icon={ShoppingCart} />
            <StatsCard title="Stock Faible" value={lowStockProducts.length} icon={AlertTriangle} changeType={lowStockProducts.length > 0 ? "negative" : "neutral"}/>
            <StatsCard title="Personnel Actif" value={employees.length} icon={Users} />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle>Actions Rapides</CardTitle></CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/ventes')}><ShoppingCart className="mb-1"/>Nouvelle Vente</Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/stock')}><Package className="mb-1"/>Gérer le Stock</Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/rapports')}><TrendingUp className="mb-1"/>Voir Rapports</Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/personnel')}><Users className="mb-1"/>Gérer l'Équipe</Button>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Évolution des Ventes (7 derniers jours)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`}/>
                    <Area type="monotone" dataKey="Chiffre d'Affaires" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Croissance du Revenu (6 derniers mois)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`}/>
                      <Bar dataKey="Revenu" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
           <div className="grid gap-6 md:grid-cols-2">
              <Card>
                  <CardHeader><CardTitle>Dernières Ventes</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                      {recentOrders.map(order => (
                          <div key={order.id} className="flex justify-between items-center p-2 rounded-md border">
                              <div><p className="font-semibold">Vente #{order.id.slice(0, 4)}</p><p className="text-sm text-muted-foreground">{order.createdAt.toDate().toLocaleTimeString('fr-FR')}</p></div>
                              <p className="font-bold text-primary">{order.total.toLocaleString()} FCFA</p>
                          </div>
                      ))}
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Top 5 Produits Performants</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                      {topProducts.map(product => (
                          <div key={product.name} className="flex justify-between items-center p-2 rounded-md border">
                              <p className="font-semibold">{product.name}</p>
                              <p className="font-bold text-green-600">{product.revenue.toLocaleString()} FCFA</p>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </div>
        </>
      )}

      {activeView === 'charts' && <RealTimeCharts />}
      {activeView === 'alerts' && <SmartAlerts />}
      {activeView === 'reports' && <PDFReports />}
      {activeView === 'role-based' && <RoleBasedDashboard />}
      
      {/* Tableau de bord spécifique à l'activité par défaut */}
      {activeView === 'overview' && <ActivitySpecificDashboard />}
    </div>
  );
}
