import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthErrorHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error === 'access_denied' && errorDescription?.includes('otp_expired')) {
      toast({
        title: "Lien expiré",
        description: "Votre lien de connexion a expiré. Veuillez demander un nouveau lien.",
        variant: "destructive"
      });
    } else if (error === 'access_denied') {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas l'autorisation d'accéder à cette ressource.",
        variant: "destructive"
      });
    }
  }, [searchParams, toast]);

  const handleRetry = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Erreur d'authentification</CardTitle>
          <CardDescription>
            Une erreur s'est produite lors de votre tentative de connexion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Le lien de connexion a expiré ou est invalide.</p>
            <p className="mt-2">Veuillez essayer de vous connecter à nouveau.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer la connexion
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="w-full">
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
