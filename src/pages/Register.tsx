
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from 'zod';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, Building, Briefcase, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const signUpSchema = z.object({
  email: z.string().trim().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  businessName: z.string().min(1, { message: "Le nom de l'entreprise est requis"}),
  businessType: z.string().min(1, { message: "Le type d'activité est requis"}),
  currency: z.string().min(1, { message: "Veuillez sélectionner une devise"}),
});

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [currency, setCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    try {
      const validatedData = signUpSchema.parse({ email, password, businessName, businessType, currency });
      setLoading(true);
      const { error } = await signUp(validatedData.email, validatedData.password, {
        businessName: validatedData.businessName,
        businessType: validatedData.businessType,
        currency: validatedData.currency
      });
      if (error) {
        throw new Error(error.code === 'auth/email-already-in-use' ? "Cet email est déjà utilisé." : "Erreur lors de l'inscription.");
      }
      toast({ 
        title: "Compte créé avec succès !", 
        description: "Bienvenue sur Ebo'o Gest ! Votre tableau de bord est personnalisé pour votre activité." 
      });
      navigate('/dashboard');
    } catch (error: any) {
      const message = (error instanceof z.ZodError) ? error.issues[0].message : error.message;
      toast({ title: "Erreur d'inscription", description: message, variant: "destructive" });
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
              <h2 className="text-2xl font-bold">Inscription PME</h2>
              <p className="text-muted-foreground">Créez votre compte pour commencer</p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="businessName"><Building className="inline-block mr-2 h-4 w-4"/>Nom de l'entreprise</Label>
                  <Input id="businessName" placeholder="Ex: Le Bon Goût" value={businessName} onChange={(e) => setBusinessName(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                  <Label><Briefcase className="inline-block mr-2 h-4 w-4"/>Type d'activité</Label>
                  <Select onValueChange={setBusinessType} value={businessType} disabled={loading}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez un type" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="restaurant">Restaurant</SelectItem>
                          <SelectItem value="snack">Snack / Fast-Food</SelectItem>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="cafe">Café</SelectItem>
                          <SelectItem value="commerce">Commerce / Supérette</SelectItem>
                          <SelectItem value="boutique">Boutique</SelectItem>
                          <SelectItem value="boulangerie">Boulangerie / Pâtisserie</SelectItem>
                          <SelectItem value="pharmacie">Pharmacie</SelectItem>
                          <SelectItem value="traiteur">Service traiteur</SelectItem>
                          <SelectItem value="loisirs">Loisirs & Animation</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label><DollarSign className="inline-block mr-2 h-4 w-4"/>Devise</Label>
                  <Select onValueChange={setCurrency} value={currency} disabled={loading}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez une devise" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="XAF">FCFA (XAF)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                          <SelectItem value="USD">Dollar Américain (USD)</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email"><Mail className="inline-block mr-2 h-4 w-4"/>Email</Label>
                <Input id="signup-email" type="email" placeholder="nouveau@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password"><Lock className="inline-block mr-2 h-4 w-4"/>Mot de passe (6 caractères min.)</Label>
                <div className="relative">
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Création du compte..." : "Créer mon compte et commencer"}
              </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Déjà un compte ?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                      Connectez-vous ici
                  </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
