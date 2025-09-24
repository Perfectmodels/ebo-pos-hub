import { useActivity } from "@/contexts/ActivityContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Truck,
  Music,
  ChefHat,
  Square,
  Zap,
  Wine
} from "lucide-react";

// Widgets spécifiques par activité
const activityWidgets = {
  restaurant: [
    {
      id: 'sales',
      title: 'Chiffre d\'Affaires',
      value: '125,000 FCFA',
      change: '+12% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'reservations',
      title: 'Réservations',
      value: '8',
      change: '3 nouvelles',
      changeType: 'positive',
      icon: Calendar,
      description: 'Ce soir'
    },
    {
      id: 'popular-dishes',
      title: 'Plat du Jour',
      value: 'Attiéké-Poisson',
      change: '15 commandes',
      changeType: 'positive',
      icon: ChefHat,
      description: 'Le plus vendu'
    },
    {
      id: 'table-status',
      title: 'Tables Occupées',
      value: '6/12',
      change: '50% occupation',
      changeType: 'neutral',
      icon: Square,
      description: 'En temps réel'
    }
  ],
  
  snack: [
    {
      id: 'sales',
      title: 'Ventes Rapides',
      value: '45,000 FCFA',
      change: '+8% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'popular-items',
      title: 'Top Vente',
      value: 'Sandwich Thon',
      change: '12 vendus',
      changeType: 'positive',
      icon: Zap,
      description: 'Le plus rapide'
    },
    {
      id: 'delivery-status',
      title: 'Livraisons',
      value: '5 en cours',
      change: '2 livrées',
      changeType: 'positive',
      icon: Truck,
      description: 'En cours'
    },
    {
      id: 'staff-performance',
      title: 'Service',
      value: '3.2 min',
      change: 'Temps moyen',
      changeType: 'neutral',
      icon: Clock,
      description: 'Par commande'
    }
  ],
  
  bar: [
    {
      id: 'sales',
      title: 'Chiffre d\'Affaires',
      value: '85,000 FCFA',
      change: '+15% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'popular-drinks',
      title: 'Boisson Top',
      value: 'Bière Flag',
      change: '8 vendues',
      changeType: 'positive',
      icon: Wine,
      description: 'La plus demandée'
    },
    {
      id: 'inventory-alerts',
      title: 'Stock Boissons',
      value: '2 alertes',
      change: 'Rupture proche',
      changeType: 'negative',
      icon: AlertTriangle,
      description: 'À réapprovisionner'
    },
    {
      id: 'staff-performance',
      title: 'Équipe',
      value: '4 présents',
      change: 'Tous présents',
      changeType: 'positive',
      icon: Users,
      description: 'Personnel actif'
    }
  ],
  
  epicerie: [
    {
      id: 'sales',
      title: 'Ventes',
      value: '95,000 FCFA',
      change: '+5% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'low-stock',
      title: 'Stock Faible',
      value: '7 produits',
      change: 'À réapprovisionner',
      changeType: 'negative',
      icon: AlertTriangle,
      description: 'Alertes actives'
    },
    {
      id: 'suppliers',
      title: 'Fournisseurs',
      value: '12 actifs',
      change: '2 livraisons',
      changeType: 'positive',
      icon: Truck,
      description: 'Aujourd\'hui'
    },
    {
      id: 'staff-performance',
      title: 'Équipe',
      value: '3 présents',
      change: 'Tous présents',
      changeType: 'positive',
      icon: Users,
      description: 'Personnel actif'
    }
  ],
  
  boulangerie: [
    {
      id: 'sales',
      title: 'Ventes',
      value: '65,000 FCFA',
      change: '+18% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'production-plan',
      title: 'Production',
      value: '85% terminée',
      change: 'Plan du jour',
      changeType: 'positive',
      icon: ChefHat,
      description: 'Avancement'
    },
    {
      id: 'popular-items',
      title: 'Top Vente',
      value: 'Pain de Mie',
      change: '25 vendus',
      changeType: 'positive',
      icon: Star,
      description: 'Le plus demandé'
    },
    {
      id: 'staff-performance',
      title: 'Équipe',
      value: '5 présents',
      change: 'Tous présents',
      changeType: 'positive',
      icon: Users,
      description: 'Personnel actif'
    }
  ],
  
  traiteur: [
    {
      id: 'sales',
      title: 'Chiffre d\'Affaires',
      value: '150,000 FCFA',
      change: '+25% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'delivery-status',
      title: 'Livraisons',
      value: '8 en cours',
      change: '3 livrées',
      changeType: 'positive',
      icon: Truck,
      description: 'En cours'
    },
    {
      id: 'events',
      title: 'Événements',
      value: '3 aujourd\'hui',
      change: '1 terminé',
      changeType: 'positive',
      icon: Calendar,
      description: 'Planifiés'
    },
    {
      id: 'staff-performance',
      title: 'Équipe',
      value: '6 présents',
      change: 'Tous présents',
      changeType: 'positive',
      icon: Users,
      description: 'Personnel actif'
    }
  ],
  
  loisirs: [
    {
      id: 'sales',
      title: 'Ventes',
      value: '75,000 FCFA',
      change: '+22% vs hier',
      changeType: 'positive',
      icon: DollarSign,
      description: 'Aujourd\'hui'
    },
    {
      id: 'bookings',
      title: 'Réservations',
      value: '12 actives',
      change: '4 nouvelles',
      changeType: 'positive',
      icon: Calendar,
      description: 'En cours'
    },
    {
      id: 'events',
      title: 'Événements',
      value: '2 ce soir',
      change: 'Karaoké + Billard',
      changeType: 'positive',
      icon: Music,
      description: 'Programmés'
    },
    {
      id: 'staff-performance',
      title: 'Équipe',
      value: '4 présents',
      change: 'Tous présents',
      changeType: 'positive',
      icon: Users,
      description: 'Personnel actif'
    }
  ]
};

export default function AdaptiveDashboard() {
  const { currentActivity, isFeatureEnabled } = useActivity();

  if (!currentActivity) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Veuillez sélectionner votre type d'activité pour personnaliser votre tableau de bord.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const widgets = activityWidgets[currentActivity.id as keyof typeof activityWidgets] || activityWidgets.restaurant;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de bord {currentActivity.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            Interface adaptée pour votre secteur d'activité
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentActivity.icon}</span>
          <Badge variant="secondary" className="text-sm">
            {currentActivity.name}
          </Badge>
        </div>
      </div>

      {/* Activity-specific widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => {
          const Icon = widget.icon;
          return (
            <Card key={widget.id} className="card-stats">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{widget.title}</p>
                    <p className="text-2xl font-bold">{widget.value}</p>
                    <p className={`text-sm ${
                      widget.changeType === 'positive' ? 'text-green-600' :
                      widget.changeType === 'negative' ? 'text-red-600' :
                      'text-muted-foreground'
                    }`}>
                      {widget.change}
                    </p>
                  </div>
                  <Icon className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity-specific features */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Fonctionnalités essentielles pour votre activité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentActivity.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{feature}</span>
                </div>
                <Button variant="outline" size="sm">
                  Accéder
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activity Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{currentActivity.icon}</span>
              Configuration {currentActivity.name}
            </CardTitle>
            <CardDescription>
              Paramètres adaptés à votre secteur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Fonctionnalités activées :</p>
              <div className="flex flex-wrap gap-2">
                {currentActivity.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Paramètres par défaut :</p>
              <div className="space-y-2">
                {Object.entries(currentActivity.defaultSettings).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
