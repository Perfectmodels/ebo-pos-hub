import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActivity } from "@/contexts/ActivityContext";
import ActivitySelector from "@/components/ActivitySelector";
import PMEInfo from "@/components/PMEInfo";
import EmailNotificationSettings from "@/components/EmailNotificationSettings";
import NotificationCenter from "@/components/NotificationCenter";
import { 
  Settings, 
  Building2, 
  Users, 
  Bell, 
  Shield, 
  Palette,
  Activity,
  CheckCircle,
  Mail
} from "lucide-react";

export default function Parametres() {
  const { currentActivity, isFeatureEnabled } = useActivity();
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Personnalisez votre expérience Ebo'o Gest
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <Badge variant="secondary">
            {currentActivity?.name || 'Non configuré'}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activité
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Entreprise
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Système
          </TabsTrigger>
        </TabsList>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Configuration de l'activité
              </CardTitle>
              <CardDescription>
                Adaptez Ebo'o Gest à votre secteur d'activité pour une expérience personnalisée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Type d'activité actuel</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentActivity ? (
                      <>
                        <span className="text-lg mr-2">{currentActivity.icon}</span>
                        {currentActivity.name} - {currentActivity.features.length} fonctionnalités activées
                      </>
                    ) : (
                      'Aucune activité configurée'
                    )}
                  </p>
                </div>
                <ActivitySelector />
              </div>

              {currentActivity && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Fonctionnalités activées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentActivity.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Paramètres par défaut</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(currentActivity.defaultSettings).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <PMEInfo />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <EmailNotificationSettings />
            </div>
            <div>
              <NotificationCenter />
            </div>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Gestion des utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les accès et permissions de votre équipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gestion des utilisateurs en développement</p>
                <p className="text-sm">Cette fonctionnalité sera disponible prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences de notification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertes stock</p>
                      <p className="text-sm text-muted-foreground">Notifications de rupture de stock</p>
                    </div>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rapports quotidiens</p>
                      <p className="text-sm text-muted-foreground">Résumé quotidien par email</p>
                    </div>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Sécurité
                </CardTitle>
                <CardDescription>
                  Paramètres de sécurité et sauvegarde
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sauvegarde automatique</p>
                      <p className="text-sm text-muted-foreground">Sauvegarde quotidienne des données</p>
                    </div>
                    <Badge variant="secondary">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Authentification 2FA</p>
                      <p className="text-sm text-muted-foreground">Double authentification</p>
                    </div>
                    <Button variant="outline" size="sm">Activer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Apparence
                </CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de votre interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Thème</p>
                      <p className="text-sm text-muted-foreground">Mode sombre/clair</p>
                    </div>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Couleurs</p>
                      <p className="text-sm text-muted-foreground">Couleurs de votre entreprise</p>
                    </div>
                    <Button variant="outline" size="sm">Personnaliser</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Avancé
                </CardTitle>
                <CardDescription>
                  Paramètres avancés du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export des données</p>
                      <p className="text-sm text-muted-foreground">Exporter toutes vos données</p>
                    </div>
                    <Button variant="outline" size="sm">Exporter</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Réinitialisation</p>
                      <p className="text-sm text-muted-foreground">Remettre à zéro les paramètres</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
