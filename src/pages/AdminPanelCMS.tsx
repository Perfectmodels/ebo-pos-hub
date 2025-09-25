import { useState, useEffect } from "react";
import AdminAuth from "@/components/AdminAuth";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit } from "firebase/firestore";
import { firestore } from "@/config/firebase";
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
  lastLogin?: string;
  registrationDate?: string;
  joinDate?: string;
  lastActive?: string;
  companyName?: string;
  company?: string;
  activityType?: string;
  city?: string;
  accessDuration?: number; // en jours
  duration?: string;
  accessExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PME {
  id: string;
  companyName: string;
  businessName?: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  activityType: string;
  businessType?: string;
  registrationDate?: string;
  joinDate?: string;
  status: 'active' | 'pending' | 'suspended' | 'approved';
  employeeCount: string;
  businessHours: string;
  revenue?: number;
  productsCount?: number;
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
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
          fetchAllData(); // Charger les données quand authentifié
        } else {
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_login_time');
        }
      }
    };
    
    checkAuth();
  }, []);

  // Fonction pour récupérer toutes les données
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Récupérer les utilisateurs
      const usersSnapshot = await getDocs(collection(firestore, "users"));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);

      // Récupérer les PME (businesses)
      const businessesSnapshot = await getDocs(collection(firestore, "businesses"));
      const businessesData = businessesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PME[];
      setPMEs(businessesData);

      // Récupérer les messages de support (simulation pour l'instant)
      setSupportMessages([]);

      // Récupérer le contenu des pages (simulation pour l'instant)
      setPageContents([]);

      // Calculer les statistiques
      calculateStats(usersData, businessesData);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (usersData: User[], businessesData: PME[]) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const activeUsers = usersData.filter(user => user.status === 'active').length;
    const newRegistrations = usersData.filter(user => 
      new Date(user.joinDate || user.registrationDate || '') > lastMonth
    ).length;
    
    const totalRevenue = businessesData.reduce((sum, business) => 
      sum + (business.revenue || 0), 0
    );
    
    const totalProducts = businessesData.reduce((sum, business) => 
      sum + (business.productsCount || 0), 0
    );

    setStats({
      totalUsers: usersData.length,
      totalPMEs: businessesData.length,
      totalSales: 0, // À calculer depuis les ventes
      totalProducts,
      activeUsers,
      newRegistrations,
      revenue: totalRevenue,
      growth: newRegistrations > 0 ? ((newRegistrations / usersData.length) * 100) : 0,
      supportMessages: 0,
      pendingApprovals: usersData.filter(user => user.status === 'pending').length
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
  };

  // Fonction pour créer un utilisateur
  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      // Créer l'utilisateur dans Firebase
      const userData = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role || 'user',
        status: 'active',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        company: userForm.company || '',
        duration: userForm.duration || '30',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Ajouter l'utilisateur à Firestore
      await addDoc(collection(firestore, "users"), userData);
      
      alert('Utilisateur créé avec succès !');
      setShowCreateUser(false);
      resetUserForm();
      
      // Recharger les données
      await fetchAllData();
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      alert('Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer une PME
  const handleCreatePME = async () => {
    if (!pmeForm.name || !pmeForm.contact || !pmeForm.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      // Créer la PME dans Firebase
      const pmeData = {
        businessName: pmeForm.name,
        contactName: pmeForm.contact,
        email: pmeForm.email,
        phone: pmeForm.phone || '',
        city: pmeForm.city || '',
        businessType: pmeForm.activity || '',
        status: 'active',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        revenue: 0,
        productsCount: 0,
        employeeCount: '1',
        businessHours: '8h-18h',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Ajouter la PME à Firestore
      await addDoc(collection(firestore, "businesses"), pmeData);
      
      alert('PME créée avec succès !');
      setShowCreatePME(false);
      resetPMEForm();
      
      // Recharger les données
      await fetchAllData();
      
    } catch (error) {
      console.error('Erreur lors de la création de la PME:', error);
      alert('Erreur lors de la création de la PME');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(firestore, "users", userId));
      alert('Utilisateur supprimé avec succès !');
      await fetchAllData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une PME
  const handleDeletePME = async (pmeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette PME ?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(firestore, "businesses", pmeId));
      alert('PME supprimée avec succès !');
      await fetchAllData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la PME');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour modifier le statut d'un utilisateur
  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      setLoading(true);
      await updateDoc(doc(firestore, "users", userId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      alert('Statut utilisateur mis à jour !');
      await fetchAllData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour modifier le statut d'une PME
  const handleUpdatePMEStatus = async (pmeId: string, newStatus: string) => {
    try {
      setLoading(true);
      await updateDoc(doc(firestore, "businesses", pmeId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      alert('Statut PME mis à jour !');
      await fetchAllData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour éditer un utilisateur
  const handleEditUser = async () => {
    if (!selectedItem || !userForm.name || !userForm.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      await updateDoc(doc(firestore, "users", selectedItem.id), {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        company: userForm.company,
        duration: userForm.duration,
        updatedAt: new Date().toISOString()
      });
      
      alert('Utilisateur modifié avec succès !');
      setShowEditUser(false);
      setSelectedItem(null);
      resetUserForm();
      await fetchAllData();
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour éditer une PME
  const handleEditPME = async () => {
    if (!selectedItem || !pmeForm.name || !pmeForm.contact) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      await updateDoc(doc(firestore, "businesses", selectedItem.id), {
        businessName: pmeForm.name,
        contactName: pmeForm.contact,
        email: pmeForm.email,
        phone: pmeForm.phone,
        city: pmeForm.city,
        businessType: pmeForm.activity,
        updatedAt: new Date().toISOString()
      });
      
      alert('PME modifiée avec succès !');
      setShowEditPME(false);
      setSelectedItem(null);
      resetPMEForm();
      await fetchAllData();
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de la PME');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour ouvrir l'édition d'un utilisateur
  const openEditUser = (user: User) => {
    setSelectedItem(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      duration: user.duration || user.accessDuration?.toString() || '30',
      company: user.company || user.companyName || ''
    });
    setShowEditUser(true);
  };

  // Fonction pour ouvrir l'édition d'une PME
  const openEditPME = (pme: PME) => {
    setSelectedItem(pme);
    setPMEForm({
      name: pme.businessName || pme.companyName,
      contact: pme.contactName || '',
      email: pme.email || '',
      phone: pme.phone || '',
      city: pme.city || '',
      activity: pme.businessType || pme.activityType || ''
    });
    setShowEditPME(true);
  };

  // Fonction pour exporter les données
  const handleExportData = async (type: 'users' | 'pmes') => {
    try {
      const data = type === 'users' ? users : pmes;
      const csvContent = convertToCSV(data);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Export ${type} terminé avec succès !`);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export des données');
    }
  };

  // Fonction pour convertir les données en CSV
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  // Fonction pour recharger les données
  const handleRefresh = async () => {
    await fetchAllData();
  };

  // Fonction pour réinitialiser le formulaire utilisateur
  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: '',
      duration: '',
      company: ''
    });
  };

  // Fonction pour réinitialiser le formulaire PME
  const resetPMEForm = () => {
    setPMEForm({
      name: '',
      contact: '',
      email: '',
      phone: '',
      city: '',
      activity: ''
    });
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

  // États pour les formulaires
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    duration: '',
    company: ''
  });

  const [pmeForm, setPMEForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    city: '',
    activity: ''
  });

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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1" 
                            onClick={() => openEditPME(pme)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePME(pme.id)}
                          >
                            <Trash2 className="w-3 h-3" />
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
                <Input 
                  id="user-name" 
                  placeholder="Jean Mba" 
                  value={userForm.name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input 
                  id="user-email" 
                  type="email" 
                  placeholder="jean@lapaillote.ga" 
                  value={userForm.email}
                  onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-password">Mot de passe</Label>
                <Input 
                  id="user-password" 
                  type="password" 
                  placeholder="Mot de passe" 
                  value={userForm.password}
                  onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="user-role">Rôle</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="user-duration">Durée d'accès (jours)</Label>
                <Input 
                  id="user-duration" 
                  type="number" 
                  placeholder="30" 
                  value={userForm.duration}
                  onChange={(e) => setUserForm(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="user-company">Entreprise</Label>
                <Input 
                  id="user-company" 
                  placeholder="Nom de l'entreprise" 
                  value={userForm.company}
                  onChange={(e) => setUserForm(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleCreateUser} disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
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
                <Input 
                  id="pme-name" 
                  placeholder="Restaurant La Paillote" 
                  value={pmeForm.name}
                  onChange={(e) => setPMEForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pme-contact">Contact principal</Label>
                <Input 
                  id="pme-contact" 
                  placeholder="Jean Dupont" 
                  value={pmeForm.contact}
                  onChange={(e) => setPMEForm(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pme-email">Email</Label>
                <Input 
                  id="pme-email" 
                  type="email" 
                  placeholder="contact@lapaillote.ga" 
                  value={pmeForm.email}
                  onChange={(e) => setPMEForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="pme-phone">Téléphone</Label>
                <Input 
                  id="pme-phone" 
                  placeholder="+241 01 23 45 67" 
                  value={pmeForm.phone}
                  onChange={(e) => setPMEForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pme-city">Ville</Label>
                <Select value={pmeForm.city} onValueChange={(value) => setPMEForm(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Libreville">Libreville</SelectItem>
                    <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                    <SelectItem value="Franceville">Franceville</SelectItem>
                    <SelectItem value="Oyem">Oyem</SelectItem>
                    <SelectItem value="Moanda">Moanda</SelectItem>
                    <SelectItem value="Lambaréné">Lambaréné</SelectItem>
                    <SelectItem value="Mouila">Mouila</SelectItem>
                    <SelectItem value="Koulamoutou">Koulamoutou</SelectItem>
                    <SelectItem value="Tchibanga">Tchibanga</SelectItem>
                    <SelectItem value="Lastoursville">Lastoursville</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pme-activity">Type d'activité</Label>
                <Select value={pmeForm.activity} onValueChange={(value) => setPMEForm(prev => ({ ...prev, activity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="epicerie">Épicerie</SelectItem>
                    <SelectItem value="cafe">Café</SelectItem>
                    <SelectItem value="boulangerie">Boulangerie</SelectItem>
                    <SelectItem value="traiteur">Traiteur</SelectItem>
                    <SelectItem value="loisirs">Loisirs</SelectItem>
                    <SelectItem value="hotel">Hôtel</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="pharmacie">Pharmacie</SelectItem>
                    <SelectItem value="supermarche">Supermarché</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePME(false)}>
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleCreatePME} disabled={loading}>
              <Building className="w-4 h-4 mr-2" />
              {loading ? 'Création...' : 'Ajouter la PME'}
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
