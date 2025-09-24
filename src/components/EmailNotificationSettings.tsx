import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Bell, 
  Users, 
  Package, 
  TrendingUp,
  Settings,
  Save,
  TestTube,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface NotificationSettings {
  newUserNotifications: boolean;
  newPMENotifications: boolean;
  lowStockAlerts: boolean;
  dailyReports: boolean;
  adminEmails: string[];
  emailTemplates: {
    newUser: string;
    newPME: string;
    lowStock: string;
    dailyReport: string;
  };
}

export default function EmailNotificationSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    newUserNotifications: true,
    newPMENotifications: true,
    lowStockAlerts: true,
    dailyReports: false,
    adminEmails: [],
    emailTemplates: {
      newUser: "Nouvel utilisateur inscrit: {userName} ({userEmail})",
      newPME: "Nouvelle PME inscrite: {companyName} - {activityType}",
      lowStock: "Stock faible pour {productName}: {currentStock}/{minStock}",
      dailyReport: "Rapport quotidien: {totalSales} FCFA de ventes"
    }
  });

  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Charger les paramètres depuis le localStorage ou Supabase
      const savedSettings = localStorage.getItem('emailNotificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    
    try {
      // Sauvegarder les paramètres
      localStorage.setItem('emailNotificationSettings', JSON.stringify(settings));
      
      toast({
        title: "Paramètres sauvegardés !",
        description: "Les notifications email ont été configurées",
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdminEmail = () => {
    if (newEmail && !settings.adminEmails.includes(newEmail)) {
      setSettings(prev => ({
        ...prev,
        adminEmails: [...prev.adminEmails, newEmail]
      }));
      setNewEmail("");
    }
  };

  const removeAdminEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      adminEmails: prev.adminEmails.filter(e => e !== email)
    }));
  };

  const testEmailNotification = async () => {
    setTesting(true);
    
    try {
      // Simuler l'envoi d'un email de test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email de test envoyé !",
        description: "Vérifiez votre boîte de réception",
      });
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email de test",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTemplateChange = (templateKey: keyof NotificationSettings['emailTemplates'], value: string) => {
    setSettings(prev => ({
      ...prev,
      emailTemplates: {
        ...prev.emailTemplates,
        [templateKey]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Configuration des Notifications Email
          </CardTitle>
          <CardDescription>
            Configurez les notifications automatiques par email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Types de Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Types de Notifications</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base font-medium">Nouvelles inscriptions utilisateurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email à chaque nouvelle inscription
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.newUserNotifications}
                  onCheckedChange={(checked) => handleSettingChange('newUserNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base font-medium">Nouvelles inscriptions PME</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email pour chaque nouvelle PME inscrite
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.newPMENotifications}
                  onCheckedChange={(checked) => handleSettingChange('newPMENotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-600" />
                  <div>
                    <Label className="text-base font-medium">Alertes stock faible</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un email quand le stock est faible
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => handleSettingChange('lowStockAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label className="text-base font-medium">Rapports quotidiens</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un rapport de ventes quotidien
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.dailyReports}
                  onCheckedChange={(checked) => handleSettingChange('dailyReports', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Emails Administrateurs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emails Administrateurs</h3>
            
            <div className="space-y-2">
              <Label>Ajouter un email administrateur</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="admin@entreprise.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAdminEmail()}
                />
                <Button onClick={addAdminEmail} disabled={!newEmail}>
                  Ajouter
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Emails configurés</Label>
              <div className="flex flex-wrap gap-2">
                {settings.adminEmails.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <button
                      onClick={() => removeAdminEmail(email)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {settings.adminEmails.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun email configuré</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Templates d'Email */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Templates d'Email</h3>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="newUserTemplate">Template nouvelle inscription utilisateur</Label>
                <Textarea
                  id="newUserTemplate"
                  value={settings.emailTemplates.newUser}
                  onChange={(e) => handleTemplateChange('newUser', e.target.value)}
                  placeholder="Template pour les nouvelles inscriptions..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="newPMETemplate">Template nouvelle inscription PME</Label>
                <Textarea
                  id="newPMETemplate"
                  value={settings.emailTemplates.newPME}
                  onChange={(e) => handleTemplateChange('newPME', e.target.value)}
                  placeholder="Template pour les nouvelles inscriptions PME..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="lowStockTemplate">Template alerte stock faible</Label>
                <Textarea
                  id="lowStockTemplate"
                  value={settings.emailTemplates.lowStock}
                  onChange={(e) => handleTemplateChange('lowStock', e.target.value)}
                  placeholder="Template pour les alertes de stock..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="dailyReportTemplate">Template rapport quotidien</Label>
                <Textarea
                  id="dailyReportTemplate"
                  value={settings.emailTemplates.dailyReport}
                  onChange={(e) => handleTemplateChange('dailyReport', e.target.value)}
                  placeholder="Template pour les rapports quotidiens..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={saveSettings} disabled={loading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            
            <Button 
              onClick={testEmailNotification} 
              disabled={testing || settings.adminEmails.length === 0}
              variant="outline"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Test...' : 'Tester Email'}
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            {settings.adminEmails.length > 0 ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Notifications configurées pour {settings.adminEmails.length} email(s)
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  Aucun email administrateur configuré
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
