import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  CheckCircle,
  Star,
  ArrowRight
} from "lucide-react";

interface InscriptionPreviewProps {
  formData: any;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const categoriesActivite = [
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "snack", label: "🥪 Snack" },
  { value: "bar", label: "🍻 Bar" },
  { value: "epicerie", label: "🛍️ Épicerie / Supérette" },
  { value: "boulangerie", label: "🍞 Boulangerie / Pâtisserie" },
  { value: "cave", label: "🍷 Cave à vin / Spiritueux" },
  { value: "traiteur", label: "🚚 Service traiteur / Livraison" },
  { value: "loisirs", label: "🎶 Loisirs & animation" },
  { value: "autre", label: "Autre" }
];

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

export default function InscriptionPreview({ 
  formData, 
  onEdit, 
  onSubmit, 
  loading = false 
}: InscriptionPreviewProps) {
  const selectedCategory = categoriesActivite.find(cat => cat.value === formData.categorieActivite);
  const modesVente = formData.modesVente.map((mode: string) => modesVenteLabels[mode as keyof typeof modesVenteLabels] || mode);
  const besoins = formData.besoins.map((besoin: string) => besoinsLabels[besoin as keyof typeof besoinsLabels] || besoin);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Récapitulatif de votre inscription</h2>
        <p className="text-muted-foreground">
          Vérifiez vos informations avant de créer votre compte
        </p>
      </div>

      <div className="grid gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-primary" />
                Informations générales
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(1)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nom de l'entreprise</p>
                <p className="text-sm text-muted-foreground">{formData.nomEntreprise}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Catégorie d'activité</p>
                <Badge variant="secondary" className="mt-1">
                  {selectedCategory?.label || formData.categorieActivite}
                </Badge>
              </div>
            </div>
            {formData.numeroRCCM && (
              <div>
                <p className="text-sm font-medium">Numéro RCCM / NIF</p>
                <p className="text-sm text-muted-foreground">{formData.numeroRCCM}</p>
              </div>
            )}
            {formData.categorieActivite === 'autre' && formData.autreCategorie && (
              <div>
                <p className="text-sm font-medium">Activité spécifique</p>
                <p className="text-sm text-muted-foreground">{formData.autreCategorie}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coordonnées */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-primary" />
                Coordonnées
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(2)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Adresse</p>
                <p className="text-sm text-muted-foreground">{formData.adresse}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Ville / Quartier</p>
                <p className="text-sm text-muted-foreground">{formData.ville}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{formData.telephone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{formData.email}</p>
              </div>
            </div>
            {formData.siteWeb && (
              <div>
                <p className="text-sm font-medium">Site web / Réseaux sociaux</p>
                <p className="text-sm text-muted-foreground">{formData.siteWeb}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Responsable */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" />
                Contact principal
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(3)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nom & prénom</p>
                <p className="text-sm text-muted-foreground">{formData.nomResponsable}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fonction</p>
                <p className="text-sm text-muted-foreground">{formData.fonction}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{formData.telephoneResponsable}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{formData.emailResponsable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails opérationnels */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Détails opérationnels
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(4)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Nombre d'employés</p>
                <p className="text-sm text-muted-foreground">{formData.nombreEmployes}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Horaires d'ouverture</p>
                <p className="text-sm text-muted-foreground">{formData.horairesOuverture}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Modes de vente</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {modesVente.map((mode, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {mode}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Besoins principaux</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {besoins.map((besoin, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {besoin}
                  </Badge>
                ))}
              </div>
            </div>
            {formData.besoins.includes('autre') && formData.autreBesoin && (
              <div>
                <p className="text-sm font-medium">Autre besoin spécifique</p>
                <p className="text-sm text-muted-foreground">{formData.autreBesoin}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compte */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
                Compte utilisateur
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(6)}
              >
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Nom d'utilisateur</p>
              <p className="text-sm text-muted-foreground">{formData.nomUtilisateur}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email de connexion</p>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Mot de passe configuré
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avantages */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Star className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold text-primary mb-2">Avantages de votre inscription</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Accès gratuit à toutes les fonctionnalités Ebo'o Gest</li>
                <li>• Support technique dédié et formation personnalisée</li>
                <li>• Personnalisation selon votre secteur d'activité</li>
                <li>• Mises à jour automatiques et nouvelles fonctionnalités</li>
                <li>• Sauvegarde sécurisée de vos données</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={onSubmit} 
          className="btn-gradient px-8"
          disabled={loading}
        >
          {loading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Créer mon compte PME
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
