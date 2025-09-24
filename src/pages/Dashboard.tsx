import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  Star
} from "lucide-react";

export default function Dashboard() {
  // Mock data - In real app, this would come from Supabase
  const todayStats = {
    revenue: "125,000 FCFA",
    orders: 45,
    products: 156,
    staff: 8
  };

  const recentOrders = [
    { id: "#001", customer: "Client A", amount: "15,000 FCFA", time: "Il y a 5min", status: "Payé" },
    { id: "#002", customer: "Client B", amount: "8,500 FCFA", time: "Il y a 12min", status: "En attente" },
    { id: "#003", customer: "Client C", amount: "22,000 FCFA", time: "Il y a 18min", status: "Payé" }
  ];

  const lowStockProducts = [
    { name: "Coca Cola 33cl", stock: 5, min: 20 },
    { name: "Pain de mie", stock: 2, min: 10 },
    { name: "Huile de palme", stock: 1, min: 5 }
  ];

  const topProducts = [
    { name: "Attiéké-Poisson", sales: 25, revenue: "37,500 FCFA" },
    { name: "Café au lait", sales: 18, revenue: "9,000 FCFA" },
    { name: "Coca Cola", sales: 15, revenue: "7,500 FCFA" }
  ];

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
        <Button className="btn-gradient">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Nouvelle Vente
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Chiffre d'Affaires"
          value={todayStats.revenue}
          change="+12% vs hier"
          changeType="positive"
          icon={DollarSign}
          description="Aujourd'hui"
        />
        <StatsCard
          title="Commandes"
          value={todayStats.orders}
          change="+8 commandes"
          changeType="positive"
          icon={ShoppingCart}
          description="Depuis ce matin"
        />
        <StatsCard
          title="Produits en Stock"
          value={todayStats.products}
          change="3 en rupture"
          changeType="negative"
          icon={Package}
          description="Inventaire actuel"
        />
        <StatsCard
          title="Personnel Actif"
          value={todayStats.staff}
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
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Min: {product.min} unités</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-destructive">{product.stock}</span>
                    <p className="text-xs text-muted-foreground">en stock</p>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} vendus</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
}