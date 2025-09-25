import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Truck, 
  Plus,
  Edit,
  Trash2,
  Search,
  Phone,
  Mail,
  MapPin,
  Package,
  Star,
  Calendar,
  DollarSign
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  lastOrderDate?: string;
  totalOrders: number;
  totalAmount: number;
  paymentTerms: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

export default function Suppliers() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    paymentTerms: '',
    notes: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const mockSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'Distributions Gabon',
          contactPerson: 'Jean Mba',
          email: 'contact@distribgabon.ga',
          phone: '+241 01 23 45 67',
          address: 'Zone Industrielle, Libreville',
          category: 'Alimentaire',
          rating: 4.5,
          status: 'active',
          lastOrderDate: '2024-01-15',
          totalOrders: 25,
          totalAmount: 2500000,
          paymentTerms: '30 jours',
          notes: 'Fournisseur fiable, livraisons rapides',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];
      
      setSuppliers(mockSuppliers);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les fournisseurs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async () => {
    if (!supplierForm.name || !supplierForm.contactPerson || !supplierForm.phone) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...supplierForm,
        rating: 0,
        status: 'pending',
        totalOrders: 0,
        totalAmount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessId: user?.uid || ''
      };

      setSuppliers(prev => [newSupplier, ...prev]);
      
      toast({
        title: "Fournisseur ajouté",
        description: "Le fournisseur a été ajouté avec succès"
      });

      setShowAddSupplier(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du fournisseur:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le fournisseur",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setSupplierForm({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      category: '',
      paymentTerms: '',
      notes: ''
    });
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Fournisseurs</h1>
            <p className="text-muted-foreground">Gérez vos fournisseurs et partenaires</p>
          </div>
          <Button 
            onClick={() => setShowAddSupplier(true)}
            className="btn-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Fournisseur
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un fournisseur..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun fournisseur trouvé</h3>
              <p className="text-muted-foreground text-center mb-4">
                Commencez par ajouter votre premier fournisseur.
              </p>
              <Button onClick={() => setShowAddSupplier(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un fournisseur
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="card-stats">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{supplier.name}</CardTitle>
                      <CardDescription>{supplier.category}</CardDescription>
                    </div>
                    <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                      {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{supplier.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{supplier.totalOrders}</p>
                      <p className="text-xs text-muted-foreground">Commandes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {supplier.totalAmount.toLocaleString()} FCFA
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nouveau Fournisseur</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau fournisseur à votre liste
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    placeholder="Distributions Gabon"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Personne de contact *</Label>
                  <Input
                    id="contactPerson"
                    placeholder="Jean Mba"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    placeholder="+241 01 23 45 67"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@distribgabon.ga"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  placeholder="Zone Industrielle, Libreville"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    placeholder="Alimentaire"
                    value={supplierForm.category}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Conditions de paiement</Label>
                  <Input
                    id="paymentTerms"
                    placeholder="30 jours"
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Informations supplémentaires..."
                  value={supplierForm.notes}
                  onChange={(e) => setSupplierForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddSupplier(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSupplier} className="btn-gradient">
                Ajouter le fournisseur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
