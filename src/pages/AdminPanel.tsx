import { useState, useEffect, useMemo } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import AdminAuth from "@/components/AdminAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Users, Building2, Search, RefreshCw, Trash2, MoreHorizontal } from "lucide-react";

// --- Interfaces --- //
interface BaseDocument {
  id: string;
  status?: 'active' | 'pending' | 'suspended' | 'inactive';
  registrationDate?: any;
}
interface User extends BaseDocument {
  name?: string;
  email?: string;
  companyName?: string;
}
interface PME extends BaseDocument {
  companyName?: string;
  contactName?: string;
  email?: string;
  city?: string;
}

// --- Composant Principal --- //
export default function AdminPanel() {
  // --- États --- //
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [pmes, setPMEs] = useState<PME[]>([]);

  // --- Logique de Données --- //
  const fetchData = async () => {
    setLoading(true);
    try {
      const userSnapshot = await getDocs(collection(db, "users"));
      setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
      const pmeSnapshot = await getDocs(collection(db, "businesses"));
      setPMEs(pmeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PME)));
    } catch (error) { console.error("Erreur de fetch:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else { setLoading(false); }
  }, []);

  const handleAction = async (collectionName: string, id: string, action: 'delete' | 'updateStatus', payload?: any) => {
    const confirmationText = action === 'delete' ? "Êtes-vous sûr de vouloir supprimer cet élément ?" : "Confirmez-vous cette action ?";
    if (window.confirm(confirmationText)) {
        try {
            if (action === 'delete') {
                await deleteDoc(doc(db, collectionName, id));
            } else if (action === 'updateStatus') {
                await updateDoc(doc(db, collectionName, id), { status: payload });
            }
            fetchData(); // Recharger les données après l'action
        } catch (error) {
            console.error(`Erreur lors de l\'action ${action}:`, error);
        }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  // --- Filtrage --- //
  const filteredUsers = useMemo(() => users.filter(u => 
    (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || u.status === filterStatus)
  ), [users, searchTerm, filterStatus]);

  const filteredPMEs = useMemo(() => pmes.filter(p => 
    (p.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || p.contactName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || p.status === filterStatus)
  ), [pmes, searchTerm, filterStatus]);

  // --- Rendu --- //
  if (loading) { return <div className="p-6">Chargement...</div>; }
  if (!isAuthenticated) { return <AdminAuth onSuccess={() => { setIsAuthenticated(true); fetchData(); }} />; }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel Admin</h1>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline"><RefreshCw size={16} className="mr-2"/>Actualiser</Button>
          <Button onClick={handleLogout} variant="destructive"><Shield size={16} className="mr-2"/>Déconnexion</Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium">Utilisateurs</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">PME</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{pmes.length}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="pmes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pmes">PME ({filteredPMEs.length})</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs ({filteredUsers.length})</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 mt-4">
          <Input placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm"/>
          <select onChange={e => setFilterStatus(e.target.value)} className="border rounded-md p-2 bg-background"><option value="all">Tous statuts</option><option value="active">Actif</option><option value="pending">En attente</option><option value="suspended">Suspendu</option></select>
        </div>

        <TabsContent value="pmes">
          <TableauPME data={filteredPMEs} onAction={handleAction} />
        </TabsContent>
        <TabsContent value="users">
          <TableauUsers data={filteredUsers} onAction={handleAction} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Composants de Tableau --- //
const getInitials = (name: string = '') => name.split(' ').map(n => n[0]).join('').toUpperCase();
const formatDate = (date: any) => date?.seconds ? new Date(date.seconds * 1000).toLocaleDateString('fr-FR') : 'N/A';
const getStatusBadge = (status?: BaseDocument['status']) => {
    const colors = { active: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', suspended: 'bg-red-100 text-red-800', inactive: 'bg-gray-100 text-gray-800' };
    return <Badge className={colors[status || 'inactive']}>{status || 'N/A'}</Badge>;
};

function TableauPME({ data, onAction }: { data: PME[], onAction: Function }) {
  return (
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Entreprise</TableHead><TableHead>Contact</TableHead><TableHead>Statut</TableHead><TableHead>Inscrit le</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {data.map(pme => (
            <TableRow key={pme.id}>
              <TableCell><div className="font-medium">{pme.companyName}</div><div className="text-xs text-muted-foreground">{pme.city}</div></TableCell>
              <TableCell><div>{pme.contactName}</div><div className="text-xs text-muted-foreground">{pme.email}</div></TableCell>
              <TableCell>{getStatusBadge(pme.status)}</TableCell>
              <TableCell>{formatDate(pme.registrationDate)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {pme.status === 'pending' && <DropdownMenuItem onClick={() => onAction('businesses', pme.id, 'updateStatus', 'active')}>Approuver</DropdownMenuItem>}
                    {pme.status === 'active' && <DropdownMenuItem onClick={() => onAction('businesses', pme.id, 'updateStatus', 'suspended')}>Suspendre</DropdownMenuItem>}
                    {pme.status === 'suspended' && <DropdownMenuItem onClick={() => onAction('businesses', pme.id, 'updateStatus', 'active')}>Réactiver</DropdownMenuItem>}
                    <DropdownMenuItem className="text-red-600" onClick={() => onAction('businesses', pme.id, 'delete')}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function TableauUsers({ data, onAction }: { data: User[], onAction: Function }) {
  return (
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Utilisateur</TableHead><TableHead>Entreprise</TableHead><TableHead>Statut</TableHead><TableHead>Inscrit le</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
        <TableBody>
          {data.map(user => (
            <TableRow key={user.id}>
              <TableCell><div className="flex items-center gap-2"><Avatar className="w-8 h-8"><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar><div><div className="font-medium">{user.name}</div><div className="text-xs text-muted-foreground">{user.email}</div></div></div></TableCell>
              <TableCell>{user.companyName || 'N/A'}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{formatDate(user.registrationDate)}</TableCell>
              <TableCell className="text-right">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.status !== 'suspended' ? <DropdownMenuItem onClick={() => onAction('users', user.id, 'updateStatus', 'suspended')}>Suspendre</DropdownMenuItem> : <DropdownMenuItem onClick={() => onAction('users', user.id, 'updateStatus', 'active')}>Réactiver</DropdownMenuItem>}
                    <DropdownMenuItem className="text-red-600" onClick={() => onAction('users', user.id, 'delete')}>Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
