import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, User, Building, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Conditions d'Utilisation</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Introduction */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Bienvenue sur Ebo'o Gest, la plateforme de gestion complète pour PME gabonaises. Ces conditions d'utilisation 
              régissent votre utilisation de notre service et constituent un accord légal entre vous et Ebo'o Gest.
            </p>
            <p className="text-muted-foreground">
              En accédant ou en utilisant notre plateforme, vous acceptez d'être lié par ces conditions d'utilisation. 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </p>
          </CardContent>
        </Card>

        {/* Définitions */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Définitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">"Service" ou "Plateforme"</h3>
                <p className="text-sm text-muted-foreground">
                  Ebo'o Gest, notre solution de gestion pour PME accessible via nos applications web et mobiles.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">"Utilisateur" ou "Vous"</h3>
                <p className="text-sm text-muted-foreground">
                  Toute personne physique ou morale utilisant nos services.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">"Compte"</h3>
                <p className="text-sm text-muted-foreground">
                  Votre profil utilisateur et l'accès aux fonctionnalités de la plateforme.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">"Contenu"</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes les données, informations et fichiers que vous téléchargez ou créez.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptation des conditions */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Acceptation des Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              En créant un compte ou en utilisant nos services, vous déclarez et garantissez que :
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Vous avez au moins 18 ans ou l'âge légal dans votre juridiction</li>
              <li>Vous avez la capacité légale de conclure cet accord</li>
              <li>Vous fournissez des informations exactes et complètes</li>
              <li>Vous maintiendrez la sécurité de votre compte et de vos identifiants</li>
              <li>Vous êtes responsable de toutes les activités sous votre compte</li>
            </ul>
          </CardContent>
        </Card>

        {/* Utilisation du service */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Utilisation du Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Utilisation autorisée :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Gestion de votre entreprise et de vos données commerciales</li>
                <li>Utilisation des fonctionnalités de vente, stock et rapports</li>
                <li>Gestion de votre personnel et de vos clients</li>
                <li>Accès aux outils d'analyse et de reporting</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Utilisation interdite :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Violation de toute loi ou réglementation applicable</li>
                <li>Transmission de contenu illégal, nuisible ou offensant</li>
                <li>Tentative de piratage ou d'accès non autorisé</li>
                <li>Utilisation du service pour des activités frauduleuses</li>
                <li>Copie ou reproduction non autorisée du service</li>
                <li>Interférence avec le fonctionnement du service</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Compte utilisateur */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Compte Utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Création de compte :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Vous devez fournir des informations exactes et à jour</li>
                <li>Vous êtes responsable de la sécurité de vos identifiants</li>
                <li>Vous devez notifier immédiatement toute utilisation non autorisée</li>
                <li>Un seul compte par entreprise est autorisé</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Suspension et résiliation :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Nous pouvons suspendre votre compte en cas de violation</li>
                <li>Vous pouvez résilier votre compte à tout moment</li>
                <li>La résiliation n'annule pas les obligations de paiement</li>
                <li>Nous pouvons conserver certaines données selon la loi</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tarification et paiement */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Tarification et Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Tarifs :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Les tarifs sont affichés en francs CFA (FCFA)</li>
                <li>Les prix peuvent être modifiés avec un préavis de 30 jours</li>
                <li>Les taxes applicables sont incluses dans le prix affiché</li>
                <li>Des frais de service peuvent s'appliquer selon le mode de paiement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Paiement :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Le paiement est requis à l'avance pour les services payants</li>
                <li>Les paiements sont traités de manière sécurisée</li>
                <li>Les remboursements sont soumis à notre politique de remboursement</li>
                <li>En cas de non-paiement, l'accès au service peut être suspendu</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Propriété intellectuelle */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Propriété Intellectuelle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Nos droits :</h3>
              <p className="text-muted-foreground ml-4">
                Ebo'o Gest détient tous les droits de propriété intellectuelle sur la plateforme, 
                y compris les logiciels, designs, marques et contenus.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Vos droits :</h3>
              <p className="text-muted-foreground ml-4">
                Vous conservez tous les droits sur vos données et contenus. En utilisant nos services, 
                vous nous accordez une licence limitée pour traiter vos données selon nos services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Respect des droits :</h3>
              <p className="text-muted-foreground ml-4">
                Vous ne pouvez pas copier, modifier, distribuer ou créer des œuvres dérivées 
                de notre plateforme sans autorisation écrite.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation de responsabilité */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Limitation de Responsabilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Disponibilité du service :</h3>
              <p className="text-muted-foreground ml-4">
                Nous nous efforçons de maintenir une disponibilité de 99.9%, mais nous ne garantissons pas 
                une disponibilité continue du service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limitations :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Nous ne sommes pas responsables des pertes de données dues à des erreurs utilisateur</li>
                <li>Notre responsabilité est limitée au montant payé pour nos services</li>
                <li>Nous excluons les dommages indirects et les pertes de profits</li>
                <li>Nous ne garantissons pas l'exactitude des données fournies par des tiers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Indemnisation */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Indemnisation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous acceptez d'indemniser et de dégager Ebo'o Gest de toute responsabilité concernant 
              les réclamations, pertes, dommages, coûts et dépenses (y compris les honoraires d'avocat) 
              résultant de votre utilisation du service ou de votre violation de ces conditions.
            </p>
          </CardContent>
        </Card>

        {/* Résiliation */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Résiliation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Par vous :</h3>
              <p className="text-muted-foreground ml-4">
                Vous pouvez résilier votre compte à tout moment en nous contactant ou via les paramètres de votre compte.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Par nous :</h3>
              <p className="text-muted-foreground ml-4">
                Nous pouvons suspendre ou résilier votre compte en cas de violation de ces conditions, 
                avec ou sans préavis selon la gravité de la violation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Effets de la résiliation :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>L'accès à votre compte sera immédiatement suspendu</li>
                <li>Vous pourrez récupérer vos données dans un délai de 30 jours</li>
                <li>Les obligations de paiement restent en vigueur</li>
                <li>Les clauses de confidentialité et d'indemnisation survivent à la résiliation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Loi applicable */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Loi Applicable et Juridiction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ces conditions d'utilisation sont régies par les lois de la République Gabonaise. 
              Tout litige sera soumis à la juridiction exclusive des tribunaux de Libreville, Gabon.
            </p>
            <p className="text-muted-foreground">
              En cas de conflit entre ces conditions et la législation gabonaise, 
              la législation gabonaise prévaudra.
            </p>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Modifications des Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. 
              Les modifications importantes seront notifiées par email ou via la plateforme avec un préavis de 30 jours. 
              Votre utilisation continue du service après les modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Pour toute question concernant ces conditions d'utilisation, contactez-nous :
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Email :</h3>
                <p className="text-muted-foreground">legal@ebo-gest.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Téléphone :</h3>
                <p className="text-muted-foreground">+241 74 06 64 61</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Adresse :</h3>
                <p className="text-muted-foreground">Libreville, Gabon</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Support :</h3>
                <p className="text-muted-foreground">Asseko19@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <Link to="/">
            <Button className="btn-gradient">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
