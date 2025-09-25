import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Clock, 
  RefreshCw,
  ArrowRight,
  Users,
  Package,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import EboLogo from '@/components/EboLogo';

export default function ConfirmSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        setStatus('loading');
        
        // Vérifier les paramètres d'erreur
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          if (error === 'access_denied' && errorDescription?.includes('otp_expired')) {
            setStatus('expired');
            setMessage('Votre lien de confirmation a expiré. Veuillez demander un nouveau lien.');
          } else {
            setStatus('error');
            setMessage('Une erreur s\'est produite lors de la confirmation de votre compte.');
          }
          return;
        }

        // Vérifier si l'utilisateur est connecté
        if (user) {
          setStatus('success');
          setMessage('Votre compte a été confirmé avec succès !');
          
          toast({
            title: "Compte confirmé !",
            description: "Bienvenue sur Ebo'o Gest",
          });
          
          // Redirection après 3 secondes
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } else {
          // Attendre un peu pour que l'état d'authentification se mette à jour
          setTimeout(() => {
            if (!user) {
              setStatus('error');
              setMessage('Impossible de confirmer votre compte. Veuillez réessayer.');
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Confirmation error:', err);
        setStatus('error');
        setMessage('Une erreur inattendue s\'est produite');
      }
    };

    handleConfirmation();
  }, [searchParams, user, navigate, toast]);

  const handleRetry = () => {
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const features = [
    {
      icon: ShoppingCart,
      title: "Point de Vente",
      description: "Gestion des ventes en temps réel"
    },
    {
      icon: Package,
      title: "Gestion du Stock",
      description: "Suivi des produits et alertes"
    },
    {
      icon: Users,
      title: "Personnel",
      description: "Suivi des employés et performances"
    },
    {
      icon: BarChart3,
      title: "Rapports",
      description: "Analyses détaillées et export"
    }
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Confirmation en cours...</h2>
            <p className="text-muted-foreground">
              Veuillez patienter pendant que nous confirmons votre compte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Compte confirmé avec succès !
            </CardTitle>
            <CardDescription className="text-lg">
              Bienvenue sur Ebo'o Gest, votre solution de gestion PME
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="text-center">
              <EboLogo size="lg" variant="minimal" />
              <p className="text-muted-foreground mt-4">
                Redirection vers votre tableau de bord dans quelques secondes...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => navigate('/dashboard')} className="btn-gradient">
                Accéder au tableau de bord
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-600">
              Lien expiré
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground">
              <p>Les liens de confirmation sont valides pendant 24 heures.</p>
              <p className="mt-2">Veuillez demander un nouveau lien de confirmation.</p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Demander un nouveau lien
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

  // Status: error
  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Erreur de confirmation
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Nous n'avons pas pu confirmer votre compte.</p>
            <p className="mt-2">Veuillez réessayer ou contacter le support.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
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
