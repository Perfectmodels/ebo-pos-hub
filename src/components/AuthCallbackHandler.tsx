import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export default function AuthCallbackHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Vérifier les paramètres d'erreur
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          let errorMessage = 'Une erreur s\'est produite lors de l\'authentification';
          
          if (errorParam === 'access_denied') {
            if (errorDescription?.includes('otp_expired')) {
              errorMessage = 'Votre lien de confirmation a expiré. Veuillez demander un nouveau lien.';
            } else if (errorDescription?.includes('email_not_confirmed')) {
              errorMessage = 'Veuillez confirmer votre email avant de vous connecter.';
            } else {
              errorMessage = 'Accès refusé. Vérifiez vos informations de connexion.';
            }
          }
          
          setError(errorMessage);
          setLoading(false);
          return;
        }

        // Vérifier si l'utilisateur est connecté
        if (user) {
          toast({
            title: "Connexion réussie !",
            description: "Bienvenue sur Ebo'o Gest",
          });
          navigate('/dashboard');
        } else {
          // Attendre un peu pour que l'état d'authentification se mette à jour
          setTimeout(() => {
            if (!user) {
              setError('Impossible de vous connecter. Veuillez réessayer.');
              setLoading(false);
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Une erreur inattendue s\'est produite');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, user, navigate, toast]);

  const handleRetry = () => {
    navigate('/auth');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Connexion en cours...</h2>
            <p className="text-muted-foreground">
              Veuillez patienter pendant que nous vous connectons.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Erreur d'authentification</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connexion réussie !</h2>
          <p className="text-muted-foreground">
            Redirection vers votre tableau de bord...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
