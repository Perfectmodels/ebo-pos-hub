import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';

interface SimplifiedAuthProps {
  type: 'signin' | 'signup';
  onToggleType: () => void;
}

export default function SimplifiedAuth({ type, onToggleType }: SimplifiedAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let error;
      
      if (type === 'signin') {
        const result = await signIn(email, password);
        error = result.error;
      } else {
        const result = await signUp(email, password);
        error = result.error;
      }

      if (error) {
        let errorMessage = "Une erreur s'est produite";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email ou mot de passe incorrect";
        } else if (error.message.includes('User already registered')) {
          errorMessage = "Cet email est déjà utilisé. Essayez de vous connecter.";
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
        }
        
        toast({
          title: "Erreur d'authentification",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: type === 'signin' ? "Connexion réussie" : "Inscription réussie",
          description: type === 'signin' 
            ? "Bienvenue sur Ebo'o Gest !" 
            : "Votre compte a été créé avec succès !",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur authentification:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Building className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">
          {type === 'signin' ? 'Connexion' : 'Inscription'}
        </CardTitle>
        <CardDescription>
          {type === 'signin' 
            ? 'Connectez-vous à votre compte Ebo\'o Gest'
            : 'Créez votre compte Ebo\'o Gest'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
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
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                {type === 'signin' ? 'Connexion...' : 'Inscription...'}
              </div>
            ) : (
              type === 'signin' ? 'Se connecter' : 'S\'inscrire'
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {type === 'signin' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
            {' '}
            <button
              type="button"
              onClick={onToggleType}
              className="text-primary hover:underline font-medium"
            >
              {type === 'signin' ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        </div>
        
        {type === 'signin' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/forgot-password')}
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
