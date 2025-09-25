import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/contexts/ActivityContext";
import { getActivityRoles, EmployeeRole } from "@/utils/employeeProfiles";
import { 
  Users, 
  Shield, 
  Eye,
  Plus,
  Info
} from "lucide-react";

interface EmployeeProfilesViewProps {
  onAddEmployee?: () => void;
  showAddButton?: boolean;
}

export default function EmployeeProfilesView({ 
  onAddEmployee, 
  showAddButton = true 
}: EmployeeProfilesViewProps) {
  const { currentActivity } = useActivity();
  
  const activityRoles = getActivityRoles(currentActivity?.id || 'restaurant');

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'gestion_complete':
        return '👨‍💼';
      case 'ventes':
        return '💰';
      case 'clients':
        return '👥';
      case 'stock':
        return '📦';
      case 'cuisine':
      case 'cuisine_rapide':
      case 'production':
        return '👨‍🍳';
      case 'bar':
      case 'cafe':
        return '☕';
      case 'animation':
        return '🎭';
      case 'livraison':
        return '🚚';
      case 'securite':
        return '🛡️';
      case 'nettoyage':
        return '🧽';
      case 'accueil':
        return '👋';
      default:
        return '⚙️';
    }
  };

  const getPermissionColor = (permission: string) => {
    if (permission.includes('gestion') || permission.includes('complete')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (permission.includes('vente') || permission.includes('encaissement')) {
      return 'bg-green-100 text-green-800';
    }
    if (permission.includes('cuisine') || permission.includes('production')) {
      return 'bg-orange-100 text-orange-800';
    }
    if (permission.includes('client')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (permission.includes('stock') || permission.includes('inventaire')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Profils d'employés - {currentActivity?.name}
          </h2>
          <p className="text-muted-foreground">
            Rôles et permissions spécifiques à votre activité
          </p>
        </div>
        {showAddButton && onAddEmployee && (
          <Button onClick={onAddEmployee} className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un employé
          </Button>
        )}
      </div>

      {/* Information générale */}
      <Card className="card-stats">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Comment ça fonctionne ?
              </h4>
              <p className="text-sm text-blue-800">
                Chaque employé reçoit un rôle adapté à votre activité avec des permissions spécifiques. 
                Les rôles déterminent ce que chaque employé peut faire dans le système.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille des rôles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activityRoles.map((role) => (
          <Card key={role.id} className="card-stats hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{role.icon}</span>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {role.name}
                    </CardTitle>
                    <Badge className={role.color}>
                      {role.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Permissions :</span>
                </div>
                <div className="grid gap-1">
                  {role.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm">{getPermissionIcon(permission)}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPermissionColor(permission)}`}
                      >
                        {permission.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Légende des permissions */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="text-lg">Légende des permissions</CardTitle>
          <CardDescription>
            Comprendre les différents types de permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍💼</span>
              <div>
                <p className="text-sm font-medium">Gestion</p>
                <p className="text-xs text-muted-foreground">Administration complète</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <div>
                <p className="text-sm font-medium">Ventes</p>
                <p className="text-xs text-muted-foreground">Encaissement et caisse</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <div>
                <p className="text-sm font-medium">Clients</p>
                <p className="text-xs text-muted-foreground">Service client</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍🍳</span>
              <div>
                <p className="text-sm font-medium">Cuisine</p>
                <p className="text-xs text-muted-foreground">Préparation et production</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm font-medium">Stock</p>
                <p className="text-xs text-muted-foreground">Gestion inventaire</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎭</span>
              <div>
                <p className="text-sm font-medium">Animation</p>
                <p className="text-xs text-muted-foreground">Activités et loisirs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
