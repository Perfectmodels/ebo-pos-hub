import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  Clock, 
  Settings,
  Edit,
  CheckCircle
} from "lucide-react";

interface PMEData {
  nomEntreprise: string;
  categorieActivite: string;
  autreCategorie?: string;
  adresse: string;
  ville: string;
  telephone: string;
  modesVente: string[];
  besoins: string[];
  nombreEmployes: string;
  horairesOuverture: string;
}

const activityLabels = {
  restaurant: "🍽️ Restaurant",
  snack: "🥪 Snack",
  bar: "🍻 Bar",
  epicerie: "🛍️ Épicerie / Supérette",
  boulangerie: "🍞 Boulangerie / Pâtisserie",
  traiteur: "🚚 Service traiteur / Livraison",
  loisirs: "🎶 Loisirs & Animation",
  autre: "Autre"
};

const modesVenteLabels = {
  "sur-place": "Sur place",
  "emporter": "Vente à emporter",
  "livraison": "Livraison",
  "reservation": "Réservation en ligne"
};

const besoinsLabels = {
  "ventes": "Gestion des ventes",
  "stock": "Gestion du stock",
  "reservations": "Gestion des réservations",
  "tresorerie": "Gestion de la trésorerie",
  "personnel": "Suivi du personnel",
  "autre": "Autre"
};

export default function PMEInfo() {
  const [pmeData, setPmeData] = useState<PMEData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPMEData = () => {
      try {
        const storedData = localStorage.getItem('pmeData');
        if (storedData) {
          setPmeData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données PME:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPMEData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Chargement des informations...</p>
        </CardContent>
      </Card>
    );
  }

  if (!pmeData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Aucune information PME disponible</p>
        </CardContent>
      </Card>
    );
  }

  const activityLabel = activityLabels[pmeData.categorieActivite as keyof typeof activityLabels] || pmeData.categorieActivite;
  const modesVente = pmeData.modesVente.map(mode => modesVenteLabels[mode as keyof typeof modesVenteLabels] || mode);
  const besoins = pmeData.besoins.map(besoin => besoinsLabels[besoin as keyof typeof besoinsLabels] || besoin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Informations PME</h2>
          <p className="text-muted-foreground">Vos données d'entreprise personnalisées</p>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {pmeData.nomEntreprise}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Secteur d'activité</p>
              <Badge variant="secondary" className="mt-1">
                {activityLabel}
              </Badge>
              {pmeData.autreCategorie && (
                <p className="text-sm text-muted-foreground mt-1">
                  {pmeData.autreCategorie}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre d'employés</p>
              <p className="text-sm font-medium">{pmeData.nombreEmployes}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p className="text-sm">{pmeData.adresse}</p>
              <p className="text-sm text-muted-foreground">{pmeData.ville}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p className="text-sm">{pmeData.telephone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Horaires d'ouverture</p>
            <p className="text-sm">{pmeData.horairesOuverture}</p>
          </div>
        </CardContent>
      </Card>

      {/* Modes de vente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Modes de vente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {modesVente.map((mode, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {mode}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Besoins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Besoins avec Ebo'o Gest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {besoins.map((besoin, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {besoin}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Configuration personnalisée</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Votre interface Ebo'o Gest a été adaptée selon votre secteur d'activité et vos besoins spécifiques.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Interface {activityLabel.split(' ')[1] || activityLabel}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pmeData.modesVente.length} modes de vente
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pmeData.besoins.length} fonctionnalités
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
