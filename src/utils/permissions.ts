// Système de permissions pour Ebo'o Gest
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'inventory' | 'staff' | 'analytics' | 'settings';
}

export const allPermissions: Permission[] = [
  // Permissions de vente
  { id: 'view_sales', name: 'Voir les ventes', description: 'Accès en lecture aux ventes', category: 'sales' },
  { id: 'add_sale', name: 'Enregistrer une vente', description: 'Créer de nouvelles ventes', category: 'sales' },
  { id: 'edit_sale', name: 'Modifier les ventes', description: 'Modifier les ventes existantes', category: 'sales' },
  { id: 'delete_sale', name: 'Supprimer les ventes', description: 'Supprimer des ventes', category: 'sales' },
  { id: 'process_payment', name: 'Traiter les paiements', description: 'Gérer les paiements', category: 'sales' },
  { id: 'manage_tables', name: 'Gérer les tables', description: 'Assigner et libérer les tables', category: 'sales' },
  { id: 'view_menu', name: 'Voir le menu', description: 'Accès au menu et aux prix', category: 'sales' },
  { id: 'edit_menu', name: 'Modifier le menu', description: 'Ajouter/modifier des plats', category: 'sales' },

  // Permissions d'inventaire
  { id: 'view_products', name: 'Voir les produits', description: 'Accès au catalogue produits', category: 'inventory' },
  { id: 'add_product', name: 'Ajouter des produits', description: 'Créer de nouveaux produits', category: 'inventory' },
  { id: 'edit_product', name: 'Modifier les produits', description: 'Modifier les produits existants', category: 'inventory' },
  { id: 'delete_product', name: 'Supprimer les produits', description: 'Supprimer des produits', category: 'inventory' },
  { id: 'manage_stock', name: 'Gérer le stock', description: 'Accès à l\'inventaire', category: 'inventory' },
  { id: 'view_orders', name: 'Voir les commandes', description: 'Accès aux commandes en cours', category: 'inventory' },
  { id: 'mark_order_complete', name: 'Marquer commande terminée', description: 'Changer le statut des commandes', category: 'inventory' },

  // Permissions de personnel
  { id: 'view_employees', name: 'Voir les employés', description: 'Accès à la liste des employés', category: 'staff' },
  { id: 'add_employee', name: 'Ajouter des employés', description: 'Créer de nouveaux employés', category: 'staff' },
  { id: 'edit_employee', name: 'Modifier les employés', description: 'Modifier les informations employés', category: 'staff' },
  { id: 'delete_employee', name: 'Supprimer les employés', description: 'Supprimer des employés', category: 'staff' },
  { id: 'manage_employees', name: 'Gérer les employés', description: 'Gestion complète du personnel', category: 'staff' },
  { id: 'view_schedule', name: 'Voir le planning', description: 'Accès au planning des équipes', category: 'staff' },
  { id: 'manage_schedule', name: 'Gérer le planning', description: 'Modifier les plannings', category: 'staff' },

  // Permissions d'analytics
  { id: 'view_reports', name: 'Voir les rapports', description: 'Accès aux rapports et analyses', category: 'analytics' },
  { id: 'export_reports', name: 'Exporter les rapports', description: 'Exporter des rapports en PDF/Excel', category: 'analytics' },
  { id: 'view_analytics', name: 'Voir les analytics', description: 'Accès aux analyses avancées', category: 'analytics' },

  // Permissions de paramètres
  { id: 'manage_settings', name: 'Gérer les paramètres', description: 'Accès aux paramètres de l\'entreprise', category: 'settings' },
  { id: 'manage_business', name: 'Gérer l\'entreprise', description: 'Modifier les informations de l\'entreprise', category: 'settings' },
  { id: 'view_logs', name: 'Voir les logs', description: 'Accès aux logs système', category: 'settings' },
  { id: 'admin_access', name: 'Accès administrateur', description: 'Accès complet au système', category: 'settings' }
];

// Permissions par rôle
export const rolePermissions: Record<string, string[]> = {
  owner: allPermissions.map(p => p.id), // Le propriétaire a tous les accès
  manager: [
    'view_sales', 'add_sale', 'edit_sale', 'delete_sale', 'process_payment',
    'manage_tables', 'view_menu', 'edit_menu',
    'view_products', 'add_product', 'edit_product', 'delete_product', 'manage_stock',
    'view_orders', 'mark_order_complete',
    'view_employees', 'add_employee', 'edit_employee', 'delete_employee', 'manage_employees',
    'view_schedule', 'manage_schedule',
    'view_reports', 'export_reports', 'view_analytics',
    'manage_settings', 'manage_business'
  ],
  caissier: [
    'view_sales', 'add_sale', 'process_payment',
    'view_menu', 'view_products', 'manage_stock'
  ],
  serveur: [
    'view_sales', 'add_sale', 'manage_tables', 'view_menu'
  ],
  cuisinier: [
    'view_orders', 'mark_order_complete', 'view_menu', 'manage_stock'
  ],
  barman: [
    'view_sales', 'add_sale', 'manage_stock', 'view_menu'
  ],
  vendeur: [
    'view_sales', 'add_sale', 'process_payment', 'view_products', 'manage_stock'
  ]
};

// Hook pour vérifier les permissions
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionId: string): boolean => {
    if (!user) {
      console.log('PermissionGate - Aucun utilisateur connecté');
      return false;
    }
    
    // Le propriétaire (utilisateur connecté) a toujours tous les accès
    if (user.uid) {
      console.log(`PermissionGate - Propriétaire connecté (${user.email}), accès accordé à: ${permissionId}`);
      return true;
    }

    // Pour les employés, vérifier leurs permissions basées sur leur rôle
    // Cette logique sera étendue quand on aura le système d'employés avec rôles
    console.log('PermissionGate - Utilisateur non propriétaire, accès refusé à:', permissionId);
    return false;
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some(permissionId => hasPermission(permissionId));
  };

  const hasAllPermissions = (permissionIds: string[]): boolean => {
    return permissionIds.every(permissionId => hasPermission(permissionId));
  };

  const getPermissionsForRole = (role: string): string[] => {
    return rolePermissions[role] || [];
  };

  const isOwner = (): boolean => {
    return !!user?.uid; // L'utilisateur connecté est toujours le propriétaire
  };

  const isEmployee = (): boolean => {
    // Cette fonction sera utilisée quand on aura un système d'employés
    return false;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissionsForRole,
    isOwner,
    isEmployee,
    allPermissions
  };
};

// Composant pour les permissions conditionnelles
export const PermissionGate = ({ 
  permission, 
  permissions, 
  children, 
  fallback = null 
}: {
  permission?: string;
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const { hasPermission, hasAnyPermission } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = hasAnyPermission(permissions);
  }

  return hasAccess ? children : fallback;
};

// Hook pour les permissions d'employé spécifiques
export const useEmployeePermissions = (employeeRole?: string) => {
  const { isOwner } = usePermissions();

  const getEmployeePermissions = (role: string): string[] => {
    if (isOwner()) {
      return allPermissions.map(p => p.id); // Propriétaire = tous les accès
    }
    return getPermissionsForRole(role);
  };

  const hasEmployeePermission = (permissionId: string, role?: string): boolean => {
    const effectiveRole = role || employeeRole;
    if (!effectiveRole) return false;

    if (isOwner()) return true; // Propriétaire = tous les accès

    const rolePermissions = getEmployeePermissions(effectiveRole);
    return rolePermissions.includes(permissionId);
  };

  return {
    getEmployeePermissions,
    hasEmployeePermission,
    isOwner
  };
};
