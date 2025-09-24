import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3,
  ArrowRight,
  Star,
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyDashboard() {
  const quickActions = [
    {
      title: "Ajouter des produits",
      description: "Commencez par ajouter vos produits en stock",
      icon: Package,
      link: "/stock",
      color: "bg-blue-500"
    },
    {
      title: "Gérer le personnel",
      description: "Ajoutez vos employés pour le suivi",
      icon: Users,
      link: "/personnel",
      color: "bg-green-500"
    },
    {
      title: "Effectuer une vente",
      description: "Testez le point de vente",
      icon: ShoppingCart,
      link: "/ventes",
      color: "bg-purple-500"
    },
    {
      title: "Voir les rapports",
      description: "Découvrez vos analyses",
      icon: BarChart3,
      link: "/rapports",
      color: "bg-orange-500"
    }
  ];

  const tips = [
    {
      icon: Lightbulb,
      title: "Conseil",
      description: "Commencez par ajouter vos produits les plus vendus"
    },
    {
      icon: Target,
      title: "Objectif",
      description: "Configurez votre équipe pour un meilleur suivi"
    },
    {
      icon: Zap,
      title: "Astuce",
      description: "Utilisez le scanner QR pour ajouter rapidement des produits"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Bienvenue sur Ebo'o Gest ! 🎉
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Votre tableau de bord est vide. Commencez par configurer votre activité.
        </p>
        <Badge variant="secondary" className="text-sm">
          Nouvel utilisateur
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link to={action.link}>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Conseils pour bien commencer
          </CardTitle>
          <CardDescription>
            Suivez ces étapes pour optimiser votre utilisation d'Ebo'o Gest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <tip.icon className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Guide de démarrage</CardTitle>
          <CardDescription>
            Suivez ces étapes pour configurer votre activité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Ajoutez vos produits</h4>
                <p className="text-sm text-muted-foreground">
                  Commencez par ajouter vos produits les plus importants
                </p>
              </div>
              <Link to="/stock">
                <Button size="sm">Ajouter</Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Configurez votre équipe</h4>
                <p className="text-sm text-muted-foreground">
                  Ajoutez vos employés pour le suivi des performances
                </p>
              </div>
              <Link to="/personnel">
                <Button size="sm">Configurer</Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Effectuez votre première vente</h4>
                <p className="text-sm text-muted-foreground">
                  Testez le point de vente avec une vente d'essai
                </p>
              </div>
              <Link to="/ventes">
                <Button size="sm">Vendre</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
