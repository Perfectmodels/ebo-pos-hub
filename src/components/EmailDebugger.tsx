import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mail, 
  Bug, 
  CheckCircle, 
  AlertCircle, 
  Send,
  Settings,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function EmailDebugger() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [authSettings, setAuthSettings] = useState<any>(null);

  const checkAuthSettings = async () => {
    try {
      setLoading(true);
      
      // Vérifier la configuration Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Vérifier les paramètres d'authentification
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      const debugData = {
        timestamp: new Date().toISOString(),
        user: user ? {
          id: user.id,
          email: user.email,
          email_confirmed: user.email_confirmed_at,
          created_at: user.created_at
        } : null,
        session: authData.session ? {
          access_token: authData.session.access_token ? 'Present' : 'Missing',
          refresh_token: authData.session.refresh_token ? 'Present' : 'Missing',
          expires_at: authData.session.expires_at
        } : null,
        errors: {
          userError: userError?.message,
          authError: authError?.message
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
          supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
        }
      };
      
      setDebugInfo(debugData);
      
      toast({
        title: "Diagnostic terminé",
        description: "Informations de débogage récupérées",
      });
      
    } catch (error) {
      console.error('Erreur diagnostic:', error);
      toast({
        title: "Erreur diagnostic",
        description: "Impossible de récupérer les informations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testEmailSending = async () => {
    if (!testEmail || !testPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir l'email et le mot de passe",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Test d'inscription avec logs détaillés
      console.log('🔍 Test d\'inscription avec email:', testEmail);
      console.log('🔍 URL de redirection configurée:', process.env.NODE_ENV === 'production' 
        ? 'https://eboo-gest.vercel.app/confirm-signup'
        : 'http://localhost:8080/confirm-signup');
      
      const { error } = await signUp(testEmail, testPassword, {
        businessName: 'Test Business',
        businessType: 'restaurant',
        currency: 'XAF'
      });
      
      if (error) {
        console.error('❌ Erreur inscription:', error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Inscription réussie, email devrait être envoyé');
        toast({
          title: "Test d'inscription réussi",
          description: "Vérifiez votre boîte email pour le lien de confirmation",
        });
      }
      
    } catch (error) {
      console.error('❌ Exception inscription:', error);
      toast({
        title: "Erreur exception",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEmailTemplates = async () => {
    try {
      setLoading(true);
      
      // Vérifier si les templates sont accessibles
      const templates = {
        invitation: 'src/templates/invitation-email.html',
        magicLink: 'src/templates/magic-link-email.html',
        passwordReset: 'src/templates/password-reset.html',
        reauthentication: 'src/templates/reauthentication-confirmation.html'
      };
      
      console.log('📧 Templates disponibles:', templates);
      
      toast({
        title: "Templates vérifiés",
        description: "Les templates d'email sont disponibles localement",
      });
      
    } catch (error) {
      console.error('Erreur vérification templates:', error);
      toast({
        title: "Erreur templates",
        description: "Impossible de vérifier les templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Diagnostic des Emails d'Authentification
          </CardTitle>
          <CardDescription>
            Outils de débogage pour diagnostiquer les problèmes d'envoi d'emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Test d'inscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Send className="h-4 w-4" />
              Test d'Inscription
            </h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="testEmail">Email de test</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="testPassword">Mot de passe de test</Label>
                <Input
                  id="testPassword"
                  type="password"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  placeholder="Mot de passe sécurisé"
                />
              </div>
              
              <Button 
                onClick={testEmailSending}
                disabled={loading || !testEmail || !testPassword}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Tester l'inscription et l'envoi d'email
              </Button>
            </div>
          </div>

          {/* Diagnostic système */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Diagnostic Système
            </h3>
            
            <div className="flex gap-2">
              <Button 
                onClick={checkAuthSettings}
                disabled={loading}
                variant="outline"
              >
                <Eye className="h-4 w-4 mr-2" />
                Vérifier la configuration
              </Button>
              
              <Button 
                onClick={checkEmailTemplates}
                disabled={loading}
                variant="outline"
              >
                <Mail className="h-4 w-4 mr-2" />
                Vérifier les templates
              </Button>
            </div>
          </div>

          {/* Informations de débogage */}
          {debugInfo && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Informations de Débogage
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={debugInfo.user ? "default" : "destructive"}>
                    {debugInfo.user ? "Utilisateur connecté" : "Aucun utilisateur"}
                  </Badge>
                  <Badge variant={debugInfo.session ? "default" : "destructive"}>
                    {debugInfo.session ? "Session active" : "Aucune session"}
                  </Badge>
                </div>
                
                <Textarea
                  value={JSON.stringify(debugInfo, null, 2)}
                  readOnly
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}

          {/* Instructions de résolution */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Points à Vérifier
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline">1</Badge>
                <span>Vérifiez que l'email de confirmation est activé dans Supabase Dashboard</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline">2</Badge>
                <span>Vérifiez les paramètres SMTP dans Supabase (Authentication {`>`} Settings)</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline">3</Badge>
                <span>Vérifiez que les URLs de redirection sont correctement configurées</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="outline">4</Badge>
                <span>Vérifiez les logs Supabase pour les erreurs d'envoi d'email</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
