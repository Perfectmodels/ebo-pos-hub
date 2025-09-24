import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import EboLogo from './EboLogo';

interface AdminAuthProps {
  onSuccess: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Identifiants administrateur
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'EboGest2024!'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Champs requis",
        description: "Veuillez entrer vos identifiants",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simuler une vérification (en production, ceci devrait être sécurisé)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Stocker la session admin
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_login_time', new Date().toISOString());
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans le panel administrateur",
        });
        
        onSuccess();
      } else {
        toast({
          title: "Accès refusé",
          description: "Identifiants non reconnus. Contactez l'administrateur système.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Une erreur s'est produite lors de la connexion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-stats">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <EboLogo size="lg" showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Panel Administrateur
          </CardTitle>
          <CardDescription>
            Accès sécurisé au panel de gestion central
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d'utilisateur"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  disabled={loading}
                  required
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
              type="submit" 
              className="w-full btn-gradient"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Accès sécurisé</p>
                <p className="text-muted-foreground">
                  Connexion réservée aux administrateurs autorisés
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;
