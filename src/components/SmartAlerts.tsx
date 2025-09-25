import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSales } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Bell,
  BellOff,
  Settings,
  DollarSign,
  Package,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'stock' | 'employee' | 'performance';
  condition: string;
  threshold: number;
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface AlertInstance {
  id: string;
  ruleId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  data: any;
}

export default function SmartAlerts() {
  const { sales, fetchSales } = useSales();
  const { products } = useProducts();
  const { employees } = useEmployees();
  const [alerts, setAlerts] = useState<AlertInstance[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Règles d'alerte prédéfinies
  const alertRules: AlertRule[] = [
    {
      id: 'low-stock',
      name: 'Stock Faible',
      description: 'Produit en rupture de stock ou stock très faible',
      type: 'stock',
      condition: 'stock_below_threshold',
      threshold: 5,
      enabled: true,
      severity: 'high'
    },
    {
      id: 'sales-drop',
      name: 'Baisse des Ventes',
      description: 'Baisse significative des ventes par rapport à la veille',
      type: 'sales',
      condition: 'sales_drop_percentage',
      threshold: 30,
      enabled: true,
      severity: 'medium'
    },
    {
      id: 'sales-surge',
      name: 'Pic de Ventes',
      description: 'Augmentation exceptionnelle des ventes',
      type: 'sales',
      condition: 'sales_increase_percentage',
      threshold: 50,
      enabled: true,
      severity: 'low'
    },
    {
      id: 'no-sales',
      name: 'Aucune Vente',
      description: 'Aucune vente enregistrée depuis plus de 2 heures',
      type: 'sales',
      condition: 'no_sales_duration',
      threshold: 120, // 2 heures en minutes
      enabled: true,
      severity: 'critical'
    },
    {
      id: 'employee-performance',
      name: 'Performance Employé',
      description: 'Employé avec des ventes très faibles',
      type: 'employee',
      condition: 'low_employee_sales',
      threshold: 10000, // FCFA
      enabled: true,
      severity: 'medium'
    }
  ];

  // Demander la permission pour les notifications
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    }
  }, []);

  // Fonction pour créer une notification
  const createNotification = (alert: AlertInstance) => {
    if (!notificationsEnabled || !('Notification' in window)) return;

    const notification = new Notification(`Ebo'o Gest - ${alert.message}`, {
      body: alert.message,
      icon: '/logo-ebo-gest.png',
      badge: '/logo-ebo-gest.png',
      tag: alert.id,
      requireInteraction: alert.severity === 'critical',
      silent: alert.severity === 'low'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-fermer après 5 secondes sauf pour les alertes critiques
    if (alert.severity !== 'critical') {
      setTimeout(() => notification.close(), 5000);
    }
  };

  // Analyser les données et générer des alertes
  const analyzeData = useMemo(() => {
    const newAlerts: AlertInstance[] = [];
    const now = new Date();

    // Alerte stock faible
    const lowStockRule = alertRules.find(r => r.id === 'low-stock');
    if (lowStockRule?.enabled) {
      const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);
      lowStockProducts.forEach(product => {
        const alertExists = alerts.some(a => 
          a.ruleId === 'low-stock' && 
          a.data?.productId === product.id &&
          !a.acknowledged
        );
        
        if (!alertExists) {
          const alert: AlertInstance = {
            id: `low-stock-${product.id}-${Date.now()}`,
            ruleId: 'low-stock',
            message: `Stock faible: ${product.name} (${product.current_stock}/${product.min_stock})`,
            severity: 'high',
            timestamp: now,
            acknowledged: false,
            data: { productId: product.id, productName: product.name }
          };
          newAlerts.push(alert);
          createNotification(alert);
        }
      });
    }

    // Alerte baisse des ventes
    const salesDropRule = alertRules.find(r => r.id === 'sales-drop');
    if (salesDropRule?.enabled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const todaySales = sales.filter(s => {
        const saleDate = s.createdAt.toDate();
        return saleDate >= today;
      });

      const yesterdaySales = sales.filter(s => {
        const saleDate = s.createdAt.toDate();
        return saleDate >= yesterday && saleDate < today;
      });

      const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
      const yesterdayTotal = yesterdaySales.reduce((sum, s) => sum + s.total, 0);

      if (yesterdayTotal > 0) {
        const dropPercentage = ((yesterdayTotal - todayTotal) / yesterdayTotal) * 100;
        if (dropPercentage >= salesDropRule.threshold && todayTotal > 0) {
          const alertExists = alerts.some(a => 
            a.ruleId === 'sales-drop' && 
            a.timestamp.toDateString() === now.toDateString() &&
            !a.acknowledged
          );
          
          if (!alertExists) {
            const alert: AlertInstance = {
              id: `sales-drop-${Date.now()}`,
              ruleId: 'sales-drop',
              message: `Baisse des ventes: ${dropPercentage.toFixed(1)}% par rapport à hier`,
              severity: 'medium',
              timestamp: now,
              acknowledged: false,
              data: { dropPercentage, todayTotal, yesterdayTotal }
            };
            newAlerts.push(alert);
            createNotification(alert);
          }
        }
      }
    }

    // Alerte aucune vente
    const noSalesRule = alertRules.find(r => r.id === 'no-sales');
    if (noSalesRule?.enabled) {
      const lastSale = sales.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())[0];
      if (lastSale) {
        const timeSinceLastSale = (now.getTime() - lastSale.createdAt.toDate().getTime()) / (1000 * 60);
        if (timeSinceLastSale >= noSalesRule.threshold) {
          const alertExists = alerts.some(a => 
            a.ruleId === 'no-sales' && 
            !a.acknowledged
          );
          
          if (!alertExists) {
            const alert: AlertInstance = {
              id: `no-sales-${Date.now()}`,
              ruleId: 'no-sales',
              message: `Aucune vente depuis ${Math.round(timeSinceLastSale)} minutes`,
              severity: 'critical',
              timestamp: now,
              acknowledged: false,
              data: { timeSinceLastSale }
            };
            newAlerts.push(alert);
            createNotification(alert);
          }
        }
      }
    }

    return newAlerts;
  }, [sales, products, employees, alerts, notificationsEnabled]);

  // Ajouter les nouvelles alertes
  useEffect(() => {
    if (analyzeData.length > 0) {
      setAlerts(prev => [...analyzeData, ...prev]);
    }
  }, [analyzeData]);

  // Marquer une alerte comme acquittée
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Supprimer une alerte
  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Activer/désactiver les notifications
  const toggleNotifications = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(false);
      } else {
        const permission = await Notification.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      }
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Alertes Intelligentes
          </h2>
          <p className="text-muted-foreground">
            Surveillance automatique et notifications temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={toggleNotifications}
            className="flex items-center gap-2"
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            {notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
          </Button>
        </div>
      </div>

      {/* Statistiques des alertes */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertes Actives</p>
                <p className="text-2xl font-bold">{unacknowledgedAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Critiques</p>
              <p className="text-2xl font-bold text-red-600">
                {unacknowledgedAlerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Élevées</p>
              <p className="text-2xl font-bold text-orange-600">
                {unacknowledgedAlerts.filter(a => a.severity === 'high').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Moyennes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {unacknowledgedAlerts.filter(a => a.severity === 'medium').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {unacknowledgedAlerts.length === 0 ? (
          <Card className="card-stats">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune alerte active</h3>
              <p className="text-muted-foreground">
                Toutes les métriques sont dans les normes. Excellent travail !
              </p>
            </CardContent>
          </Card>
        ) : (
          unacknowledgedAlerts.map((alert) => (
            <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
              <div className="flex items-start gap-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <AlertDescription className="font-medium">
                    {alert.message}
                  </AlertDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alert.timestamp.toLocaleString('fr-FR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acquitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    Ignorer
                  </Button>
                </div>
              </div>
            </Alert>
          ))
        )}
      </div>

      {/* Règles d'alerte */}
      <Card className="card-stats">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Règles d'Alerte Configurées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? 'Actif' : 'Inactif'}
                    </Badge>
                    <Badge variant="outline">
                      {rule.severity}
                    </Badge>
                  </div>
                  <h4 className="font-medium mt-1">{rule.name}</h4>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Seuil: {rule.threshold}</p>
                  <p className="text-xs text-muted-foreground">{rule.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
