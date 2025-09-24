import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EboLogo from "@/components/EboLogo";
import { 
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Utensils,
  Coffee,
  Truck,
  Store
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Gestion des Ventes",
      description: "Interface caisse moderne avec paiement multi-modes (Cash, Mobile Money, Carte)"
    },
    {
      icon: Package,
      title: "Suivi du Stock",
      description: "Gestion complète avec alertes de rupture et scan QR/Code-barres"
    },
    {
      icon: Users,
      title: "Gestion Personnel",
      description: "Comptes utilisateurs, suivi des ventes par employé et planning"
    },
    {
      icon: BarChart3,
      title: "Rapports Avancés",
      description: "Analyses détaillées avec export Excel/PDF et graphiques interactifs"
    }
  ];

  const businessTypes = [
    { icon: Utensils, name: "Restaurants" },
    { icon: Coffee, name: "Cafés & Bars" },
    { icon: Store, name: "Snacks & Fast-food" },
    { icon: Truck, name: "Food Trucks" }
  ];

  const benefits = [
    "Interface intuitive et moderne",
    "Rapports en temps réel",
    "Multi-activités en un seul outil",
    "Gestion multi-utilisateurs",
    "Sauvegarde automatique",
    "Accessible partout"
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <EboLogo size="md" variant="minimal" />
              <Badge variant="secondary" className="ml-2">Pro</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact">
                <Button variant="ghost">Support</Button>
              </Link>
              <Link to="/admin-login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Admin
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/inscription">
                <Button className="btn-gradient">Inscription PME</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-1" />
              Solution Complète PME
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Gérez votre business
              <span className="block text-primary">en toute simplicité</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Ebo'o Gest est la solution de gestion multi-activités conçue spécialement pour les PME africaines. 
              Restaurants, bars, cafés, snacks - centralisez tout en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription">
                <Button size="lg" className="btn-gradient">
                  Inscription PME
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Adapté à votre activité
            </h2>
            <p className="text-muted-foreground">
              Une solution flexible qui s'adapte à tous types d'établissements
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {businessTypes.map((type, index) => (
              <Card key={index} className="text-center hover:shadow-primary/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <type.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">{type.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des fonctionnalités puissantes et intuitives pour gérer efficacement 
              votre établissement du quotidien aux rapports avancés.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Pourquoi choisir Ebo'o Gest ?
              </h2>
              <p className="text-muted-foreground mb-8">
                Développé spécialement pour répondre aux besoins des PME africaines, 
                avec une interface en français et des fonctionnalités adaptées au marché local.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="card-stats">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Dashboard en Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CA Aujourd'hui</span>
                      <span className="font-bold text-primary">125,000 FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Commandes</span>
                      <span className="font-bold text-foreground">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Produits Actifs</span>
                      <span className="font-bold text-foreground">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez les centaines d'établissements qui font déjà confiance à Ebo'o Gest
          </p>
          <Link to="/inscription">
            <Button size="lg" className="btn-gradient">
              Commencer Maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-xl font-bold text-primary">Ebo'o Gest</h3>
            <Badge variant="secondary" className="ml-2">Pro</Badge>
          </div>
          <p className="text-muted-foreground">
            © 2024 Ebo'o Gest. Solution de gestion pour PME africaines.
          </p>
        </div>
      </footer>
    </div>
  );
}