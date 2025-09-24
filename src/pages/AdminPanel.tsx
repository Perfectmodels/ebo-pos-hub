import { useState, useEffect } from "react";
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
  status: 'active' | 'inactive' | 'suspended';
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
  activityType: string;
  city: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'suspended';
  employeeCount: string;
  businessHours: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Données simulées pour la démo
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 156,
    totalPMEs: 42,
    totalSales: 1250000,
    totalProducts: 89,
    activeUsers: 98,
    newRegistrations: 12,
    revenue: 2500000,
    growth: 15.2
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@restaurant.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      registrationDate: '2024-01-10T08:00:00Z',
      companyName: 'Restaurant Le Bon Goût',
      activityType: 'Restaurant',
      city: 'Yaoundé'
    },
    {
      id: '2',
      name: 'Marie Nguema',
      email: 'marie@snack.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-15T09:15:00Z',
      registrationDate: '2024-01-12T14:30:00Z',
      companyName: 'Snack Express',
      activityType: 'Snack',
      city: 'Douala'
    },
    {
      id: '3',
      name: 'Paul Mballa',
      email: 'paul@bar.com',
      role: 'Vendeur',
      status: 'inactive',
      lastLogin: '2024-01-14T16:45:00Z',
      registrationDate: '2024-01-08T11:20:00Z',
      companyName: 'Bar Le Relax',
      activityType: 'Bar',
      city: 'Yaoundé'
    }
  ]);

  const [pmes, setPMEs] = useState<PME[]>([
    {
      id: '1',
      companyName: 'Restaurant Le Bon Goût',
      contactName: 'Jean Dupont',
      email: 'contact@restaurant.com',
      phone: '+237 6XX XXX XXX',
      activityType: 'Restaurant',
      city: 'Yaoundé',
      registrationDate: '2024-01-10T08:00:00Z',
      status: 'active',
      employeeCount: '6-20',
      businessHours: 'Lun-Sam 08h-22h'
    },
    {
      id: '2',
      companyName: 'Snack Express',
      contactName: 'Marie Nguema',
      email: 'info@snack.com',
      phone: '+237 6XX XXX XXX',
      activityType: 'Snack',
      city: 'Douala',
      registrationDate: '2024-01-12T14:30:00Z',
      status: 'active',
      employeeCount: '1-5',
      businessHours: 'Lun-Dim 06h-20h'
    },
    {
      id: '3',
      companyName: 'Bar Le Relax',
      contactName: 'Paul Mballa',
      email: 'bar@relax.com',
      phone: '+237 6XX XXX XXX',
      activityType: 'Bar',
      city: 'Yaoundé',
      registrationDate: '2024-01-08T11:20:00Z',
      status: 'pending',
      employeeCount: '1-5',
      businessHours: 'Mar-Dim 18h-02h'
    }
  ]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredPMEs = pmes.filter(pme => {
    const matchesSearch = pme.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pme.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pme.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pme.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel Administrateur</h1>
          <p className="text-muted-foreground mt-1">
            Surveillance et gestion de la plateforme Ebo'o Gest
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Utilisateurs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{stats.totalPMEs}</div>
                <div className="text-sm text-muted-foreground">PME Inscrites</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} FCFA</div>
                <div className="text-sm text-muted-foreground">Chiffre d'Affaires</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">+{stats.growth}%</div>
                <div className="text-sm text-muted-foreground">Croissance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="pmes" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            PME
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activité
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Dernières actions sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <UserPlus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouvelle inscription PME</p>
                      <p className="text-xs text-muted-foreground">Restaurant Le Bon Goût - Il y a 2h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nouvel utilisateur</p>
                      <p className="text-xs text-muted-foreground">Jean Dupont - Il y a 4h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Stock faible</p>
                      <p className="text-xs text-muted-foreground">Coca-Cola 33cl - Il y a 6h</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques par Type d'Activité</CardTitle>
                <CardDescription>Répartition des PME par secteur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Restaurants</span>
                    <Badge variant="secondary">15</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Snacks</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bars</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Épiceries</span>
                    <Badge variant="secondary">5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Autres</span>
                    <Badge variant="secondary">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>
                    {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                            {user.companyName && (
                              <div className="text-xs text-muted-foreground">{user.companyName}</div>
                            )}
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
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(user.lastLogin)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(user.registrationDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PMEs Tab */}
        <TabsContent value="pmes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestion des PME</CardTitle>
                  <CardDescription>
                    {filteredPMEs.length} PME trouvée{filteredPMEs.length > 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Activité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPMEs.map((pme) => (
                    <TableRow key={pme.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pme.companyName}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {pme.city}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{pme.contactName}</div>
                          <div className="text-sm text-muted-foreground">{pme.email}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {pme.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{pme.activityType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pme.status)}>
                          {pme.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(pme.registrationDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activité en Temps Réel</CardTitle>
                <CardDescription>Surveillance des actions utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Connexion utilisateur</p>
                      <p className="text-xs text-muted-foreground">Jean Dupont - Il y a 2 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Nouveau produit ajouté</p>
                      <p className="text-xs text-muted-foreground">Coca-Cola 33cl - Il y a 5 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Vente enregistrée</p>
                      <p className="text-xs text-muted-foreground">125,000 FCFA - Il y a 8 min</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertes Système</CardTitle>
                <CardDescription>Notifications et alertes importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Stock faible</p>
                      <p className="text-xs text-muted-foreground">7 produits en rupture</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Erreur de paiement</p>
                      <p className="text-xs text-muted-foreground">Transaction échouée</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Sauvegarde réussie</p>
                      <p className="text-xs text-muted-foreground">Données sauvegardées</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres Système</CardTitle>
              <CardDescription>Configuration de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
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
                      Collecte des données
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
