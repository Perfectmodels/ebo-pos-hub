
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from 'zod';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const validatedData = signInSchema.parse({ email, password });
      setLoading(true);
      const { error } = await signIn(validatedData.email, validatedData.password);
      if (error) throw new Error("Email ou mot de passe incorrect.");
      toast({ title: "Connexion réussie" });
      navigate('/dashboard');
    } catch (error: any) {
      const message = (error instanceof z.ZodError) ? error.issues[0].message : error.message;
      toast({ title: "Erreur de connexion", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Ebo'o Gest</h1>
        </div>

        <Card className="card-stats">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Connexion</h2>
              <p className="text-muted-foreground">Accédez à votre tableau de bord</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="signin-email" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Link to="#" className="text-sm text-primary hover:underline">Mot de passe oublié ?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="pl-10"/>
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </Button>
                </div>
              </div>
              <Button onClick={handleSignIn} className="w-full btn-gradient" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-primary hover:underline">
                    Inscrivez-vous ici
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
