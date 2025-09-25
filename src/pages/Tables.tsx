import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Square, 
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MapPin,
  Wifi,
  Coffee
} from "lucide-react";

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: string;
  features: string[];
  currentOrder?: {
    orderId: string;
    customerName: string;
    startTime: string;
    partySize: number;
  };
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

interface TableZone {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export default function Tables() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [zones, setZones] = useState<TableZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddTable, setShowAddTable] = useState(false);
  const [showEditTable, setShowEditTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Formulaire pour nouvelle table
  const [tableForm, setTableForm] = useState({
    number: '',
    capacity: 2,
    location: '',
    features: [] as string[],
    status: 'available' as Table['status']
  });

  const availableFeatures = [
    'Wifi',
    'Prise électrique',
    'Vue extérieure',
    'Coin calme',
    'Proche bar',
    'Terrasse',
    'Climatisation',
    'Éclairage d\'ambiance'
  ];

  // Charger les données
  useEffect(() => {
    loadTablesData();
  }, []);

  const loadTablesData = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des données depuis Firebase
      const mockZones: TableZone[] = [
        { id: '1', name: 'Salle principale', description: 'Salle principale du restaurant', sortOrder: 1 },
        { id: '2', name: 'Terrasse', description: 'Terrasse extérieure', sortOrder: 2 },
        { id: '3', name: 'Coin VIP', description: 'Espace privé pour groupes', sortOrder: 3 },
        { id: '4', name: 'Bar', description: 'Tables près du bar', sortOrder: 4 }
      ];

      const mockTables: Table[] = [
        {
          id: '1',
          number: 'T1',
          capacity: 4,
          status: 'available',
          location: 'Salle principale',
          features: ['Wifi', 'Prise électrique'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '2',
          number: 'T2',
          capacity: 2,
          status: 'occupied',
          location: 'Salle principale',
          features: ['Vue extérieure'],
          currentOrder: {
            orderId: 'ORD001',
            customerName: 'Jean Mba',
            startTime: new Date().toISOString(),
            partySize: 2
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: 'T3',
          number: 'T3',
          capacity: 6,
          status: 'reserved',
          location: 'Terrasse',
          features: ['Terrasse', 'Climatisation'],
          currentOrder: {
            orderId: 'RES001',
            customerName: 'Marie Obame',
            startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Dans 30 min
            partySize: 4
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '4',
          number: 'T4',
          capacity: 8,
          status: 'maintenance',
          location: 'Coin VIP',
          features: ['Coin calme', 'Éclairage d\'ambiance', 'Climatisation'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];

      setZones(mockZones);
      setTables(mockTables);
    } catch (error) {
      console.error('Erreur lors du chargement des tables:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTable = async () => {
    if (!tableForm.number || tableForm.capacity <= 0 || !tableForm.location) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const newTable: Table = {
        id: Date.now().toString(),
        ...tableForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessId: user?.uid || ''
      };

      setTables(prev => [newTable, ...prev]);
      
      toast({
        title: "Table ajoutée",
        description: "La table a été ajoutée avec succès"
      });

      setShowAddTable(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la table:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la table",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTable = async () => {
    if (!selectedTable || !tableForm.number || tableForm.capacity <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setTables(prev => 
        prev.map(table => 
          table.id === selectedTable.id 
            ? { ...table, ...tableForm, updatedAt: new Date().toISOString() }
            : table
        )
      );

      toast({
        title: "Table modifiée",
        description: "La table a été modifiée avec succès"
      });

      setShowEditTable(false);
      setSelectedTable(null);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la table",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      return;
    }

    try {
      setTables(prev => prev.filter(table => table.id !== id));
      
      toast({
        title: "Table supprimée",
        description: "La table a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la table",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTableStatus = async (id: string, status: Table['status']) => {
    try {
      setTables(prev => 
        prev.map(table => 
          table.id === id 
            ? { 
                ...table, 
                status, 
                updatedAt: new Date().toISOString(),
                ...(status === 'available' ? { currentOrder: undefined } : {})
              }
            : table
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La table est maintenant ${getStatusLabel(status)}`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setTableForm({
      number: '',
      capacity: 2,
      location: '',
      features: [],
      status: 'available'
    });
  };

  const openEditTable = (table: Table) => {
    setSelectedTable(table);
    setTableForm({
      number: table.number,
      capacity: table.capacity,
      location: table.location,
      features: table.features,
      status: table.status
    });
    setShowEditTable(true);
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'reserved': return 'Réservée';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'occupied': return <XCircle className="w-4 h-4" />;
      case 'reserved': return <AlertCircle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const filteredTables = tables.filter(table => 
    table.number.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || table.status === filterStatus)
  );

  const groupedTables = zones.reduce((acc, zone) => {
    const zoneTables = filteredTables.filter(table => table.location === zone.name);
    if (zoneTables.length > 0) {
      acc[zone.name] = zoneTables;
    }
    return acc;
  }, {} as Record<string, Table[]>);

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Tables</h1>
            <p className="text-muted-foreground">Organisez et gérez les tables de votre restaurant</p>
          </div>
          <Button 
            onClick={() => setShowAddTable(true)}
            className="btn-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une Table
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tables</p>
                  <p className="text-2xl font-bold">{tables.length}</p>
                </div>
                <Square className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tables.filter(t => t.status === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Occupées</p>
                  <p className="text-2xl font-bold text-red-600">
                    {tables.filter(t => t.status === 'occupied').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réservées</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {tables.filter(t => t.status === 'reserved').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une table..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="available">Disponibles</SelectItem>
              <SelectItem value="occupied">Occupées</SelectItem>
              <SelectItem value="reserved">Réservées</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tables par zones */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(groupedTables).length === 0 ? (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Square className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune table trouvée</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucune table ne correspond à votre recherche." : "Commencez par ajouter votre première table."}
              </p>
              <Button onClick={() => setShowAddTable(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une table
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTables).map(([zoneName, zoneTables]) => (
              <div key={zoneName}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{zoneName}</h2>
                  <Badge variant="secondary">{zoneTables.length} table{zoneTables.length > 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {zoneTables.map((table) => (
                    <Card key={table.id} className="card-stats">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold">{table.number}</CardTitle>
                          <Badge className={getStatusColor(table.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(table.status)}
                              {getStatusLabel(table.status)}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Capacité: {table.capacity} personnes</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{table.location}</span>
                        </div>

                        {table.features.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Équipements:</p>
                            <div className="flex flex-wrap gap-1">
                              {table.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {table.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{table.features.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {table.currentOrder && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Commande en cours:</p>
                            <p className="text-sm text-muted-foreground">
                              {table.currentOrder.customerName} - {table.currentOrder.partySize} personnes
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Depuis: {new Date(table.currentOrder.startTime).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {table.status === 'occupied' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTableStatus(table.id, 'available')}
                              className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Libérer
                            </Button>
                          )}
                          
                          {table.status === 'reserved' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTableStatus(table.id, 'occupied')}
                              className="bg-blue-600 hover:bg-blue-700 flex-1"
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Occuper
                            </Button>
                          )}

                          {table.status === 'available' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateTableStatus(table.id, 'occupied')}
                              className="bg-orange-600 hover:bg-orange-700 flex-1"
                            >
                              <Users className="w-4 h-4 mr-1" />
                              Occuper
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditTable(table)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTable(table.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Ajouter/Modifier Table */}
        <Dialog open={showAddTable || showEditTable} onOpenChange={(open) => {
          if (!open) {
            setShowAddTable(false);
            setShowEditTable(false);
            setSelectedTable(null);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {showAddTable ? 'Ajouter une Table' : 'Modifier la Table'}
              </DialogTitle>
              <DialogDescription>
                {showAddTable ? 'Ajoutez une nouvelle table à votre restaurant' : 'Modifiez les informations de cette table'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number">Numéro de table *</Label>
                  <Input
                    id="number"
                    placeholder="T5"
                    value={tableForm.number}
                    onChange={(e) => setTableForm(prev => ({ ...prev, number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacité *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="20"
                    placeholder="4"
                    value={tableForm.capacity}
                    onChange={(e) => setTableForm(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Zone/Emplacement *</Label>
                <Select value={tableForm.location} onValueChange={(value) => setTableForm(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone.id} value={zone.name}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={tableForm.status} onValueChange={(value: Table['status']) => setTableForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="occupied">Occupée</SelectItem>
                    <SelectItem value="reserved">Réservée</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Équipements</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={feature}
                        checked={tableForm.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTableForm(prev => ({ ...prev, features: [...prev.features, feature] }));
                          } else {
                            setTableForm(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={feature} className="text-sm">{feature}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddTable(false);
                setShowEditTable(false);
                setSelectedTable(null);
                resetForm();
              }}>
                Annuler
              </Button>
              <Button 
                onClick={showAddTable ? handleAddTable : handleUpdateTable}
                className="btn-gradient"
              >
                {showAddTable ? 'Ajouter la table' : 'Modifier la table'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
