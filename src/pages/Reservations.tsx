import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react";

interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber?: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

export default function Reservations() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddReservation, setShowAddReservation] = useState(false);
  const [showEditReservation, setShowEditReservation] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Formulaire pour nouvelle réservation
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    date: '',
    time: '',
    partySize: 2,
    tableNumber: '',
    specialRequests: ''
  });

  // Charger les réservations
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des réservations depuis Firebase
      const mockReservations: Reservation[] = [
        {
          id: '1',
          customerName: 'Jean Mba',
          customerPhone: '+241 01 23 45 67',
          customerEmail: 'jean.mba@email.com',
          date: '2024-01-20',
          time: '19:30',
          partySize: 4,
          tableNumber: 'T5',
          specialRequests: 'Table près de la fenêtre',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '2',
          customerName: 'Marie Obame',
          customerPhone: '+241 07 89 12 34',
          date: '2024-01-21',
          time: '20:00',
          partySize: 2,
          tableNumber: 'T3',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];
      
      setReservations(mockReservations);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReservation = async () => {
    if (!reservationForm.customerName || !reservationForm.customerPhone || !reservationForm.date || !reservationForm.time) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const newReservation: Reservation = {
        id: Date.now().toString(),
        ...reservationForm,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessId: user?.uid || ''
      };

      setReservations(prev => [newReservation, ...prev]);
      
      toast({
        title: "Réservation créée",
        description: "La réservation a été créée avec succès"
      });

      setShowAddReservation(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive"
      });
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      setReservations(prev => 
        prev.map(res => 
          res.id === id 
            ? { ...res, status, updatedAt: new Date().toISOString() }
            : res
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La réservation a été ${status === 'confirmed' ? 'confirmée' : status === 'cancelled' ? 'annulée' : 'marquée comme terminée'}`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive"
      });
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      setReservations(prev => prev.filter(res => res.id !== id));
      
      toast({
        title: "Réservation supprimée",
        description: "La réservation a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setReservationForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      date: '',
      time: '',
      partySize: 2,
      tableNumber: '',
      specialRequests: ''
    });
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'completed': return 'Terminée';
      default: return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => 
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || reservation.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Réservations</h1>
            <p className="text-muted-foreground">Gérez les réservations de votre restaurant</p>
          </div>
          <Button 
            onClick={() => setShowAddReservation(true)}
            className="btn-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Réservation
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{reservations.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reservations.filter(r => r.status === 'confirmed').length}
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
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reservations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom de client..."
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
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des réservations */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune réservation trouvée</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucune réservation ne correspond à votre recherche." : "Commencez par créer votre première réservation."}
              </p>
              <Button onClick={() => setShowAddReservation(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Créer une réservation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="card-stats">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                        <Badge className={getStatusColor(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(reservation.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{reservation.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{reservation.partySize} personnes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{reservation.customerPhone}</span>
                        </div>
                      </div>

                      {reservation.tableNumber && (
                        <div className="mt-2">
                          <Badge variant="outline">Table {reservation.tableNumber}</Badge>
                        </div>
                      )}

                      {reservation.specialRequests && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Demandes spéciales:</strong> {reservation.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {reservation.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmer
                        </Button>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateReservationStatus(reservation.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Terminer
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowEditReservation(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Nouvelle Réservation */}
        <Dialog open={showAddReservation} onOpenChange={setShowAddReservation}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Réservation</DialogTitle>
              <DialogDescription>
                Créez une nouvelle réservation pour votre restaurant
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom du client *</Label>
                  <Input
                    id="customerName"
                    placeholder="Jean Mba"
                    value={reservationForm.customerName}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input
                    id="customerPhone"
                    placeholder="+241 01 23 45 67"
                    value={reservationForm.customerPhone}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="jean.mba@email.com"
                  value={reservationForm.customerEmail}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partySize">Nombre de personnes *</Label>
                  <Input
                    id="partySize"
                    type="number"
                    min="1"
                    max="20"
                    value={reservationForm.partySize}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, partySize: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tableNumber">Numéro de table</Label>
                  <Input
                    id="tableNumber"
                    placeholder="T5"
                    value={reservationForm.tableNumber}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, tableNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="specialRequests">Demandes spéciales</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Table près de la fenêtre, allergie aux fruits de mer..."
                  value={reservationForm.specialRequests}
                  onChange={(e) => setReservationForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddReservation(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddReservation} className="btn-gradient">
                Créer la réservation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
