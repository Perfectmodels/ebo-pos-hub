import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/config/firebase';
import { Building, Save } from 'lucide-react';

interface GoogleUserSetupProps {
  onComplete: () => void;
}

export default function GoogleUserSetup({ onComplete }: GoogleUserSetupProps) {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [currency, setCurrency] = useState('XAF');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !businessType) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir le nom et le type d'entreprise",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Utilisateur non connecté",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Mettre à jour le profil business
      await updateDoc(doc(db, "businesses", user.uid), {
        businessName: businessName.trim(),
        businessType: businessType.trim(),
        currency: currency,
        isGoogleUser: true,
        needsSetup: false
      });

      toast({
        title: "Configuration terminée !",
        description: "Votre profil d'entreprise a été configuré avec succès.",
      });

      onComplete();
    } catch (error) {
      console.error('Erreur configuration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la configuration",
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
        <CardTitle className="text-2xl">Configuration de votre entreprise</CardTitle>
        <CardDescription>
          Finalisez la configuration de votre compte pour accéder à toutes les fonctionnalités
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nom de l'entreprise</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="businessName"
                type="text"
                placeholder="Nom de votre entreprise"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Type d'activité</Label>
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Sélectionnez votre activité</option>
              <option value="restaurant">Restaurant</option>
              <option value="snack">Snack</option>
              <option value="bar">Bar</option>
              <option value="cafe">Café</option>
              <option value="commerce">Commerce</option>
              <option value="boutique">Boutique</option>
              <option value="pharmacie">Pharmacie</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="XAF">Franc CFA (XAF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar US (USD)</option>
              <option value="CAD">Dollar Canadien (CAD)</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Configuration...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Finaliser la configuration
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
