import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/useClients";
import AddClientForm from "@/components/AddClientForm";
import { 
  Users, 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Filter,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";

export default function Clients() {
  const { toast } = useToast();
  const { clients, loading, deleteClient } = useClients();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");



  const filteredClients = clients.filter(client => 
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedStatus === "Tous" || client.status === selectedStatus)
  );

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      const result = await deleteClient(id);
      if (result.success) {
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible de supprimer le client",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion Clients</h1>
            <p className="text-muted-foreground">Gérez votre base de données clients</p>
          </div>
          <div className="flex gap-2">
            <AddClientForm onClientAdded={() => {}} />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="card-stats">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">
                      {client.full_name}
                    </CardTitle>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {client.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{client.address}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total achats</span>
                    <span className="font-semibold text-primary">
                      {client.total_purchases.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dernier achat</span>
                    <span className="text-sm">
                      {client.last_purchase ? new Date(client.last_purchase).toLocaleDateString('fr-FR') : 'Aucun'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // TODO: Implémenter l'édition
                      toast({
                        title: "Fonctionnalité à venir",
                        description: "L'édition des clients sera bientôt disponible",
                      });
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 && (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun client trouvé</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucun client ne correspond à votre recherche." : "Commencez par ajouter votre premier client."}
              </p>
              <AddClientForm onClientAdded={() => {}} />
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
