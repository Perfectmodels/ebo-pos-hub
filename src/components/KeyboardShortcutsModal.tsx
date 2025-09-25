import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Keyboard, 
  Search, 
  Navigation, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings,
  Zap,
  HelpCircle
} from "lucide-react";
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const categoryIcons = {
  navigation: Navigation,
  sales: ShoppingCart,
  products: Package,
  employees: Users,
  reports: FileText,
  general: Settings
};

const categoryLabels = {
  navigation: 'Navigation',
  sales: 'Ventes',
  products: 'Produits',
  employees: 'Personnel',
  reports: 'Rapports',
  general: 'Général'
};

export default function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { shortcuts } = useKeyboardShortcuts();

  // Filtrer les raccourcis selon la recherche
  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouper les raccourcis par catégorie
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  // Formater la combinaison de touches
  const formatKeyCombo = (shortcut: typeof shortcuts[0]) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.metaKey) parts.push('⌘');
    parts.push(shortcut.key);
    return parts.join(' + ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-shortcut="help">
          <HelpCircle className="w-4 h-4 mr-2" />
          Raccourcis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Raccourcis Clavier
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un raccourci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Statistiques rapides */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {filteredShortcuts.length} raccourcis disponibles
              </span>
            </div>
            <Badge variant="secondary">
              {Object.keys(groupedShortcuts).length} catégories
            </Badge>
          </div>

          {/* Liste des raccourcis */}
          <div className="overflow-y-auto max-h-96 space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              
              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2 sticky top-0 bg-background py-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </h3>
                    <Badge variant="outline" className="ml-auto">
                      {categoryShortcuts.length}
                    </Badge>
                  </div>

                  <div className="grid gap-2 ml-6">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{shortcut.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {formatKeyCombo(shortcut)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conseils d'utilisation */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Conseils d'utilisation
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Utilisez <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border rounded text-xs">Ctrl + ?</kbd> pour ouvrir cette aide</li>
              <li>• Les raccourcis fonctionnent partout dans l'application</li>
              <li>• <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border rounded text-xs">Échap</kbd> annule ou ferme les modales</li>
              <li>• <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 border rounded text-xs">F5</kbd> actualise les données</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher un raccourci inline
export const ShortcutBadge = ({ shortcut }: { shortcut: string }) => {
  return (
    <Badge variant="outline" className="font-mono text-xs">
      {shortcut}
    </Badge>
  );
};
