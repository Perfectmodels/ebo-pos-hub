import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Mail, 
  ArrowRight, 
  Sparkles,
  Globe,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

interface WelcomeMessageProps {
  userName: string;
  businessName: string;
  businessType: string;
  email: string;
  onContinue: () => void;
}

export default function WelcomeMessage({ 
  userName, 
  businessName, 
  businessType, 
  email, 
  onContinue 
}: WelcomeMessageProps) {
  const getBusinessIcon = (type: string) => {
    const icons: Record<string, string> = {
      restaurant: '🍽️',
      bar: '🍻',
      cafe: '☕',
      snack: '🥪',
      epicerie: '🛒',
      hotel: '🏨',
      pharmacie: '💊',
      supermarche: '🏪'
    };
    return icons[type] || '🏪';
  };

  const getBusinessFeatures = (type: string) => {
    const features: Record<string, string[]> = {
      restaurant: [
        'Gestion des commandes en temps réel',
        'Suivi des tables et réservations',
        'Gestion des stocks de produits frais',
        'Rapports de rentabilité par plat'
      ],
      bar: [
        'Gestion des boissons et cocktails',
        'Suivi des stocks d\'alcool',
        'Gestion des happy hours',
        'Rapports de consommation'
      ],
      cafe: [
        'Gestion des boissons chaudes et froides',
        'Suivi des pâtisseries',
        'Gestion des stocks de café et thé',
        'Rapports de ventes par période'
      ],
      snack: [
        'Gestion rapide des commandes',
        'Suivi des stocks de produits',
        'Gestion des plats à emporter',
        'Rapports de performance'
      ]
    };
    return features[type] || features.restaurant;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Message de bienvenue principal */}
        <Card className="card-stats mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500 mr-4" />
              <div>
                <CardTitle className="text-2xl text-foreground">
                  Félicitations {userName} ! 🎉
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Votre compte a été créé avec succès
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="secondary" className="mb-4">
              {getBusinessIcon(businessType)} {businessType.toUpperCase()}
            </Badge>
            <p className="text-lg font-medium text-foreground mb-2">
              {businessName}
            </p>
            <p className="text-muted-foreground">
              Bienvenue dans l'écosystème Ebo'o Gest pour les PME gabonaises
            </p>
          </CardContent>
        </Card>

        {/* Information sur l'email */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary" />
              Email de bienvenue envoyé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">
                    Un email de bienvenue a été envoyé à :
                  </p>
                  <p className="text-green-700 font-mono text-sm mt-1">
                    {email}
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Vérifiez votre boîte de réception (et vos spams) pour découvrir :
                  </p>
                  <ul className="text-green-600 text-sm mt-2 list-disc list-inside">
                    <li>Guide de démarrage personnalisé</li>
                    <li>Fonctionnalités spécifiques à votre activité</li>
                    <li>Conseils pour optimiser votre gestion</li>
                    <li>Informations sur le support gabonais</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fonctionnalités pour votre activité */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-primary" />
              Fonctionnalités pour votre {businessType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getBusinessFeatures(businessType).map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-primary mr-3" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prochaines étapes */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-primary" />
              Prochaines étapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">1. Accéder à votre tableau de bord</p>
                  <p className="text-sm text-blue-700">Explorez l'interface et familiarisez-vous avec les fonctionnalités</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium text-green-900">2. Ajouter vos employés</p>
                  <p className="text-sm text-green-700">Créez les profils de votre équipe avec les rôles appropriés</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-500 mr-3" />
                <div>
                  <p className="font-medium text-purple-900">3. Configurer vos produits</p>
                  <p className="text-sm text-purple-700">Ajoutez vos produits et configurez vos prix</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <Settings className="w-5 h-5 text-orange-500 mr-3" />
                <div>
                  <p className="font-medium text-orange-900">4. Personnaliser les paramètres</p>
                  <p className="text-sm text-orange-700">Adaptez l'interface à vos besoins spécifiques</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support gabonais */}
        <Card className="card-stats mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              🇬🇦 Support gabonais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">📧 Email</h4>
                <p className="text-sm text-muted-foreground">support@ebo-gest.com</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">📞 Téléphone</h4>
                <p className="text-sm text-muted-foreground">+241 01 23 45 67</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">📍 Localisation</h4>
                <p className="text-sm text-muted-foreground">Libreville, Gabon</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">⏰ Horaires</h4>
                <p className="text-sm text-muted-foreground">Lun-Ven: 8h-18h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de continuation */}
        <div className="text-center">
          <Button 
            onClick={onContinue}
            className="btn-gradient px-8 py-3 text-lg"
            size="lg"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Commencer avec Ebo'o Gest
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Vous pouvez toujours revenir à cette page depuis les paramètres
          </p>
        </div>
      </div>
    </div>
  );
}
