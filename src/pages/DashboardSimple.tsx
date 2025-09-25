import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { useActivity } from "@/contexts/ActivityContext";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw,
  BarChart3
} from "lucide-react";

export default function DashboardSimple() {
  const { sales, loading: salesLoading } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { employees, loading: employeesLoading } = useEmployees();
  const { currentActivity } = useActivity();
  const { user } = useAuth();
  const { toast } = useToast();

  // Debug: Vérifier le chargement des données
  useEffect(() => {
    console.log('DashboardSimple - user:', user);
    console.log('DashboardSimple - currentActivity:', currentActivity);
    console.log('DashboardSimple - sales:', sales.length);
    console.log('DashboardSimple - products:', products.length);
    console.log('DashboardSimple - employees:', employees.length);
  }, [user, currentActivity, sales, products, employees]);

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

  // Calculs des statistiques
  const todaySales = sales.filter(sale => {
    const saleDate = sale.createdAt.toDate();
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);
  const outOfStockProducts = products.filter(p => p.current_stock === 0);

  const stats = [
    {
      title: "Chiffre d'Affaires Total",
      value: `${totalRevenue.toLocaleString('fr-FR')} FCFA`,
      change: "+12% vs mois dernier",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Revenus totaux"
    },
    {
      title: "Ventes Aujourd'hui",
      value: `${todaySales.length}`,
      change: `${todayRevenue.toLocaleString('fr-FR')} FCFA`,
      changeType: "neutral" as const,
      icon: ShoppingCart,
      description: "Transactions du jour"
    },
    {
      title: "Produits en Stock",
      value: `${products.length}`,
      change: `${lowStockProducts.length} stock faible`,
      changeType: lowStockProducts.length > 0 ? "negative" : "positive",
      icon: Package,
      description: "Inventaire total"
    },
    {
      title: "Personnel Actif",
      value: `${employees.length}`,
      change: "Équipe complète",
      changeType: "positive" as const,
      icon: Users,
      description: "Employés enregistrés"
    }
  ];

  const refreshData = () => {
    toast({
      title: "Données actualisées",
      description: "Le tableau de bord a été mis à jour.",
    });
  };

  if (salesLoading || productsLoading || employeesLoading) {
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
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de Bord - {currentActivity.name}
            </h1>
            <p className="text-muted-foreground">
              Bienvenue {user.email}, voici un aperçu de votre activité
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="card-stats">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center mt-2">
                  <Badge 
                    variant={stat.changeType === "positive" ? "default" : 
                            stat.changeType === "negative" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alertes importantes */}
        {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
          <Card className="card-stats mb-6 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Alertes Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {outOfStockProducts.length > 0 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="font-semibold">{outOfStockProducts.length}</span>
                    <span>produit(s) en rupture de stock</span>
                  </div>
                )}
                {lowStockProducts.length > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <span className="font-semibold">{lowStockProducts.length}</span>
                    <span>produit(s) avec stock faible</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions rapides */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Ventes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gérez vos ventes et point de vente
              </p>
              <Button className="w-full btn-gradient">
                Ouvrir la Caisse
              </Button>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestion de l'inventaire et des produits
              </p>
              <Button className="w-full btn-gradient">
                Gérer le Stock
              </Button>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Personnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Gestion des employés et planning
              </p>
              <Button className="w-full btn-gradient">
                Gérer le Personnel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
