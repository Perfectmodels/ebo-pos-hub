import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Truck, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  Clock,
  Phone,
  User,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  DollarSign
} from "lucide-react";

interface Delivery {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryAddress: string;
  items: DeliveryItem[];
  totalAmount: number;
  deliveryFee: number;
  status: 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  deliveryNotes?: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

interface DeliveryItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  isAvailable: boolean;
  currentDeliveries: number;
}

export default function Delivery() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [showEditDelivery, setShowEditDelivery] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Formulaire pour nouvelle livraison
  const [deliveryForm, setDeliveryForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    deliveryAddress: '',
    items: [{ name: '', quantity: 1, price: 0, notes: '' }],
    deliveryFee: 1000,
    estimatedDeliveryTime: '',
    deliveryNotes: '',
    driverName: ''
  });

  // Charger les données
  useEffect(() => {
    loadDeliveryData();
  }, []);

  const loadDeliveryData = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des données depuis Firebase
      const mockDrivers: Driver[] = [
        {
          id: '1',
          name: 'Jean Mba',
          phone: '+241 01 23 45 67',
          vehicleType: 'Moto',
          licensePlate: 'LB-123-AB',
          isAvailable: true,
          currentDeliveries: 0
        },
        {
          id: '2',
          name: 'Paul Obame',
          phone: '+241 07 89 12 34',
          vehicleType: 'Voiture',
          licensePlate: 'LB-456-CD',
          isAvailable: true,
          currentDeliveries: 1
        }
      ];

      const mockDeliveries: Delivery[] = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'Marie Nguema',
          customerPhone: '+241 05 67 89 01',
          customerAddress: 'Quartier Montagne Sainte, Libreville',
          deliveryAddress: 'Résidence des Élégants, Libreville',
          items: [
            { name: 'Pizza Margherita', quantity: 1, price: 5500 },
            { name: 'Coca-Cola', quantity: 2, price: 1000 }
          ],
          totalAmount: 7500,
          deliveryFee: 1000,
          status: 'out_for_delivery',
          estimatedDeliveryTime: '30 minutes',
          deliveryNotes: 'Sonner à la porte principale',
          driverName: 'Jean Mba',
          driverPhone: '+241 01 23 45 67',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'André Mballa',
          customerPhone: '+241 06 12 34 56',
          customerAddress: 'Quartier Montagne Sainte, Libreville',
          deliveryAddress: 'Immeuble Sogara, Port-Gentil',
          items: [
            { name: 'Burger Deluxe', quantity: 2, price: 4500 },
            { name: 'Frites', quantity: 1, price: 2000 }
          ],
          totalAmount: 11000,
          deliveryFee: 1500,
          status: 'preparing',
          estimatedDeliveryTime: '45 minutes',
          deliveryNotes: 'Livraison urgente',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];

      setDrivers(mockDrivers);
      setDeliveries(mockDeliveries);
    } catch (error) {
      console.error('Erreur lors du chargement des livraisons:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les livraisons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDelivery = async () => {
    if (!deliveryForm.customerName || !deliveryForm.customerPhone || !deliveryForm.deliveryAddress) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const totalAmount = deliveryForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const orderNumber = `ORD-${String(deliveries.length + 1).padStart(3, '0')}`;

      const newDelivery: Delivery = {
        id: Date.now().toString(),
        orderNumber,
        ...deliveryForm,
        customerAddress: deliveryForm.customerAddress || deliveryForm.deliveryAddress,
        totalAmount,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessId: user?.uid || ''
      };

      setDeliveries(prev => [newDelivery, ...prev]);
      
      toast({
        title: "Livraison créée",
        description: "La livraison a été créée avec succès"
      });

      setShowAddDelivery(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la création de la livraison:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la livraison",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDeliveryStatus = async (id: string, status: Delivery['status'], driverName?: string) => {
    try {
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === id 
            ? { 
                ...delivery, 
                status, 
                driverName: driverName || delivery.driverName,
                updatedAt: new Date().toISOString(),
                ...(status === 'delivered' ? { actualDeliveryTime: new Date().toISOString() } : {})
              }
            : delivery
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La livraison est maintenant ${getStatusLabel(status)}`
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

  const handleDeleteDelivery = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette livraison ?')) {
      return;
    }

    try {
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      
      toast({
        title: "Livraison supprimée",
        description: "La livraison a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la livraison",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setDeliveryForm({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      deliveryAddress: '',
      items: [{ name: '', quantity: 1, price: 0, notes: '' }],
      deliveryFee: 1000,
      estimatedDeliveryTime: '',
      deliveryNotes: '',
      driverName: ''
    });
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'out_for_delivery': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getStatusIcon = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || delivery.status === filterStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Livraisons</h1>
            <p className="text-muted-foreground">Suivez et gérez vos livraisons en temps réel</p>
          </div>
          <Button 
            onClick={() => setShowAddDelivery(true)}
            className="btn-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Livraison
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Livraisons</p>
                  <p className="text-2xl font-bold">{deliveries.length}</p>
                </div>
                <Truck className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {deliveries.filter(d => ['preparing', 'ready', 'out_for_delivery'].includes(d.status)).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Livrées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {deliveries.filter(d => d.status === 'delivered').length}
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
                  <p className="text-sm text-muted-foreground">Chauffeurs</p>
                  <p className="text-2xl font-bold text-purple-600">{drivers.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de commande, client ou adresse..."
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
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="preparing">En préparation</SelectItem>
              <SelectItem value="ready">Prêtes</SelectItem>
              <SelectItem value="out_for_delivery">En livraison</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des livraisons */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune livraison trouvée</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucune livraison ne correspond à votre recherche." : "Commencez par créer votre première livraison."}
              </p>
              <Button onClick={() => setShowAddDelivery(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Créer une livraison
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <Card key={delivery.id} className="card-stats">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{delivery.orderNumber}</h3>
                        <Badge className={getStatusColor(delivery.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(delivery.status)}
                            {getStatusLabel(delivery.status)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium mb-2">Client</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{delivery.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{delivery.customerPhone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Livraison</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="truncate">{delivery.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Est: {delivery.estimatedDeliveryTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Articles</h4>
                        <div className="space-y-1">
                          {delivery.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-medium">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm font-medium border-t pt-1">
                            <span>Total + Livraison</span>
                            <span>{(delivery.totalAmount + delivery.deliveryFee).toLocaleString()} FCFA</span>
                          </div>
                        </div>
                      </div>

                      {delivery.driverName && (
                        <div className="mb-2">
                          <Badge variant="outline">
                            <Navigation className="w-3 h-3 mr-1" />
                            Chauffeur: {delivery.driverName}
                          </Badge>
                        </div>
                      )}

                      {delivery.deliveryNotes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {delivery.deliveryNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {delivery.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDeliveryStatus(delivery.id, 'preparing')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Préparer
                          </Button>
                        </>
                      )}
                      
                      {delivery.status === 'preparing' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateDeliveryStatus(delivery.id, 'ready')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Prête
                        </Button>
                      )}

                      {delivery.status === 'ready' && (
                        <Select onValueChange={(driverName) => handleUpdateDeliveryStatus(delivery.id, 'out_for_delivery', driverName)}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Assigner un chauffeur" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.filter(d => d.isAvailable).map(driver => (
                              <SelectItem key={driver.id} value={driver.name}>
                                {driver.name} ({driver.vehicleType})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {delivery.status === 'out_for_delivery' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateDeliveryStatus(delivery.id, 'delivered')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Livrée
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteDelivery(delivery.id)}
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

        {/* Modal Nouvelle Livraison */}
        <Dialog open={showAddDelivery} onOpenChange={setShowAddDelivery}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle Livraison</DialogTitle>
              <DialogDescription>
                Créez une nouvelle livraison pour votre client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nom du client *</Label>
                  <Input
                    id="customerName"
                    placeholder="Marie Nguema"
                    value={deliveryForm.customerName}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input
                    id="customerPhone"
                    placeholder="+241 05 67 89 01"
                    value={deliveryForm.customerPhone}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerAddress">Adresse du client</Label>
                <Input
                  id="customerAddress"
                  placeholder="Quartier Montagne Sainte, Libreville"
                  value={deliveryForm.customerAddress}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, customerAddress: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="deliveryAddress">Adresse de livraison *</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Résidence des Élégants, Libreville"
                  value={deliveryForm.deliveryAddress}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryFee">Frais de livraison (FCFA)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={deliveryForm.deliveryFee}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryFee: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDeliveryTime">Temps estimé</Label>
                  <Input
                    id="estimatedDeliveryTime"
                    placeholder="30 minutes"
                    value={deliveryForm.estimatedDeliveryTime}
                    onChange={(e) => setDeliveryForm(prev => ({ ...prev, estimatedDeliveryTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryNotes">Notes de livraison</Label>
                <Textarea
                  id="deliveryNotes"
                  placeholder="Instructions spéciales pour la livraison..."
                  value={deliveryForm.deliveryNotes}
                  onChange={(e) => setDeliveryForm(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                />
              </div>

              <div>
                <Label>Articles</Label>
                <div className="space-y-2">
                  {deliveryForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Nom de l'article"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...deliveryForm.items];
                          newItems[index].name = e.target.value;
                          setDeliveryForm(prev => ({ ...prev, items: newItems }));
                        }}
                      />
                      <Input
                        type="number"
                        min="1"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...deliveryForm.items];
                          newItems[index].quantity = parseInt(e.target.value) || 1;
                          setDeliveryForm(prev => ({ ...prev, items: newItems }));
                        }}
                      />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Prix"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...deliveryForm.items];
                          newItems[index].price = parseFloat(e.target.value) || 0;
                          setDeliveryForm(prev => ({ ...prev, items: newItems }));
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newItems = deliveryForm.items.filter((_, i) => i !== index);
                          setDeliveryForm(prev => ({ ...prev, items: newItems }));
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDeliveryForm(prev => ({
                        ...prev,
                        items: [...prev.items, { name: '', quantity: 1, price: 0, notes: '' }]
                      }));
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un article
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDelivery(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddDelivery} className="btn-gradient">
                Créer la livraison
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
