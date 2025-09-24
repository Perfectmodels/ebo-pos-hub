import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

  // Données simulées pour la démo
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'new_pme',
      title: 'Nouvelle inscription PME',
      message: 'Restaurant Le Bon Goût s\'est inscrit (Restaurant - Yaoundé)',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      priority: 'high',
      data: {
        companyName: 'Restaurant Le Bon Goût',
        activityType: 'Restaurant',
        city: 'Yaoundé'
      }
    },
    {
      id: '2',
      type: 'new_user',
      title: 'Nouvel utilisateur',
      message: 'Jean Dupont s\'est inscrit comme Vendeur',
      timestamp: '2024-01-15T09:15:00Z',
      read: false,
      priority: 'medium',
      data: {
        userName: 'Jean Dupont',
        role: 'Vendeur'
      }
    },
    {
      id: '3',
      type: 'low_stock',
      title: 'Stock faible',
      message: 'Coca-Cola 33cl - Stock: 5/10 unités',
      timestamp: '2024-01-15T08:45:00Z',
      read: true,
      priority: 'high',
      data: {
        productName: 'Coca-Cola 33cl',
        currentStock: 5,
        minStock: 10
      }
    },
    {
      id: '4',
      type: 'daily_report',
      title: 'Rapport quotidien',
      message: 'Ventes du jour: 125,000 FCFA (+12% vs hier)',
      timestamp: '2024-01-14T18:00:00Z',
      read: true,
      priority: 'low',
      data: {
        totalSales: 125000,
        growth: 12
      }
    },
    {
      id: '5',
      type: 'system',
      title: 'Mise à jour système',
      message: 'Nouvelle version disponible avec fonctionnalités QR',
      timestamp: '2024-01-14T16:30:00Z',
      read: true,
      priority: 'medium',
      data: {
        version: '2.1.0',
        features: ['QR Scanner', 'Notifications Email']
      }
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

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
