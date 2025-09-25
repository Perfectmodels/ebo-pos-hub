import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useProducts } from "@/hooks/useProducts";
import { useEmployees } from "@/hooks/useEmployees";
import { useSales } from "@/hooks/useSales";
import { 
  Bell, 
  Mail, 
  Users, 
  Package, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Check,
  Filter
} from "lucide-react";

interface Notification {
  id: string;
  type: 'new_user' | 'new_pme' | 'low_stock' | 'daily_report' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'new_user' | 'new_pme' | 'low_stock'>('all');
  const [loading, setLoading] = useState(false);

  // Utiliser les vraies données pour générer les notifications
  const { products } = useProducts();
  const { employees } = useEmployees();
  const { sales } = useSales();

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Notifications de stock faible
      const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);
      lowStockProducts.forEach(product => {
        newNotifications.push({
          id: `low_stock_${product.id}`,
          type: 'low_stock',
          title: 'Stock faible',
          message: `${product.name} - Stock: ${product.current_stock}/${product.min_stock} unités`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high',
          data: {
            productName: product.name,
            currentStock: product.current_stock,
            minStock: product.min_stock
          }
        });
      });

      // Notifications de nouveaux employés
      const recentEmployees = employees.filter(emp => {
        // Les employés récents (dans les 24h)
        const createdAt = new Date(emp.created_at || new Date().toISOString());
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return createdAt > oneDayAgo;
      });
      recentEmployees.forEach(employee => {
        newNotifications.push({
          id: `new_employee_${employee.id}`,
          type: 'new_user',
          title: 'Nouvel employé',
          message: `${employee.full_name} s'est inscrit comme ${employee.role}`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          data: {
            userName: employee.full_name,
            role: employee.role
          }
        });
      });

      // Notifications de ventes du jour
      const todaySales = sales.filter(sale => {
        const saleDate = sale.createdAt.toDate();
        const today = new Date();
        return saleDate.toDateString() === today.toDateString();
      });
      
      if (todaySales.length > 0) {
        const totalTodaySales = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        newNotifications.push({
          id: 'daily_sales',
          type: 'daily_report',
          title: 'Rapport quotidien',
          message: `Ventes du jour: ${totalTodaySales.toLocaleString()} FCFA`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'low',
          data: {
            totalSales: totalTodaySales,
            orderCount: todaySales.length
          }
        });
      }

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [products, employees, sales]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'new_pme':
        return <Bell className="w-4 h-4 text-green-600" />;
      case 'low_stock':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'daily_report':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centre de Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Toutes ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Non lues ({unreadCount})
            </Button>
            <Button
              variant={filter === 'new_pme' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('new_pme')}
            >
              Nouvelles PME
            </Button>
            <Button
              variant={filter === 'new_user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('new_user')}
            >
              Nouveaux utilisateurs
            </Button>
            <Button
              variant={filter === 'low_stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low_stock')}
            >
              Stock faible
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Historique de toutes vos notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="space-y-0">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < filteredNotifications.length - 1 && <Separator />}
                </div>
              ))}
              
              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune notification trouvée</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
