import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw
} from "lucide-react";

interface RealTimeChartsProps {
  refreshInterval?: number; // en millisecondes
}

export default function RealTimeCharts({ refreshInterval = 30000 }: RealTimeChartsProps) {
  const { sales, fetchSales } = useSales();
  const { products } = useProducts();
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSales();
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchSales]);

  // Données des ventes par heure
  const hourlyData = useMemo(() => {
    const now = new Date();
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now);
      hour.setHours(i, 0, 0, 0);
      return {
        hour: `${i.toString().padStart(2, '0')}:00`,
        sales: 0,
        orders: 0
      };
    });

    sales.forEach(sale => {
      const saleDate = sale.createdAt.toDate();
      const hour = saleDate.getHours();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (saleDate.toDateString() === today.toDateString()) {
        hours[hour].sales += sale.total;
        hours[hour].orders += 1;
      }
    });

    return hours;
  }, [sales]);

  // Données des ventes par jour
  const dailyData = useMemo(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const daySales = sales.filter(sale => {
        const saleDate = sale.createdAt.toDate();
        return saleDate.toDateString() === date.toDateString();
      });

      days.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        sales: daySales.reduce((sum, sale) => sum + sale.total, 0),
        orders: daySales.length,
        day: date.getDate()
      });
    }

    return days;
  }, [sales]);

  // Top produits
  const topProductsData = useMemo(() => {
    const productSales = new Map();
    
    sales.forEach(sale => {
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

    return Array.from(productSales.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [sales, products]);

  // Statistiques en temps réel
  const realTimeStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = sales.filter(sale => {
      const saleDate = sale.createdAt.toDate();
      return saleDate >= today;
    });

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdaySales = sales.filter(sale => {
      const saleDate = sale.createdAt.toDate();
      return saleDate.toDateString() === yesterday.toDateString();
    });

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const yesterdayTotal = yesterdaySales.reduce((sum, sale) => sum + sale.total, 0);
    const growth = yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0;

    return {
      todayTotal,
      todayOrders: todaySales.length,
      growth,
      averageOrder: todaySales.length > 0 ? todayTotal / todaySales.length : 0
    };
  }, [sales]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      {/* Header avec statistiques temps réel */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventes Aujourd'hui</p>
                <p className="text-2xl font-bold">{realTimeStats.todayTotal.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center gap-1">
                {realTimeStats.growth > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${realTimeStats.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(realTimeStats.growth).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Commandes Aujourd'hui</p>
              <p className="text-2xl font-bold">{realTimeStats.todayOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Panier Moyen</p>
              <p className="text-2xl font-bold">{Math.round(realTimeStats.averageOrder).toLocaleString()} FCFA</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dernière MAJ</p>
                <p className="text-sm font-medium">
                  {lastUpdate.toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  fetchSales();
                  setLastUpdate(new Date());
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Temps réel
          </Badge>
        </div>
        <div className="flex gap-2">
          {(['hour', 'day', 'week', 'month'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'hour' && 'Par heure'}
              {range === 'day' && 'Par jour'}
              {range === 'week' && 'Par semaine'}
              {range === 'month' && 'Par mois'}
            </Button>
          ))}
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ventes par heure */}
        {timeRange === 'hour' && (
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Ventes par Heure (Aujourd'hui)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} FCFA`, 
                      name === 'sales' ? 'Ventes' : 'Commandes'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Ventes par jour */}
        {timeRange === 'day' && (
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Ventes des 7 Derniers Jours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} FCFA`, 
                      name === 'sales' ? 'Ventes' : 'Commandes'
                    ]}
                  />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top produits */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Top 5 Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, sales }) => `${name}: ${sales.toLocaleString()} FCFA`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Ventes']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de tendance */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tendance des Ventes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
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
    </div>
  );
}
