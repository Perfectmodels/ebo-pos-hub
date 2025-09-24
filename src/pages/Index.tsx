import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  ArrowRight, 
  Star,
  BarChart3
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers la page d'accueil après 3 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="card-stats">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-bold text-primary">Ebo'o Gest</h1>
              <Badge variant="secondary" className="ml-2">
                <Star className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
            <CardTitle>Redirection en cours...</CardTitle>
            <CardDescription>
              Vous allez être redirigé vers la page d'accueil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            
            {/* Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Redirection automatique dans quelques secondes...
              </p>
              <p className="text-xs text-muted-foreground">
                Ou cliquez sur le bouton ci-dessous pour accéder immédiatement
              </p>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleRedirect}
              className="w-full btn-gradient"
            >
              <Home className="w-4 h-4 mr-2" />
              Aller à l'accueil
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Footer */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Solution de gestion PME africaines
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
