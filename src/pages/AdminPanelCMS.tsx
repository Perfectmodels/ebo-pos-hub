import { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Zap,
  MessageSquare,
  FileText,
  Globe,
  Palette,
  Save,
  Plus,
  X,
  Send,
  Archive,
  UserCheck,
  Timer,
  Lock,
  Unlock
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
  supportMessages: number;
  pendingApprovals: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastLogin: string;
  registrationDate: string;
  companyName?: string;
  activityType?: string;
  city?: string;
  accessDuration?: number; // en jours
  accessExpiry?: string;
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
  status: 'active' | 'pending' | 'suspended' | 'approved';
  employeeCount: string;
  businessHours: string;
  documents?: string[];
}

interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  lastModified: string;
  status: 'draft' | 'published';
}

export default function AdminPanelCMS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // États pour les modals
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreatePME, setShowCreatePME] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditPME, setShowEditPME] = useState(false);
  const [showReplyMessage, setShowReplyMessage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('admin_authenticated') === 'true';
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (isAuth && loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
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
    growth: 0,
    supportMessages: 0,
    pendingApprovals: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [pmes, setPMEs] = useState<PME[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [pageContents, setPageContents] = useState<PageContent[]>([]);

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
            Panel Administrateur CMS
          </h1>
          <p className="text-muted-foreground">
            Gestion complète de la plateforme Ebo'o Gest
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
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMEs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPMEs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApprovals} en attente
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Support</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.supportMessages}</div>
            <p className="text-xs text-muted-foreground">
              Nouveaux messages
            </p>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages CMS</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageContents.length}</div>
            <p className="text-xs text-muted-foreground">
              Pages publiées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de gestion */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="pmes">PMEs</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="cms">CMS</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
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

        {/* Gestion des Utilisateurs */}
        <TabsContent value="users" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestion des Utilisateurs</CardTitle>
                  <CardDescription>Créez et gérez les comptes utilisateurs</CardDescription>
                </div>
                <Button className="btn-gradient" onClick={() => setShowCreateUser(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Créer un utilisateur
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
                  <Button className="btn-gradient" onClick={() => setShowCreateUser(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Créer le premier utilisateur
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Accès</TableHead>
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
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {user.accessDuration ? `${user.accessDuration} jours` : 'Illimité'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedItem(user);
                              setShowEditUser(true);
                            }}>
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

        {/* Gestion des PMEs */}
        <TabsContent value="pmes" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestion des PMEs</CardTitle>
                  <CardDescription>Approuvez et gérez les entreprises inscrites</CardDescription>
                </div>
                <Button className="btn-gradient" onClick={() => setShowCreatePME(true)}>
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
                  <Button className="btn-gradient" onClick={() => setShowCreatePME(true)}>
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
                          <Badge variant={pme.status === 'approved' ? 'default' : 'secondary'}>
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
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                            setSelectedItem(pme);
                            setShowEditPME(true);
                          }}>
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

        {/* Support Technique */}
        <TabsContent value="support" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <CardTitle>Messages de Support</CardTitle>
              <CardDescription>Gérez les demandes d'aide des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              {supportMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucun message</h3>
                  <p className="text-muted-foreground">
                    Aucun message de support reçu pour le moment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportMessages.map((message) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{message.subject}</h4>
                            <Badge variant={message.priority === 'high' ? 'destructive' : 'secondary'}>
                              {message.priority}
                            </Badge>
                            <Badge variant={message.status === 'new' ? 'default' : 'outline'}>
                              {message.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            De: {message.name} ({message.email})
                          </p>
                          <p className="text-sm mb-2">{message.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedItem(message);
                            setShowReplyMessage(true);
                          }}>
                            <Send className="w-4 h-4 mr-1" />
                            Répondre
                          </Button>
                          <Button variant="outline" size="sm">
                            <Archive className="w-4 h-4" />
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

        {/* CMS - Gestion de Contenu */}
        <TabsContent value="cms" className="space-y-4">
          <Card className="card-stats">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestion de Contenu</CardTitle>
                  <CardDescription>Modifiez le contenu des pages du site</CardDescription>
                </div>
                <Button className="btn-gradient" onClick={() => setShowEditPage(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pageContents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune page</h3>
                  <p className="text-muted-foreground mb-4">
                    Créez votre première page de contenu
                  </p>
                  <Button className="btn-gradient" onClick={() => setShowEditPage(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une page
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageContents.map((page) => (
                    <Card key={page.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{page.title}</h4>
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                              {page.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Slug: /{page.slug}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Modifié: {new Date(page.lastModified).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedItem(page);
                            setShowEditPage(true);
                          }}>
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="outline" size="sm">
                            <Globe className="w-4 h-4 mr-1" />
                            Voir
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

        {/* Paramètres */}
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

      {/* Modal Création Utilisateur */}
      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel utilisateur à la plateforme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-name">Nom complet</Label>
                <Input id="user-name" placeholder="Jean Dupont" />
              </div>
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="jean@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-role">Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-duration">Durée d'accès (jours)</Label>
                <Input id="user-duration" type="number" placeholder="30" />
              </div>
            </div>
            <div>
              <Label htmlFor="user-company">Entreprise</Label>
              <Input id="user-company" placeholder="Nom de l'entreprise" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient">
              <UserPlus className="w-4 h-4 mr-2" />
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Création PME */}
      <Dialog open={showCreatePME} onOpenChange={setShowCreatePME}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle PME</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle entreprise sur la plateforme
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pme-name">Nom de l'entreprise</Label>
                <Input id="pme-name" placeholder="Restaurant Le Bon Goût" />
              </div>
              <div>
                <Label htmlFor="pme-contact">Contact principal</Label>
                <Input id="pme-contact" placeholder="Jean Dupont" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pme-email">Email</Label>
                <Input id="pme-email" type="email" placeholder="contact@restaurant.com" />
              </div>
              <div>
                <Label htmlFor="pme-phone">Téléphone</Label>
                <Input id="pme-phone" placeholder="+237 6 12 34 56 78" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pme-city">Ville</Label>
                <Input id="pme-city" placeholder="Yaoundé" />
              </div>
              <div>
                <Label htmlFor="pme-activity">Type d'activité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="epicerie">Épicerie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePME(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient">
              <Building className="w-4 h-4 mr-2" />
              Ajouter la PME
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Réponse Support */}
      <Dialog open={showReplyMessage} onOpenChange={setShowReplyMessage}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Répondre au message</DialogTitle>
            <DialogDescription>
              Envoyez une réponse au message de support
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reply-subject">Sujet</Label>
              <Input id="reply-subject" placeholder="Re: Votre demande" />
            </div>
            <div>
              <Label htmlFor="reply-message">Message</Label>
              <Textarea 
                id="reply-message" 
                placeholder="Votre réponse..." 
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyMessage(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient">
              <Send className="w-4 h-4 mr-2" />
              Envoyer la réponse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Édition Page CMS */}
      <Dialog open={showEditPage} onOpenChange={setShowEditPage}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Éditer la page</DialogTitle>
            <DialogDescription>
              Modifiez le contenu de la page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page-title">Titre de la page</Label>
                <Input id="page-title" placeholder="Titre de la page" />
              </div>
              <div>
                <Label htmlFor="page-slug">Slug (URL)</Label>
                <Input id="page-slug" placeholder="ma-page" />
              </div>
            </div>
            <div>
              <Label htmlFor="page-description">Description meta</Label>
              <Input id="page-description" placeholder="Description pour le SEO" />
            </div>
            <div>
              <Label htmlFor="page-content">Contenu</Label>
              <Textarea 
                id="page-content" 
                placeholder="Contenu de la page..." 
                rows={10}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="page-published" />
              <Label htmlFor="page-published">Publier la page</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPage(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
