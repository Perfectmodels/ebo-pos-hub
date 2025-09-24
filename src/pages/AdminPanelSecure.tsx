import { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  UserPlus,
  Building,
  MapPin,
  Phone,
  Calendar,
  Star,
  Zap
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalPMEs: number;
  totalSales: number;
  totalProducts: number;
  activeUsers: number;
  newRegistrations: number;
  revenue: number;
  growth: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  registrationDate: string;
  companyName?: string;
  activityType?: string;
  city?: string;
}

interface PME {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  activityType: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  employeeCount: string;
  businessHours: string;
}

export default function AdminPanelSecure() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('admin_authenticated') === 'true';
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (isAuth && loginTime) {
        // Vérifier si la session n'a pas expiré (24h)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          // Session expirée
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_login_time');
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
  };

  // Données vides - aucune donnée de test
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPMEs: 0,
    totalSales: 0,
    totalProducts: 0,
    activeUsers: 0,
    newRegistrations: 0,
    revenue: 0,
    growth: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [pmes, setPMEs] = useState<PME[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Manager':
        return 'bg-blue-100 text-blue-800';
      case 'Vendeur':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Afficher l'authentification si pas connecté
  if (!isAuthenticated) {
    return <AdminAuth onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec bouton de déconnexion */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Panel Administrateur
          </h1>
          <p className="text-muted-foreground">
            Gestion centralisée de la plateforme Ebo'o Gest
          </p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <Shield className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newRegistrations} nouveaux ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMEs Actives</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPMEs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} utilisateurs actifs
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              +{stats.growth}% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              En stock dans toutes les PMEs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de gestion */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="pmes">PMEs</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-stats">
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Dernières actions sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune activité récente</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Les actions des utilisateurs apparaîtront ici
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-stats">
              <CardHeader>
                <CardTitle>Alertes Système</CardTitle>
                <CardDescription>Notifications importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Système opérationnel</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aucune alerte en cours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>Liste de tous les utilisateurs de la plateforme</CardDescription>
                </div>
                <Button className="btn-gradient">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun utilisateur</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucun utilisateur n'est encore inscrit sur la plateforme
                  </p>
                  <Button className="btn-gradient">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Ajouter le premier utilisateur
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pmes" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestion des PMEs</CardTitle>
                  <CardDescription>Liste de toutes les entreprises inscrites</CardDescription>
                </div>
                <Button className="btn-gradient">
                  <Building className="w-4 h-4 mr-2" />
                  Nouvelle PME
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pmes.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune PME inscrite</h3>
                  <p className="text-muted-foreground mb-4">
                    Aucune entreprise ne s'est encore inscrite sur la plateforme
                  </p>
                  <Button className="btn-gradient">
                    <Building className="w-4 h-4 mr-2" />
                    Ajouter la première PME
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pmes.map((pme) => (
                    <Card key={pme.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{pme.companyName}</h3>
                          <Badge className={getStatusColor(pme.status)}>
                            {pme.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{pme.contactName}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{pme.city}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          <span>{pme.activityType}</span>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>Configuration générale de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="maintenance">Mode Maintenance</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="maintenance" />
                    <span className="text-sm text-muted-foreground">
                      Activer le mode maintenance
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notifications">Notifications Email</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="notifications" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Activer les notifications
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="backup">Sauvegarde Automatique</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="backup" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Sauvegarde quotidienne
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="analytics">Analytics</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" id="analytics" defaultChecked />
                    <span className="text-sm text-muted-foreground">
                      Collecte de données d'usage
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
