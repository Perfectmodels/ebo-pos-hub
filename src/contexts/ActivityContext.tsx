import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { businessTypeToActivityId } from '@/utils/activityMapper';
import { GABON_CONFIG } from '@/config/gabon';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';

export interface ActivityConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  features: string[];
  dashboardWidgets: string[];
  sidebarItems: SidebarItem[];
  defaultSettings: Record<string, any>;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description: string;
  priority: number;
}

export interface ActivityContextType {
  currentActivity: ActivityConfig | null;
  setActivity: (activity: ActivityConfig) => void;
  getActivityConfig: (activityId: string) => ActivityConfig;
  isFeatureEnabled: (feature: string) => boolean;
  getSidebarItems: () => SidebarItem[];
  getDashboardWidgets: () => string[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

// Configurations par type d'activité
const activityConfigs: Record<string, ActivityConfig> = {
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    color: 'bg-blue-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'reservations', 'menu', 'tables'],
    dashboardWidgets: ['sales', 'reservations', 'popular-dishes', 'table-status', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'reservations', label: 'Réservations', icon: 'Calendar', path: '/reservations', description: 'Gestion des réservations', priority: 3 },
      { id: 'menu', label: 'Menu', icon: 'Utensils', path: '/menu', description: 'Gestion du menu', priority: 4 },
      { id: 'tables', label: 'Tables', icon: 'Square', path: '/tables', description: 'Gestion des tables', priority: 5 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 6 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 7 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 8 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      serviceCharge: 10,
      tableManagement: true,
      reservationSystem: true,
      menuCategories: ['Entrées', 'Plats principaux', 'Desserts', 'Boissons']
    }
  },
  
  snack: {
    id: 'snack',
    name: 'Snack',
    icon: '🥪',
    color: 'bg-orange-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'delivery', 'quick-menu'],
    dashboardWidgets: ['sales', 'popular-items', 'delivery-status', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'menu', label: 'Menu Rapide', icon: 'Zap', path: '/menu', description: 'Menu express', priority: 3 },
      { id: 'delivery', label: 'Livraison', icon: 'Truck', path: '/delivery', description: 'Gestion livraisons', priority: 4 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 5 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 6 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 7 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      deliveryFee: 500,
      quickService: true,
      menuCategories: ['Sandwichs', 'Boissons', 'Snacks', 'Desserts']
    }
  },
  
  bar: {
    id: 'bar',
    name: 'Bar',
    icon: '🍻',
    color: 'bg-amber-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'inventory', 'happy-hour'],
    dashboardWidgets: ['sales', 'popular-drinks', 'inventory-alerts', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'inventory', label: 'Inventaire', icon: 'Wine', path: '/inventory', description: 'Gestion des boissons', priority: 3 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 4 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 5 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 6 },
      { id: 'admin', label: 'Admin Panel', icon: 'Shield', path: '/admin', description: 'Panel administrateur', priority: 7 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      happyHourStart: '17:00',
      happyHourEnd: '19:00',
      happyHourDiscount: 20,
      drinkCategories: ['Bières', 'Vins', 'Spiritueux', 'Cocktails', 'Softs']
    }
  },
  
  epicerie: {
    id: 'epicerie',
    name: 'Épicerie / Supérette',
    icon: '🛍️',
    color: 'bg-green-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'inventory', 'suppliers'],
    dashboardWidgets: ['sales', 'low-stock', 'suppliers', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'inventory', label: 'Inventaire', icon: 'Package', path: '/inventory', description: 'Gestion des produits', priority: 3 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 4 },
      { id: 'suppliers', label: 'Fournisseurs', icon: 'Truck', path: '/suppliers', description: 'Gestion fournisseurs', priority: 5 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 6 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 7 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      lowStockThreshold: 10,
      productCategories: ['Alimentaire', 'Boissons', 'Hygiène', 'Entretien', 'Autres']
    }
  },
  
  boulangerie: {
    id: 'boulangerie',
    name: 'Boulangerie / Pâtisserie',
    icon: '🍞',
    color: 'bg-yellow-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'production', 'recipes'],
    dashboardWidgets: ['sales', 'production-plan', 'popular-items', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'production', label: 'Production', icon: 'ChefHat', path: '/production', description: 'Planification production', priority: 3 },
      { id: 'recipes', label: 'Recettes', icon: 'BookOpen', path: '/recipes', description: 'Gestion des recettes', priority: 4 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 5 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 6 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 7 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      productionStart: '04:00',
      productionEnd: '08:00',
      productCategories: ['Pain', 'Viennoiseries', 'Pâtisseries', 'Sandwichs', 'Boissons']
    }
  },
  
  traiteur: {
    id: 'traiteur',
    name: 'Service traiteur / Livraison',
    icon: '🚚',
    color: 'bg-red-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'delivery', 'events', 'catering'],
    dashboardWidgets: ['sales', 'delivery-status', 'events', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'events', label: 'Événements', icon: 'Calendar', path: '/events', description: 'Gestion des événements', priority: 3 },
      { id: 'delivery', label: 'Livraison', icon: 'Truck', path: '/delivery', description: 'Gestion livraisons', priority: 4 },
      { id: 'catering', label: 'Traiteur', icon: 'ChefHat', path: '/catering', description: 'Services traiteur', priority: 5 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 6 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 7 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 8 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      deliveryRadius: 10,
      eventCategories: ['Mariages', 'Anniversaires', 'Entreprises', 'Autres']
    }
  },
  
  loisirs: {
    id: 'loisirs',
    name: 'Loisirs & Animation',
    icon: '🎶',
    color: 'bg-pink-500',
    features: ['pos', 'stock', 'personnel', 'rapports', 'events', 'bookings'],
    dashboardWidgets: ['sales', 'bookings', 'events', 'staff-performance'],
    sidebarItems: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'BarChart3', path: '/dashboard', description: 'Vue d\'ensemble', priority: 1 },
      { id: 'pos', label: 'Caisse', icon: 'ShoppingCart', path: '/ventes', description: 'Point de vente', priority: 2 },
      { id: 'bookings', label: 'Réservations', icon: 'Calendar', path: '/bookings', description: 'Gestion des réservations', priority: 3 },
      { id: 'events', label: 'Événements', icon: 'Music', path: '/events', description: 'Gestion des événements', priority: 4 },
      { id: 'stock', label: 'Stock', icon: 'Package', path: '/stock', description: 'Gestion des stocks', priority: 5 },
      { id: 'personnel', label: 'Personnel', icon: 'Users', path: '/personnel', description: 'Gestion du personnel', priority: 6 },
      { id: 'rapports', label: 'Rapports', icon: 'FileText', path: '/rapports', description: 'Rapports et analyses', priority: 7 }
    ],
    defaultSettings: {
      currency: 'FCFA',
      taxRate: 18,
      bookingDuration: 60,
      eventTypes: ['Karaoké', 'Billard', 'Jeux', 'Concerts', 'Autres']
    }
  }
};

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentActivity, setCurrentActivity] = useState<ActivityConfig | null>(null);

  // Charger l'activité depuis le profil utilisateur
  useEffect(() => {
    if (user) {
      // Récupérer l'activité depuis le profil utilisateur dans Firestore
      const fetchUserActivity = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, 'businesses', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const businessType = userData.businessType || 'restaurant';
            const activityId = businessTypeToActivityId(businessType);
            setActivity(getActivityConfig(activityId));
          } else {
            // Fallback vers localStorage ou valeur par défaut
            const userActivity = localStorage.getItem('userActivity') || 'restaurant';
            setActivity(getActivityConfig(userActivity));
          }
        } catch (error) {
          console.error('Erreur lors du chargement de l\'activité:', error);
          // Fallback vers localStorage ou valeur par défaut
          const userActivity = localStorage.getItem('userActivity') || 'restaurant';
          setActivity(getActivityConfig(userActivity));
        }
      };
      
      fetchUserActivity();
    }
  }, [user]);

  const setActivity = (activity: ActivityConfig) => {
    setCurrentActivity(activity);
    localStorage.setItem('userActivity', activity.id);
  };

  const getActivityConfig = (activityId: string): ActivityConfig => {
    return activityConfigs[activityId] || activityConfigs.restaurant;
  };

  const isFeatureEnabled = (feature: string): boolean => {
    return currentActivity?.features.includes(feature) || false;
  };

  const getSidebarItems = (): SidebarItem[] => {
    return currentActivity?.sidebarItems || [];
  };

  const getDashboardWidgets = (): string[] => {
    return currentActivity?.dashboardWidgets || [];
  };

  return (
    <ActivityContext.Provider value={{
      currentActivity,
      setActivity,
      getActivityConfig,
      isFeatureEnabled,
      getSidebarItems,
      getDashboardWidgets
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
