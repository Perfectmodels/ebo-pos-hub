import { NavLink } from "react-router-dom";
import { useActivity } from "@/contexts/ActivityContext";
import ActivitySelector from "./ActivitySelector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Calendar,
  Utensils,
  Truck,
  Music,
  ChefHat,
  Square,
  Zap,
  Wine,
  Truck as Delivery,
  BookOpen,
  Settings,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import EboLogo from "@/components/EboLogo";

const iconMap = {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Calendar,
  Utensils,
  Truck,
  Music,
  ChefHat,
  Square,
  Zap,
  Wine,
  Delivery,
  BookOpen,
  Settings,
  Shield
};

export default function AdaptiveSidebar() {
  const { currentActivity, getSidebarItems, isFeatureEnabled } = useActivity();
  const { signOut } = useAuth();

  const sidebarItems = getSidebarItems();

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon || BarChart3;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <EboLogo size="sm" variant="minimal" showText={false} />
          <div>
            <h2 className="font-bold text-foreground">Ebo'o Gest</h2>
            <p className="text-xs text-muted-foreground">Gestion PME</p>
          </div>
        </div>
        
        {/* Activity Info - Navigation entre activités désactivée */}
        {currentActivity && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">{currentActivity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{currentActivity.name}</p>
                <p className="text-xs text-muted-foreground">Activité configurée</p>
              </div>
              <Badge variant="secondary" className="text-xs">Verrouillé</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = getIcon(item.icon);
          const isEnabled = isFeatureEnabled(item.id);
          
          if (!isEnabled) return null;
          
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.priority <= 3 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Essentiel
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Activity Info */}
      {currentActivity && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{currentActivity.icon}</span>
            <div>
              <p className="text-sm font-medium">{currentActivity.name}</p>
              <p className="text-xs text-muted-foreground">
                Interface adaptée
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {currentActivity.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {currentActivity.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{currentActivity.features.length - 3}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <Settings className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
