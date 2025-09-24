import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEmailNotifications } from "@/hooks/useEmailNotifications";
import { 
  Building2, 
  MapPin, 
  User, 
  Users, 
  Clock, 
  Upload, 
  CheckCircle,
  ArrowLeft,
  Star,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

// Schéma de validation
const inscriptionSchema = z.object({
  // Informations générales
  nomEntreprise: z.string().min(2, "Le nom de l'entreprise est requis"),
  numeroRCCM: z.string().optional(),
  categorieActivite: z.string().min(1, "Veuillez sélectionner une catégorie"),
  autreCategorie: z.string().optional(),
  
  // Coordonnées
  adresse: z.string().min(5, "L'adresse est requise"),
  ville: z.string().min(2, "La ville est requise"),
  telephone: z.string().min(8, "Le téléphone est requis"),
  email: z.string().email("Email invalide"),
  siteWeb: z.string().optional(),
  
  // Responsable
  nomResponsable: z.string().min(2, "Le nom du responsable est requis"),
  fonction: z.string().min(2, "La fonction est requise"),
  telephoneResponsable: z.string().min(8, "Le téléphone du responsable est requis"),
  emailResponsable: z.string().email("Email du responsable invalide"),
  
  // Détails opérationnels
  nombreEmployes: z.string().min(1, "Veuillez sélectionner le nombre d'employés"),
  horairesOuverture: z.string().min(1, "Les horaires sont requis"),
  modesVente: z.array(z.string()).min(1, "Sélectionnez au moins un mode de vente"),
  besoins: z.array(z.string()).min(1, "Sélectionnez au moins un besoin"),
  autreBesoin: z.string().optional(),
  
  // Compte
  nomUtilisateur: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmationMotDePasse: z.string(),
  accepteCGU: z.boolean().refine(val => val === true, "Vous devez accepter les CGU")
}).refine(data => data.motDePasse === data.confirmationMotDePasse, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmationMotDePasse"]
});

const categoriesActivite = [
  { value: "restaurant", label: "🍽️ Restaurant", description: "Service de restauration sur place" },
  { value: "snack", label: "🥪 Snack", description: "Restauration rapide" },
  { value: "bar", label: "🍻 Bar", description: "Boissons et snacks" },
  { value: "epicerie", label: "🛍️ Épicerie / Supérette", description: "Vente de produits alimentaires" },
  { value: "boulangerie", label: "🍞 Boulangerie / Pâtisserie", description: "Pain et pâtisseries" },
  { value: "cave", label: "🍷 Cave à vin / Spiritueux", description: "Vente de boissons alcoolisées" },
  { value: "traiteur", label: "🚚 Service traiteur / Livraison", description: "Catering et livraison" },
  { value: "loisirs", label: "🎶 Loisirs & animation", description: "Karaoké, billard, etc." },
  { value: "autre", label: "Autre", description: "Autre activité" }
];

const nombreEmployesOptions = [
  { value: "1-3", label: "1-3 employés" },
  { value: "4-10", label: "4-10 employés" },
  { value: "11-25", label: "11-25 employés" },
  { value: "26-50", label: "26-50 employés" },
  { value: "50+", label: "Plus de 50 employés" }
];

const modesVenteOptions = [
  { value: "sur-place", label: "Sur place" },
  { value: "emporter", label: "Vente à emporter" },
  { value: "livraison", label: "Livraison" },
  { value: "reservation", label: "Réservation en ligne" }
];

const besoinsOptions = [
  { value: "ventes", label: "Gestion des ventes" },
  { value: "stock", label: "Gestion du stock" },
  { value: "reservations", label: "Gestion des réservations" },
  { value: "tresorerie", label: "Gestion de la trésorerie" },
  { value: "personnel", label: "Suivi du personnel" },
  { value: "autre", label: "Autre" }
];

