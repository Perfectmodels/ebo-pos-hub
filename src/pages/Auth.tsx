import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from 'zod';
import { ArrowLeft, Mail, Lock, User, Star, Eye, EyeOff, KeyRound, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Validation schemas
const authSchema = z.object({
  email: z.string().trim().email({ message: "Email invalide" }).max(255, { message: "Email trop long" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }).max(128, { message: "Mot de passe trop long" })
});

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      // Validate input
      const validatedData = authSchema.parse({ email, password });
      
      setLoading(true);
      
      const { error } = await signIn(validatedData.email, validatedData.password);

      if (error) {
        // Handle specific error cases
        let errorMessage = "Une erreur s'est produite";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Votre compte n'est pas encore activé. Contactez le support.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Ebo'o Gest !",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: "Données invalides",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez entrer votre email pour réinitialiser le mot de passe",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      // Ici vous pouvez ajouter la logique de réinitialisation du mot de passe
      // Pour l'instant, on simule l'envoi d'email
      toast({
        title: "Email de réinitialisation envoyé",
        description: "Vérifiez votre boîte de réception pour les instructions",
      });
      setShowForgotPassword(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Erreur de connexion Google",
          description: error.message || "Impossible de se connecter avec Google",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Redirection en cours",
          description: "Vous allez être redirigé vers Google pour la connexion",
        });
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-primary">Ebo'o Gest</h1>
            <Badge variant="secondary" className="ml-2">
              <Star className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Votre solution de gestion PME
          </p>
        </div>

        {/* Auth Form */}
        <Card className="card-stats">
          <CardHeader className="text-center">
            <CardTitle>Accès à votre espace</CardTitle>
            <CardDescription>
              Connectez-vous ou créez votre compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription PME</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSignIn} 
                  className="w-full btn-gradient"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>

                {/* Mot de passe oublié */}
                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-muted-foreground hover:text-primary"
                    disabled={loading}
                  >
                    <KeyRound className="w-4 h-4 mr-1" />
                    Mot de passe oublié ?
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Ou</span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full"
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </Button>
              </TabsContent>


              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Inscription PME</h3>
                    <p className="text-sm text-muted-foreground">
                      Formulaire détaillé pour les entreprises
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/inscription')}
                    className="w-full btn-gradient"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Accéder au formulaire PME
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Formulaire complet avec 6 étapes détaillées
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ? 
            <Link to="/contact" className="text-primary hover:underline ml-1">
              Contactez notre support
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Administrateur ? 
            <Link to="/admin-login" className="text-primary hover:underline ml-1">
              Accès panel admin
            </Link>
          </p>
        </div>
      </div>

      {/* Modal Mot de passe oublié */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Réinitialiser le mot de passe
              </CardTitle>
              <CardDescription>
                Entrez votre email pour recevoir les instructions de réinitialisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleForgotPassword}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Envoi..." : "Envoyer"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}