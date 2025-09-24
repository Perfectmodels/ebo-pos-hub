import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActivity } from "@/contexts/ActivityContext";
import { 
  Settings, 
  CheckCircle, 
  ArrowRight,
  Building2,
  Utensils,
  Coffee,
  Store,
  Wine,
  Truck,
  Music,
  ShoppingBag,
  Cake
} from "lucide-react";

const activityIcons = {
  restaurant: Utensils,
  snack: Store,
  bar: Coffee,
  epicerie: ShoppingBag,
  boulangerie: Cake,
  traiteur: Truck,
  loisirs: Music
};

export default function ActivitySelector() {
  const { currentActivity, setActivity, getActivityConfig } = useActivity();
  const [isOpen, setIsOpen] = useState(false);

  const activities = [
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: '🍽️',
      description: 'Service de restauration sur place',
      features: ['Réservations', 'Gestion tables', 'Menu détaillé', 'Service client'],
      color: 'bg-blue-500'
    },
    {
      id: 'snack',
      name: 'Snack',
      icon: '🥪',
      description: 'Restauration rapide et snacks',
      features: ['Menu express', 'Livraison', 'Service rapide', 'Commande en ligne'],
      color: 'bg-orange-500'
    },
    {
      id: 'bar',
      name: 'Bar',
      icon: '🍻',
      description: 'Boissons et ambiance',
      features: ['Inventaire boissons', 'Happy hour', 'Événements', 'Ambiance'],
      color: 'bg-amber-500'
    },
    {
      id: 'epicerie',
      name: 'Épicerie / Supérette',
      icon: '🛍️',
      description: 'Vente de produits alimentaires',
      features: ['Gestion produits', 'Fournisseurs', 'Inventaire', 'Prix dynamiques'],
      color: 'bg-green-500'
    },
    {
      id: 'boulangerie',
      name: 'Boulangerie / Pâtisserie',
      icon: '🍞',
      description: 'Pain et pâtisseries',
      features: ['Production', 'Recettes', 'Planification', 'Qualité'],
      color: 'bg-yellow-500'
    },
    {
      id: 'traiteur',
      name: 'Service traiteur / Livraison',
      icon: '🚚',
      description: 'Catering et livraison',
      features: ['Événements', 'Livraison', 'Catering', 'Planification'],
      color: 'bg-red-500'
    },
    {
      id: 'loisirs',
      name: 'Loisirs & Animation',
      icon: '🎶',
      description: 'Karaoké, billard, jeux',
      features: ['Réservations', 'Événements', 'Animation', 'Loisirs'],
      color: 'bg-pink-500'
    }
  ];

  const handleActivityChange = (activityId: string) => {
    const newActivity = getActivityConfig(activityId);
    setActivity(newActivity);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          {currentActivity ? (
            <>
              <span className="text-lg">{currentActivity.icon}</span>
              <span>{currentActivity.name}</span>
            </>
          ) : (
            'Sélectionner une activité'
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Configuration de votre activité
          </DialogTitle>
          <DialogDescription>
            Adaptez Ebo'o Gest à votre secteur d'activité pour une expérience personnalisée
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.id as keyof typeof activityIcons];
            const isSelected = currentActivity?.id === activity.id;
            
            return (
              <Card 
                key={activity.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => handleActivityChange(activity.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{activity.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fonctionnalités incluses :</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleActivityChange(activity.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activité sélectionnée
                      </>
                    ) : (
                      <>
                        Sélectionner
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {currentActivity && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="font-medium">Configuration actuelle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre interface est adaptée pour : <strong>{currentActivity.name}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Les fonctionnalités et l'interface ont été personnalisées selon votre secteur d'activité.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
