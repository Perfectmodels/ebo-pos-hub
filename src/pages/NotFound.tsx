import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  Package, 
  Users,
  BarChart3,
  AlertTriangle
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Pages populaires pour suggestions
  const popularPages = [
    { name: "Dashboard", path: "/dashboard", icon: BarChart3, description: "Vue d'ensemble" },
    { name: "Ventes", path: "/ventes", icon: ShoppingCart, description: "Point de vente" },
    { name: "Stock", path: "/stock", icon: Package, description: "Gestion stock" },
    { name: "Personnel", path: "/personnel", icon: Users, description: "Gestion équipe" }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <Badge variant="destructive" className="ml-4">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Erreur
            </Badge>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Page introuvable
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <p className="text-sm text-muted-foreground">
            URL demandée : <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Error Details */}
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Que s'est-il passé ?
              </CardTitle>
              <CardDescription>
                Quelques raisons possibles de cette erreur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">URL incorrecte</p>
                  <p className="text-sm text-muted-foreground">Vérifiez l'orthographe de l'adresse</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Page déplacée</p>
                  <p className="text-sm text-muted-foreground">Le contenu a peut-être été réorganisé</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Lien expiré</p>
                  <p className="text-sm text-muted-foreground">Le lien que vous avez suivi n'est plus valide</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-stats">
            <CardHeader>
              <CardTitle>Que voulez-vous faire ?</CardTitle>
              <CardDescription>
                Retrouvez rapidement ce que vous cherchez
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Link to="/">
                  <Button variant="outline" className="flex-1">
                    <Home className="w-4 h-4 mr-2" />
                    Accueil
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Pages populaires :
                </p>
                <div className="grid gap-2">
                  {popularPages.map((page, index) => (
                    <Link key={index} to={page.path}>
                      <Button variant="ghost" className="w-full justify-start h-auto p-3">
                        <page.icon className="w-4 h-4 mr-3 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">{page.name}</p>
                          <p className="text-xs text-muted-foreground">{page.description}</p>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ? Contactez notre support technique
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
