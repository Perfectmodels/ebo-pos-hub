import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Calendar,
  Download,
  Eye,
  BarChart3,
  Users
} from "lucide-react";

export default function Rapports() {
  // Mock data for reports
  const weeklyStats = {
    revenue: "875,000 FCFA",
    orders: 312,
    avgOrder: "2,800 FCFA",
    growth: "+18%"
  };

  const monthlyData = [
    { period: "Semaine 1", revenue: 180000, orders: 65 },
    { period: "Semaine 2", revenue: 220000, orders: 78 },
    { period: "Semaine 3", revenue: 195000, orders: 71 },
    { period: "Semaine 4", revenue: 280000, orders: 98 }
  ];

  const topProducts = [
    { name: "Attiéké-Poisson", quantity: 85, revenue: "127,500 FCFA" },
    { name: "Riz sauce", quantity: 62, revenue: "74,400 FCFA" },
    { name: "Café au lait", quantity: 124, revenue: "62,000 FCFA" },
    { name: "Coca Cola", quantity: 89, revenue: "44,500 FCFA" }
  ];

  const recentReports = [
    { id: 1, name: "Rapport Journalier", date: "2024-01-15", type: "Quotidien", status: "Généré" },
    { id: 2, name: "Analyse Hebdomadaire", date: "2024-01-14", type: "Hebdomadaire", status: "En cours" },
    { id: 3, name: "Bilan Mensuel", date: "2024-01-01", type: "Mensuel", status: "Généré" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports & Statistiques</h1>
          <p className="text-muted-foreground mt-1">
            Analysez vos performances et générez des rapports détaillés
          </p>
        </div>
        <Button className="btn-gradient">
          <Download className="w-4 h-4 mr-2" />
          Générer Rapport
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CA Cette Semaine</p>
                <p className="text-2xl font-bold">{weeklyStats.revenue}</p>
                <p className="text-sm text-accent">{weeklyStats.growth} vs semaine dernière</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold">{weeklyStats.orders}</p>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier Moyen</p>
                <p className="text-2xl font-bold">{weeklyStats.avgOrder}</p>
                <p className="text-sm text-accent">+5% vs moyenne</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employés Actifs</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Ce mois</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Evolution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Évolution Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium">{week.period}</p>
                    <p className="text-sm text-muted-foreground">{week.orders} commandes</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{week.revenue.toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Produits du Mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} vendus</p>
                    </div>
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

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Rapports Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-semibold">Rapport</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 font-medium">{report.name}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{report.type}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{report.date}</td>
                    <td className="py-3">
                      <Badge 
                        className={report.status === 'Généré' ? 'bg-accent text-accent-foreground' : 'bg-orange-500 text-white'}
                      >
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Exporter les Données</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="w-6 h-6" />
              <span>Rapport Journalier PDF</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="w-6 h-6" />
              <span>Données Excel</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Download className="w-6 h-6" />
              <span>Rapport Personnalisé</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}