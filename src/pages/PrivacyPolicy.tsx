import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Politique de Confidentialité</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Introduction */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ebo'o Gest s'engage à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité 
              explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez 
              notre plateforme de gestion pour PME gabonaises.
            </p>
            <p className="text-muted-foreground">
              En utilisant nos services, vous acceptez les pratiques décrites dans cette politique de confidentialité.
            </p>
          </CardContent>
        </Card>

        {/* Informations collectées */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Informations que nous collectons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Informations personnelles :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Nom complet et coordonnées (email, téléphone, adresse)</li>
                <li>Informations de votre entreprise (nom, type d'activité, adresse)</li>
                <li>Données de facturation et de paiement</li>
                <li>Informations de connexion et préférences utilisateur</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Données d'utilisation :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Historique des connexions et sessions</li>
                <li>Données de performance et d'utilisation de la plateforme</li>
                <li>Informations sur votre navigateur et appareil</li>
                <li>Données de géolocalisation (si autorisées)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Données commerciales :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Produits et services de votre entreprise</li>
                <li>Données de ventes et de stock</li>
                <li>Informations sur vos clients (avec leur consentement)</li>
                <li>Données financières et comptables</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Utilisation des données */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Comment nous utilisons vos données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Services principaux :</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Fournir et améliorer nos services</li>
                  <li>Gérer votre compte et vos préférences</li>
                  <li>Traiter vos transactions et paiements</li>
                  <li>Générer des rapports et analyses</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Communication :</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Envoyer des notifications importantes</li>
                  <li>Fournir un support client</li>
                  <li>Partager des mises à jour de service</li>
                  <li>Envoyer des communications marketing (avec consentement)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Sécurité et conformité :</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Détecter et prévenir la fraude</li>
                <li>Respecter les obligations légales</li>
                <li>Protéger nos droits et ceux de nos utilisateurs</li>
                <li>Améliorer la sécurité de nos services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Partage des données */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Partage de vos données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers, sauf dans les cas suivants :
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Prestataires de services :</h3>
                <p className="text-muted-foreground ml-4">
                  Nous pouvons partager vos données avec des prestataires tiers de confiance qui nous aident à fournir 
                  nos services (hébergement, paiement, support technique).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Obligations légales :</h3>
                <p className="text-muted-foreground ml-4">
                  Nous pouvons divulguer vos données si la loi l'exige ou pour protéger nos droits, votre sécurité 
                  ou celle d'autrui.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Consentement :</h3>
                <p className="text-muted-foreground ml-4">
                  Nous pouvons partager vos données avec votre consentement explicite pour des services spécifiques.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Sécurité de vos données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos données :
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Protection technique :</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                  <li>Chiffrement des données au repos</li>
                  <li>Authentification à deux facteurs</li>
                  <li>Surveillance continue de la sécurité</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Mesures organisationnelles :</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Accès restreint aux données personnelles</li>
                  <li>Formation du personnel à la protection des données</li>
                  <li>Audits de sécurité réguliers</li>
                  <li>Politiques de sauvegarde sécurisées</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vos droits */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Vos droits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Vous avez les droits suivants concernant vos données personnelles :
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Droit d'accès</h3>
                  <p className="text-sm text-muted-foreground">Obtenir une copie de vos données personnelles</p>
                </div>
                <div>
                  <h3 className="font-semibold">Droit de rectification</h3>
                  <p className="text-sm text-muted-foreground">Corriger des données inexactes ou incomplètes</p>
                </div>
                <div>
                  <h3 className="font-semibold">Droit d'effacement</h3>
                  <p className="text-sm text-muted-foreground">Demander la suppression de vos données</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Droit de limitation</h3>
                  <p className="text-sm text-muted-foreground">Limiter le traitement de vos données</p>
                </div>
                <div>
                  <h3 className="font-semibold">Droit de portabilité</h3>
                  <p className="text-sm text-muted-foreground">Récupérer vos données dans un format structuré</p>
                </div>
                <div>
                  <h3 className="font-semibold">Droit d'opposition</h3>
                  <p className="text-sm text-muted-foreground">Vous opposer au traitement de vos données</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Pour exercer vos droits :</strong> Contactez-nous à privacy@ebo-gest.com ou via notre 
                formulaire de contact. Nous répondrons dans un délai de 30 jours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Cookies et technologies similaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience utilisateur :
            </p>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Cookies essentiels :</h3>
                <p className="text-muted-foreground ml-4">
                  Nécessaires au fonctionnement de la plateforme (authentification, sécurité).
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookies de performance :</h3>
                <p className="text-muted-foreground ml-4">
                  Nous aident à comprendre comment vous utilisez notre plateforme pour l'améliorer.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cookies de fonctionnalité :</h3>
                <p className="text-muted-foreground ml-4">
                  Mémorisent vos préférences pour personnaliser votre expérience.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
            </p>
          </CardContent>
        </Card>

        {/* Modifications */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle>Modifications de cette politique</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Toute modification 
              importante sera notifiée par email ou via notre plateforme. Nous vous encourageons à consulter 
              régulièrement cette page pour rester informé de nos pratiques.
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
              Si vous avez des questions concernant cette politique de confidentialité, contactez-nous :
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Email :</h3>
                <p className="text-muted-foreground">privacy@ebo-gest.com</p>
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