export default function InscriptionPME() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { notifyNewPMERegistration, getAdminEmails } = useEmailNotifications();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Informations générales
    nomEntreprise: "",
    numeroRCCM: "",
    categorieActivite: "",
    autreCategorie: "",
    
    // Coordonnées
    adresse: "",
    ville: "",
    telephone: "",
    email: "",
    siteWeb: "",
    
    // Responsable
    nomResponsable: "",
    fonction: "",
    telephoneResponsable: "",
    emailResponsable: "",
    
    // Détails opérationnels
    nombreEmployes: "",
    horairesOuverture: "",
    modesVente: [] as string[],
    besoins: [] as string[],
    autreBesoin: "",
    
    // Compte
    nomUtilisateur: "",
    motDePasse: "",
    confirmationMotDePasse: "",
    accepteCGU: false
  });

  const totalSteps = 6;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Validation du formulaire
      const validatedData = inscriptionSchema.parse(formData);
      
      // Création du compte
      const { error } = await signUp(validatedData.email, validatedData.motDePasse);
      
      if (error) {
        throw new Error(error.message);
      }

      // Sauvegarder l'activité sélectionnée
      localStorage.setItem('userActivity', validatedData.categorieActivite);
      localStorage.setItem('userActivityCustom', validatedData.autreCategorie || '');
      
          // Sauvegarder les données PME pour personnalisation
          const pmeData = {
            nomEntreprise: validatedData.nomEntreprise,
            categorieActivite: validatedData.categorieActivite,
            autreCategorie: validatedData.autreCategorie,
            adresse: validatedData.adresse,
            ville: validatedData.ville,
            telephone: validatedData.telephone,
            modesVente: validatedData.modesVente,
            besoins: validatedData.besoins,
            nombreEmployes: validatedData.nombreEmployes,
            horairesOuverture: validatedData.horairesOuverture
          };

          localStorage.setItem('pmeData', JSON.stringify(pmeData));

          // Envoyer notification email aux administrateurs
          try {
            const adminEmails = await getAdminEmails();
            if (adminEmails.length > 0) {
              await notifyNewPMERegistration(validatedData, adminEmails);
            }
          } catch (error) {
            console.error('Erreur envoi notification:', error);
            // Ne pas bloquer l'inscription si l'email échoue
          }

          toast({
            title: "Inscription réussie !",
            description: "Votre compte PME a été créé avec succès. Vérifiez votre email pour confirmer votre compte.",
          });

          navigate('/dashboard');
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur d'inscription",
          description: error instanceof Error ? error.message : "Une erreur s'est produite",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Informations générales</h2>
              <p className="text-muted-foreground">Dites-nous en plus sur votre entreprise</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nomEntreprise">Nom de l'entreprise *</Label>
                <Input
                  id="nomEntreprise"
                  value={formData.nomEntreprise}
                  onChange={(e) => handleInputChange('nomEntreprise', e.target.value)}
                  placeholder="Ex: Restaurant Le Bon Goût"
                />
              </div>

              <div>
                <Label htmlFor="numeroRCCM">Numéro RCCM / NIF (optionnel)</Label>
                <Input
                  id="numeroRCCM"
                  value={formData.numeroRCCM}
                  onChange={(e) => handleInputChange('numeroRCCM', e.target.value)}
                  placeholder="Ex: CI-ABJ-2024-A-12345"
                />
              </div>

              <div>
                <Label>Catégorie d'activité *</Label>
                <Select value={formData.categorieActivite} onValueChange={(value) => handleInputChange('categorieActivite', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre secteur d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesActivite.map((categorie) => (
                      <SelectItem key={categorie.value} value={categorie.value}>
                        <div className="flex flex-col">
                          <span>{categorie.label}</span>
                          <span className="text-xs text-muted-foreground">{categorie.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.categorieActivite === 'autre' && (
                <div>
                  <Label htmlFor="autreCategorie">Précisez votre activité</Label>
                  <Input
                    id="autreCategorie"
                    value={formData.autreCategorie}
                    onChange={(e) => handleInputChange('autreCategorie', e.target.value)}
                    placeholder="Décrivez votre activité"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Coordonnées de l'entreprise</h2>
              <p className="text-muted-foreground">Où se trouve votre établissement ?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Textarea
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleInputChange('adresse', e.target.value)}
                  placeholder="Rue, avenue, boulevard..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ville">Ville / Quartier *</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Ex: Abidjan, Cocody"
                  />
                </div>

                <div>
                  <Label htmlFor="telephone">Téléphone professionnel *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => handleInputChange('telephone', e.target.value)}
                    placeholder="+225 XX XX XX XX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail professionnel *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@votre-entreprise.ci"
                  />
                </div>

                <div>
                  <Label htmlFor="siteWeb">Site web / Réseaux sociaux (optionnel)</Label>
                  <Input
                    id="siteWeb"
                    value={formData.siteWeb}
                    onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                    placeholder="www.votre-site.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Responsable / Contact principal</h2>
              <p className="text-muted-foreground">Qui sera le contact principal ?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nomResponsable">Nom & prénom *</Label>
                <Input
                  id="nomResponsable"
                  value={formData.nomResponsable}
                  onChange={(e) => handleInputChange('nomResponsable', e.target.value)}
                  placeholder="Ex: Jean Kouassi"
                />
              </div>

              <div>
                <Label htmlFor="fonction">Fonction *</Label>
                <Input
                  id="fonction"
                  value={formData.fonction}
                  onChange={(e) => handleInputChange('fonction', e.target.value)}
                  placeholder="Ex: Gérant, Directeur, Responsable"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telephoneResponsable">Numéro de téléphone *</Label>
                  <Input
                    id="telephoneResponsable"
                    type="tel"
                    value={formData.telephoneResponsable}
                    onChange={(e) => handleInputChange('telephoneResponsable', e.target.value)}
                    placeholder="+225 XX XX XX XX"
                  />
                </div>

                <div>
                  <Label htmlFor="emailResponsable">E-mail *</Label>
                  <Input
                    id="emailResponsable"
                    type="email"
                    value={formData.emailResponsable}
                    onChange={(e) => handleInputChange('emailResponsable', e.target.value)}
                    placeholder="jean@votre-entreprise.ci"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Détails opérationnels</h2>
              <p className="text-muted-foreground">Parlez-nous de votre activité</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Nombre d'employés *</Label>
                <Select value={formData.nombreEmployes} onValueChange={(value) => handleInputChange('nombreEmployes', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le nombre d'employés" />
                  </SelectTrigger>
                  <SelectContent>
                    {nombreEmployesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="horairesOuverture">Horaires d'ouverture *</Label>
                <Input
                  id="horairesOuverture"
                  value={formData.horairesOuverture}
                  onChange={(e) => handleInputChange('horairesOuverture', e.target.value)}
                  placeholder="Ex: 7h00 - 22h00 (Lun-Dim)"
                />
              </div>

              <div>
                <Label>Modes de vente utilisés *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {modesVenteOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.modesVente.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('modesVente', option.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Besoins principaux avec Ebo'o Gest *</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {besoinsOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.value}
                        checked={formData.besoins.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('besoins', option.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.besoins.includes('autre') && (
                <div>
                  <Label htmlFor="autreBesoin">Précisez votre besoin</Label>
                  <Input
                    id="autreBesoin"
                    value={formData.autreBesoin}
                    onChange={(e) => handleInputChange('autreBesoin', e.target.value)}
                    placeholder="Décrivez votre besoin spécifique"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Documents (optionnel)</h2>
              <p className="text-muted-foreground">Partagez vos documents pour une meilleure personnalisation</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Logo de l'entreprise</p>
                <Button variant="outline" size="sm">
                  Télécharger une image
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Formats acceptés: JPG, PNG (max 2MB)
                </p>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Licence d'exploitation</p>
                <Button variant="outline" size="sm">
                  Télécharger un document
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Formats acceptés: PDF, JPG (max 5MB)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note :</strong> Ces documents sont optionnels mais nous aident à mieux comprendre votre activité et à personnaliser votre expérience Ebo'o Gest.
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Création du compte</h2>
              <p className="text-muted-foreground">Créez vos identifiants de connexion</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nomUtilisateur">Nom d'utilisateur *</Label>
                <Input
                  id="nomUtilisateur"
                  value={formData.nomUtilisateur}
                  onChange={(e) => handleInputChange('nomUtilisateur', e.target.value)}
                  placeholder="Ex: restaurant-bon-gout"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ce nom sera utilisé pour vous identifier sur la plateforme
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motDePasse">Mot de passe *</Label>
                  <Input
                    id="motDePasse"
                    type="password"
                    value={formData.motDePasse}
                    onChange={(e) => handleInputChange('motDePasse', e.target.value)}
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmationMotDePasse">Confirmation mot de passe *</Label>
                  <Input
                    id="confirmationMotDePasse"
                    type="password"
                    value={formData.confirmationMotDePasse}
                    onChange={(e) => handleInputChange('confirmationMotDePasse', e.target.value)}
                    placeholder="Répétez votre mot de passe"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="accepteCGU"
                    checked={formData.accepteCGU}
                    onCheckedChange={(checked) => handleInputChange('accepteCGU', checked)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="accepteCGU" className="text-sm">
                      J'accepte les conditions générales d'utilisation et la politique de confidentialité de Ebo'o Gest *
                    </Label>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Star className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-primary">Avantages de votre inscription :</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>• Accès gratuit à toutes les fonctionnalités</li>
                        <li>• Support technique dédié</li>
                        <li>• Formation personnalisée selon votre secteur</li>
                        <li>• Mises à jour automatiques</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-bold text-primary">Ebo'o Gest</h1>
              <Badge variant="secondary" className="ml-2">
                <Star className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Inscription PME - Étape {currentStep} sur {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progression</span>
            <span className="text-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="card-stats">
          <CardHeader>
            <CardTitle className="text-center">
              {currentStep === 1 && "Informations générales"}
              {currentStep === 2 && "Coordonnées de l'entreprise"}
              {currentStep === 3 && "Responsable / Contact principal"}
              {currentStep === 4 && "Détails opérationnels"}
              {currentStep === 5 && "Documents (optionnel)"}
              {currentStep === 6 && "Création du compte"}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 1 && "Dites-nous en plus sur votre entreprise"}
              {currentStep === 2 && "Où se trouve votre établissement ?"}
              {currentStep === 3 && "Qui sera le contact principal ?"}
              {currentStep === 4 && "Parlez-nous de votre activité"}
              {currentStep === 5 && "Partagez vos documents pour une meilleure personnalisation"}
              {currentStep === 6 && "Créez vos identifiants de connexion"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="btn-gradient">
                  Suivant
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="btn-gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Créer mon compte
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ? <Link to="/auth" className="text-primary hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
