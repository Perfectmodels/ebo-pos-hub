import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  Target,
  Star,
  Award,
  Settings,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  component: string;
  size: 'small' | 'medium' | 'large';
  permissions: string[];
  category: 'sales' | 'inventory' | 'staff' | 'analytics';
}

interface RoleDashboard {
  role: string;
  widgets: DashboardWidget[];
  layout: 'grid' | 'list' | 'custom';
  refreshInterval: number;
}

export default function RoleBasedDashboard() {
  const { user } = useAuth();
  const { sales, fetchSales } = useSales();
  const { products } = useProducts();
  const { employees } = useEmployees();
  const [selectedRole, setSelectedRole] = useState('manager');
  const [customLayout, setCustomLayout] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Widgets disponibles
  const availableWidgets: DashboardWidget[] = [
    {
      id: 'sales-overview',
      title: 'Aperçu des Ventes',
      description: 'Vue d\'ensemble des ventes du jour',
      component: 'SalesOverview',
      size: 'large',
      permissions: ['view_sales'],
      category: 'sales'
    },
    {
      id: 'top-products',
      title: 'Top Produits',
      description: 'Produits les plus vendus',
      component: 'TopProducts',
      size: 'medium',
      permissions: ['view_sales', 'view_products'],
      category: 'sales'
    },
    {
      id: 'employee-performance',
      title: 'Performance Employés',
      description: 'Performance individuelle des employés',
      component: 'EmployeePerformance',
      size: 'large',
      permissions: ['view_reports', 'manage_employees'],
      category: 'staff'
    },
    {
      id: 'inventory-alerts',
      title: 'Alertes Stock',
      description: 'Produits en rupture ou stock faible',
      component: 'InventoryAlerts',
      size: 'medium',
      permissions: ['manage_stock', 'view_products'],
      category: 'inventory'
    },
    {
      id: 'sales-trend',
      title: 'Tendance des Ventes',
      description: 'Graphique d\'évolution des ventes',
      component: 'SalesTrend',
      size: 'large',
      permissions: ['view_sales', 'view_reports'],
      category: 'analytics'
    },
    {
      id: 'daily-goals',
      title: 'Objectifs Quotidiens',
      description: 'Progression vers les objectifs du jour',
      component: 'DailyGoals',
      size: 'medium',
      permissions: ['view_reports'],
      category: 'analytics'
    },
    {
      id: 'recent-orders',
      title: 'Commandes Récentes',
      description: 'Dernières commandes enregistrées',
      component: 'RecentOrders',
      size: 'medium',
      permissions: ['view_sales'],
      category: 'sales'
    },
    {
      id: 'staff-schedule',
      title: 'Planning Personnel',
      description: 'Planning et présence du personnel',
      component: 'StaffSchedule',
      size: 'medium',
      permissions: ['manage_employees', 'view_schedule'],
      category: 'staff'
    }
  ];

  // Dashboards par rôle
  const roleDashboards: Record<string, RoleDashboard> = {
    manager: {
      role: 'Manager',
      layout: 'grid',
      refreshInterval: 30000,
      widgets: availableWidgets.filter(w => 
        ['view_sales', 'view_reports', 'manage_employees', 'manage_stock', 'view_products'].some(p => 
          w.permissions.includes(p)
        )
      )
    },
    caissier: {
      role: 'Caissier',
      layout: 'grid',
      refreshInterval: 15000,
      widgets: availableWidgets.filter(w => 
        ['view_sales', 'process_payment', 'view_products'].some(p => 
          w.permissions.includes(p)
        )
      )
    },
    serveur: {
      role: 'Serveur',
      layout: 'list',
      refreshInterval: 20000,
      widgets: availableWidgets.filter(w => 
        ['view_sales', 'add_sale', 'view_menu', 'manage_tables'].some(p => 
          w.permissions.includes(p)
        )
      )
    },
    cuisinier: {
      role: 'Cuisinier',
      layout: 'list',
      refreshInterval: 30000,
      widgets: availableWidgets.filter(w => 
        ['view_orders', 'manage_stock'].some(p => 
          w.permissions.includes(p)
        )
      )
    }
  };

  const currentDashboard = roleDashboards[selectedRole] || roleDashboards.manager;

  // Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSales();
      setLastRefresh(new Date());
    }, currentDashboard.refreshInterval);

    return () => clearInterval(interval);
  }, [currentDashboard.refreshInterval, fetchSales]);

  // Calculer les données pour les widgets
  const widgetData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = sales.filter(sale => {
      const saleDate = sale.createdAt.toDate();
      return saleDate >= today;
    });

    const totalTodaySales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const todayOrders = todaySales.length;
    const averageOrder = todayOrders > 0 ? totalTodaySales / todayOrders : 0;

    // Top produits
    const productSales = new Map();
    todaySales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
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

    // Alertes stock
    const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);

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
      salesOverview: {
        totalSales: totalTodaySales,
        totalOrders: todayOrders,
        averageOrder: averageOrder
      },
      topProducts,
      lowStockProducts,
      employeePerformance,
      salesTrend,
      recentOrders: todaySales.slice(0, 5)
    };
  }, [sales, products, employees]);

  // Composant SalesOverview
  const SalesOverviewWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Aperçu des Ventes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Ventes</p>
            <p className="text-2xl font-bold text-green-600">
              {widgetData.salesOverview.totalSales.toLocaleString()} FCFA
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Commandes</p>
            <p className="text-2xl font-bold text-blue-600">
              {widgetData.salesOverview.totalOrders}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Panier Moyen</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(widgetData.salesOverview.averageOrder).toLocaleString()} FCFA
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Composant TopProducts
  const TopProductsWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Top Produits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {widgetData.topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{product.sales.toLocaleString()} FCFA</p>
                <p className="text-xs text-muted-foreground">{product.quantity} unités</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Composant EmployeePerformance
  const EmployeePerformanceWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Performance Employés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {widgetData.employeePerformance.slice(0, 5).map((emp, index) => (
            <div key={emp.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant={index === 0 ? 'default' : 'secondary'}>
                  #{index + 1}
                </Badge>
                <div>
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{emp.sales.toLocaleString()} FCFA</p>
                <p className="text-xs text-muted-foreground">{emp.orders} commandes</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Composant InventoryAlerts
  const InventoryAlertsWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Alertes Stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        {widgetData.lowStockProducts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">✅ Tous les stocks sont OK</p>
          </div>
        ) : (
          <div className="space-y-2">
            {widgetData.lowStockProducts.slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center justify-between p-2 border border-orange-200 rounded bg-orange-50">
                <span className="font-medium">{product.name}</span>
                <Badge variant="destructive">
                  {product.current_stock}/{product.min_stock}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Composant SalesTrend
  const SalesTrendWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Tendance des Ventes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={widgetData.salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Ventes']} />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  // Composant DailyGoals
  const DailyGoalsWidget = () => {
    const goal = 500000; // Objectif quotidien en FCFA
    const progress = (widgetData.salesOverview.totalSales / goal) * 100;
    
    return (
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Objectifs Quotidiens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Objectif Ventes</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {widgetData.salesOverview.totalSales.toLocaleString()} / {goal.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Composant RecentOrders
  const RecentOrdersWidget = () => (
    <Card className="card-stats">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Commandes Récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {widgetData.recentOrders.map((order, index) => (
            <div key={order.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium">{order.total.toLocaleString()} FCFA</p>
                <p className="text-xs text-muted-foreground">
                  {order.createdAt.toDate().toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <Badge variant="outline">{order.items.length} articles</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Rendu des widgets
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.component) {
      case 'SalesOverview':
        return <SalesOverviewWidget />;
      case 'TopProducts':
        return <TopProductsWidget />;
      case 'EmployeePerformance':
        return <EmployeePerformanceWidget />;
      case 'InventoryAlerts':
        return <InventoryAlertsWidget />;
      case 'SalesTrend':
        return <SalesTrendWidget />;
      case 'DailyGoals':
        return <DailyGoalsWidget />;
      case 'RecentOrders':
        return <RecentOrdersWidget />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Tableau de Bord Personnalisé
          </h2>
          <p className="text-muted-foreground">
            Interface adaptée au rôle: {currentDashboard.role}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              fetchSales();
              setLastRefresh(new Date());
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="caissier">Caissier</SelectItem>
              <SelectItem value="serveur">Serveur</SelectItem>
              <SelectItem value="cuisinier">Cuisinier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Info de rafraîchissement */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}
        </p>
        <p className="text-sm text-muted-foreground">
          Rafraîchissement automatique: {currentDashboard.refreshInterval / 1000}s
        </p>
      </div>

      {/* Widgets */}
      <div className={`grid gap-6 ${
        currentDashboard.layout === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {currentDashboard.widgets.map(widget => (
          <div key={widget.id} className={widget.size === 'large' ? 'md:col-span-2' : ''}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {/* Widgets disponibles pour personnalisation */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Widgets Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {availableWidgets.map(widget => (
              <div key={widget.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{widget.title}</h4>
                  <Badge variant="outline">{widget.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {widget.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {widget.permissions.map(permission => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
