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
import { ArrowLeft, Mail, Lock, User, Star } from "lucide-react";
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
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAuth = async (isSignUp: boolean) => {
    try {
      // Validate input
      const validatedData = authSchema.parse({ email, password });
      
      setLoading(true);
      
      const { error } = isSignUp 
        ? await signUp(validatedData.email, validatedData.password)
        : await signIn(validatedData.email, validatedData.password);

      if (error) {
        // Handle specific error cases
        let errorMessage = "Une erreur s'est produite";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "Un compte existe déjà avec cet email";
          setActiveTab('signin');
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Veuillez confirmer votre email avant de vous connecter";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Compte créé avec succès",
            description: "Vérifiez votre email pour confirmer votre compte",
          });
        } else {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur Ebo'o Gest !",
          });
          navigate('/dashboard');
        }
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
                <TabsTrigger value="signup">Inscription</TabsTrigger>
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
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleAuth(false)} 
                  className="w-full btn-gradient"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
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
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Au moins 6 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => handleAuth(true)} 
                  className="w-full btn-gradient"
                  disabled={loading}
                >
                  {loading ? "Création..." : "Créer mon compte"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  En créant un compte, vous acceptez nos conditions d'utilisation
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Besoin d'aide ? Contactez notre support
          </p>
        </div>
      </div>
    </div>
  );
}