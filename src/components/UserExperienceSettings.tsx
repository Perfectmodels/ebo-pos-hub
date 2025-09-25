import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import { TutorialLauncher } from '@/components/InteractiveTutorial';
import CashRegisterSelector from '@/components/CashRegisterSelector';
import { 
  Palette, 
  Keyboard, 
  Lightbulb, 
  Monitor, 
  Moon, 
  Sun,
  Zap,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";

export default function UserExperienceSettings() {
  const { 
    currentTheme, 
    availableThemes, 
    setTheme, 
    isDarkMode, 
    toggleDarkMode,
    createCustomTheme,
    resetToDefault
  } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customThemeName, setCustomThemeName] = useState('');

  // Créer un thème personnalisé
  const handleCreateCustomTheme = () => {
    if (!customThemeName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le thème personnalisé",
        variant: "destructive"
      });
      return;
    }

    // Utiliser les couleurs actuelles comme base
    createCustomTheme({
      name: customThemeName.trim(),
      colors: currentTheme.colors,
      fonts: currentTheme.fonts,
      borderRadius: currentTheme.borderRadius,
      shadows: currentTheme.shadows
    });

    toast({
      title: "Thème créé",
      description: `Le thème "${customThemeName}" a été créé avec succès`,
    });
    setCustomThemeName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Expérience Utilisateur
          </h1>
          <p className="text-muted-foreground">
            Personnalisez l'interface selon vos préférences
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showAdvanced ? 'Masquer' : 'Afficher'} Avancé
        </Button>
      </div>

      {/* Thèmes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Thèmes Personnalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode sombre */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="dark-mode">Mode Sombre</Label>
              <p className="text-sm text-muted-foreground">
                Basculer entre le mode clair et sombre
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>

          <Separator />

          {/* Thèmes prédéfinis */}
          <div className="space-y-3">
            <Label>Thèmes Disponibles</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {availableThemes.map(theme => (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all ${
                    currentTheme.id === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setTheme(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{theme.name}</h4>
                      {currentTheme.id === theme.id && (
                        <Badge variant="default">Actuel</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {theme.fonts.primary} • {theme.borderRadius} • {theme.shadows}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Thème personnalisé */}
          {showAdvanced && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label>Créer un Thème Personnalisé</Label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom du thème personnalisé"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <Button onClick={handleCreateCustomTheme} size="sm">
                    Créer
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={resetToDefault}
                  size="sm"
                >
                  Réinitialiser au Défaut
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Raccourcis Clavier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Raccourcis Clavier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Raccourcis Actifs</Label>
              <p className="text-sm text-muted-foreground">
                Utilisez les raccourcis clavier pour une navigation rapide
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <Badge variant="secondary">Activé</Badge>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Nouvelle vente</span>
              <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl + N</kbd>
            </div>
            <div className="flex justify-between">
              <span>Rechercher</span>
              <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl + F</kbd>
            </div>
            <div className="flex justify-between">
              <span>Dashboard</span>
              <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl + H</kbd>
            </div>
            <div className="flex justify-between">
              <span>Aide</span>
              <kbd className="px-2 py-1 bg-muted border rounded text-xs">Ctrl + ?</kbd>
            </div>
          </div>

          <div className="pt-2">
            <KeyboardShortcutsModal />
          </div>
        </CardContent>
      </Card>

      {/* Tutoriels Interactifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Tutoriels Interactifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TutorialLauncher />
        </CardContent>
      </Card>

      {/* Mode Multi-utilisateur */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Mode Multi-utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Plusieurs Caisses</Label>
                  <p className="text-sm text-muted-foreground">
                    Gérez plusieurs registres de caisse simultanément
                  </p>
                </div>
                <Badge variant="secondary">Disponible</Badge>
              </div>
              
              <CashRegisterSelector />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques d'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Statistiques d'Utilisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Tutoriels Complétés</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-sm text-muted-foreground">Raccourcis Utilisés</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {isDarkMode ? 'Sombre' : 'Clair'}
              </div>
              <div className="text-sm text-muted-foreground">Thème Actuel</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
