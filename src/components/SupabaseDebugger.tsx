import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Database, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Settings,
  Key,
  Globe
} from 'lucide-react';

export default function SupabaseDebugger() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkSupabaseConnection = async () => {
    try {
      setLoading(true);
      
      // Test de connexion basique
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Test de session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Test de configuration
      const config = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Non défini',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Défini' : 'Non défini',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      };

      const debugData = {
        connection: {
          status: userError ? 'Erreur' : 'OK',
          user: user ? {
            id: user.id,
            email: user.email,
            confirmed: user.email_confirmed_at ? 'Oui' : 'Non'
          } : null,
          error: userError?.message
        },
        session: {
          status: sessionError ? 'Erreur' : 'OK',
          hasSession: !!sessionData.session,
          expiresAt: sessionData.session?.expires_at,
          error: sessionError?.message
        },
        config,
        recommendations: []
      };

      // Recommandations basées sur les erreurs
      if (userError?.message?.includes('JWT')) {
        debugData.recommendations.push('Vérifiez votre clé API Supabase');
      }
      
      if (userError?.message?.includes('network')) {
        debugData.recommendations.push('Vérifiez votre connexion internet');
      }
      
      if (!config.url || config.url === 'Non défini') {
        debugData.recommendations.push('Configurez NEXT_PUBLIC_SUPABASE_URL');
      }
      
      if (!config.anonKey || config.anonKey === 'Non défini') {
        debugData.recommendations.push('Configurez NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }

      setDebugInfo(debugData);
      
      toast({
        title: "Diagnostic Supabase terminé",
        description: debugData.connection.status === 'OK' ? "Connexion OK" : "Problèmes détectés",
      });
      
    } catch (error) {
      console.error('Erreur diagnostic Supabase:', error);
      toast({
        title: "Erreur diagnostic",
        description: "Impossible de diagnostiquer Supabase",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    try {
      setLoading(true);
      
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      console.log('🧪 Test signup avec:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword
      });
      
      if (error) {
        console.error('❌ Erreur test signup:', error);
        toast({
          title: "Test signup échoué",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log('✅ Test signup réussi:', data);
        toast({
          title: "Test signup réussi",
          description: "L'inscription fonctionne correctement",
        });
      }
      
    } catch (error) {
      console.error('❌ Exception test signup:', error);
      toast({
        title: "Erreur test",
        description: "Erreur inattendue lors du test",
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
            <Database className="h-5 w-5" />
            Diagnostic Supabase
          </CardTitle>
          <CardDescription>
            Vérifiez la configuration et la connexion à Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Actions de diagnostic */}
          <div className="flex gap-2">
            <Button 
              onClick={checkSupabaseConnection}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              Vérifier la connexion
            </Button>
            
            <Button 
              onClick={testSignup}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Tester l'inscription
            </Button>
          </div>

          {/* Informations de configuration */}
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Configuration
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>URL Supabase:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Défini" : "Non défini"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Clé API:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Défini" : "Non défini"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Environnement:</span>
                <Badge variant="outline">{process.env.NODE_ENV}</Badge>
              </div>
            </div>
          </div>

          {/* Résultats du diagnostic */}
          {debugInfo && (
            <div className="space-y-4">
              <h4 className="font-semibold">Résultats du diagnostic</h4>
              
              {/* Statut de connexion */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Connexion:</span>
                  <Badge variant={debugInfo.connection.status === 'OK' ? "default" : "destructive"}>
                    {debugInfo.connection.status}
                  </Badge>
                </div>
                
                {debugInfo.connection.user && (
                  <div className="text-sm text-muted-foreground">
                    Utilisateur: {debugInfo.connection.user.email} (ID: {debugInfo.connection.user.id})
                  </div>
                )}
                
                {debugInfo.connection.error && (
                  <div className="text-sm text-red-600">
                    Erreur: {debugInfo.connection.error}
                  </div>
                )}
              </div>

              {/* Statut de session */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Session:</span>
                  <Badge variant={debugInfo.session.status === 'OK' ? "default" : "destructive"}>
                    {debugInfo.session.status}
                  </Badge>
                </div>
                
                {debugInfo.session.error && (
                  <div className="text-sm text-red-600">
                    Erreur: {debugInfo.session.error}
                  </div>
                )}
              </div>

              {/* Recommandations */}
              {debugInfo.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-orange-600">Recommandations:</h5>
                  <ul className="space-y-1">
                    {debugInfo.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-orange-600 flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
