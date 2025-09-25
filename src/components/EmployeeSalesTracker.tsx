import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
  BarChart3,
  Calendar,
  RefreshCw,
  Download,
  Eye
} from "lucide-react";

interface SalesData {
  employee_id: string;
  employee_name: string;
  date: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  hourly_rate: number;
  products_sold: number;
  top_products: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

interface EmployeeSalesTrackerProps {
  selectedEmployee?: string;
  onEmployeeSelect?: (employeeId: string) => void;
  period?: 'today' | 'week' | 'month';
}

export default function EmployeeSalesTracker({ 
  selectedEmployee,
  onEmployeeSelect,
  period = 'today'
}: EmployeeSalesTrackerProps) {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(period);
  const [loading, setLoading] = useState(false);

  // Données simulées pour la démo
  const mockSalesData: SalesData[] = [
    {
      employee_id: "1",
      employee_name: "Jean Dupont",
      date: "2024-01-15",
      total_sales: 125000,
      total_orders: 45,
      average_order_value: 2778,
      hourly_rate: 15625,
      products_sold: 67,
      top_products: [
        { name: "Coca-Cola 33cl", quantity: 15, revenue: 7500 },
        { name: "Pain de mie", quantity: 8, revenue: 3200 },
        { name: "Café au lait", quantity: 12, revenue: 3600 }
      ]
    },
    {
      employee_id: "2",
      employee_name: "Marie Nguema", 
      date: "2024-01-15",
      total_sales: 89000,
      total_orders: 32,
      average_order_value: 2781,
      hourly_rate: 21190,
      products_sold: 45,
      top_products: [
        { name: "Orangina 50cl", quantity: 10, revenue: 7500 },
        { name: "Attiéké", quantity: 6, revenue: 9000 },
        { name: "Eau minérale", quantity: 8, revenue: 4000 }
      ]
    },
    {
      employee_id: "3",
      employee_name: "Paul Mballa",
      date: "2024-01-15", 
      total_sales: 0,
      total_orders: 0,
      average_order_value: 0,
      hourly_rate: 0,
      products_sold: 0,
      top_products: []
    },
    {
      employee_id: "4",
      employee_name: "Sophie Mbeng",
      date: "2024-01-15",
      total_sales: 45000,
      total_orders: 18,
      average_order_value: 2500,
      hourly_rate: 0,
      products_sold: 23,
      top_products: [
        { name: "Fanta 33cl", quantity: 6, revenue: 3000 },
        { name: "Pain", quantity: 4, revenue: 2000 }
      ]
    }
  ];

  useEffect(() => {
    setSalesData(mockSalesData);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPerformanceColor = (sales: number) => {
    if (sales >= 100000) return 'text-green-600';
    if (sales >= 50000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (sales: number) => {
    if (sales >= 100000) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (sales >= 50000) return { label: 'Bon', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'À améliorer', color: 'bg-red-100 text-red-800' };
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simuler le rafraîchissement
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Simuler l'export
    console.log('Exporting sales data...');
  };

  const totalSales = salesData.reduce((sum, data) => sum + data.total_sales, 0);
  const totalOrders = salesData.reduce((sum, data) => sum + data.total_orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suivi des Ventes par Employé</h2>
          <p className="text-muted-foreground">
            Performance et statistiques de vente en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: typeof selectedPeriod) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {totalSales.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-muted-foreground">Ventes totales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-sm text-muted-foreground">Commandes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {averageOrderValue.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-muted-foreground">Panier moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {salesData.filter(d => d.total_sales > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Employés actifs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance */}
      <div className="grid gap-4">
        {salesData.map((data) => {
          const performance = getPerformanceBadge(data.total_sales);
          return (
            <Card key={data.employee_id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {getInitials(data.employee_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{data.employee_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {data.total_orders} commandes • {data.products_sold} produits vendus
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={performance.color}>
                      {performance.label}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEmployeeSelect?.(data.employee_id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getPerformanceColor(data.total_sales)}`}>
                      {data.total_sales.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-muted-foreground">Ventes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.average_order_value.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-muted-foreground">Panier moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {data.hourly_rate.toLocaleString()} FCFA/h
                    </div>
                    <div className="text-sm text-muted-foreground">Taux horaire</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.total_orders}
                    </div>
                    <div className="text-sm text-muted-foreground">Commandes</div>
                  </div>
                </div>

                {/* Top Products */}
                {data.top_products.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Produits les plus vendus</h4>
                    <div className="grid gap-2">
                      {data.top_products.slice(0, 3).map((product, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{product.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {product.quantity} × {product.revenue.toLocaleString()} FCFA
                            </span>
                            <Badge variant="outline">
                              {product.revenue.toLocaleString()} FCFA
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Évolution des Performances
          </CardTitle>
          <CardDescription>
            Graphique des ventes par employé sur la période sélectionnée
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Graphique des performances</p>
              <p className="text-sm">Les données de performance seront affichées ici</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
