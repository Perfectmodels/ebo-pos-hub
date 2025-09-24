import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Bug, Settings } from 'lucide-react';
import EmailDebugger from '@/components/EmailDebugger';

export default function EmailDebug() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bug className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Diagnostic des Emails</h1>
              <p className="text-muted-foreground">
                Outils de débogage pour résoudre les problèmes d'envoi d'emails d'authentification
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Instructions de Diagnostic
            </CardTitle>
            <CardDescription>
              Suivez ces étapes pour diagnostiquer le problème d'envoi d'emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">1. Vérifications Supabase</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Authentication > Settings > Email</li>
                    <li>• Vérifiez que "Enable email confirmations" est activé</li>
                    <li>• Vérifiez la configuration SMTP</li>
                    <li>• Vérifiez les URLs de redirection</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">2. Vérifications Locales</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Vérifiez les variables d'environnement</li>
                    <li>• Vérifiez la console pour les erreurs</li>
                    <li>• Testez avec un email valide</li>
                    <li>• Vérifiez les logs Supabase</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700">
                      Les emails de confirmation ne sont envoyés que si l'utilisateur n'est pas déjà confirmé. 
                      Vérifiez que l'email utilisé pour le test n'a pas déjà été confirmé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outil de diagnostic */}
        <EmailDebugger />
      </div>
    </div>
  );
}
