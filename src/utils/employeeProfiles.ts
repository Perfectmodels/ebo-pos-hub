// Profils d'employés spécifiques par type d'activité

export interface EmployeeRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  icon: string;
  color: string;
}

export interface ActivityEmployeeProfiles {
  [activityId: string]: {
    name: string;
    roles: EmployeeRole[];
    defaultRole: string;
  };
}

export const employeeProfiles: ActivityEmployeeProfiles = {
  restaurant: {
    name: "Restaurant",
    defaultRole: "serveur",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du restaurant",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "serveur",
        name: "Serveur/Serveuse",
        description: "Service client et prise de commandes",
        permissions: ["ventes", "clients", "commandes"],
        icon: "🍽️",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "cuisinier",
        name: "Cuisinier",
        description: "Préparation des plats et gestion cuisine",
        permissions: ["cuisine", "stock_cuisine", "commandes_cuisine"],
        icon: "👨‍🍳",
        color: "bg-orange-100 text-orange-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-green-100 text-green-800"
      },
      {
        id: "plongeur",
        name: "Plongeur",
        description: "Nettoyage et entretien",
        permissions: ["nettoyage", "entretien"],
        icon: "🧽",
        color: "bg-gray-100 text-gray-800"
      }
    ]
  },

  snack: {
    name: "Snack",
    defaultRole: "vendeur",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du snack",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "vendeur",
        name: "Vendeur/Vendeuse",
        description: "Vente et service client",
        permissions: ["ventes", "clients", "preparation"],
        icon: "🍔",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "cuisinier",
        name: "Cuisinier",
        description: "Préparation rapide des plats",
        permissions: ["cuisine_rapide", "stock_cuisine", "commandes_cuisine"],
        icon: "👨‍🍳",
        color: "bg-orange-100 text-orange-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-green-100 text-green-800"
      }
    ]
  },

  bar: {
    name: "Bar",
    defaultRole: "barman",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du bar",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "barman",
        name: "Barman/Barmaid",
        description: "Préparation des boissons et service",
        permissions: ["bar", "preparation_boissons", "clients"],
        icon: "🍸",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "serveur",
        name: "Serveur/Serveuse",
        description: "Service en salle",
        permissions: ["ventes", "clients", "commandes"],
        icon: "🍽️",
        color: "bg-green-100 text-green-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-yellow-100 text-yellow-800"
      },
      {
        id: "securite",
        name: "Agent de sécurité",
        description: "Sécurité et surveillance",
        permissions: ["securite", "surveillance"],
        icon: "🛡️",
        color: "bg-red-100 text-red-800"
      }
    ]
  },

  cafe: {
    name: "Café",
    defaultRole: "barista",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du café",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "barista",
        name: "Barista",
        description: "Préparation du café et service",
        permissions: ["cafe", "preparation_cafe", "clients"],
        icon: "☕",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "serveur",
        name: "Serveur/Serveuse",
        description: "Service client et vente",
        permissions: ["ventes", "clients", "commandes"],
        icon: "🍽️",
        color: "bg-green-100 text-green-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-yellow-100 text-yellow-800"
      }
    ]
  },

  epicerie: {
    name: "Épicerie",
    defaultRole: "vendeur",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète de l'épicerie",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "vendeur",
        name: "Vendeur/Vendeuse",
        description: "Vente et conseil client",
        permissions: ["ventes", "clients", "conseil"],
        icon: "🛒",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-green-100 text-green-800"
      },
      {
        id: "inventaire",
        name: "Agent d'inventaire",
        description: "Gestion des stocks et inventaire",
        permissions: ["stock", "inventaire", "reception"],
        icon: "📦",
        color: "bg-orange-100 text-orange-800"
      }
    ]
  },

  boulangerie: {
    name: "Boulangerie",
    defaultRole: "vendeur",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète de la boulangerie",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "boulanger",
        name: "Boulanger/Boulangère",
        description: "Fabrication du pain et pâtisseries",
        permissions: ["production", "fabrication", "recettes"],
        icon: "🥖",
        color: "bg-orange-100 text-orange-800"
      },
      {
        id: "vendeur",
        name: "Vendeur/Vendeuse",
        description: "Vente et service client",
        permissions: ["ventes", "clients", "conseil"],
        icon: "🛒",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "caissier",
        name: "Caissier/Caissière",
        description: "Encaissement et gestion caisse",
        permissions: ["ventes", "encaissement", "clients"],
        icon: "💰",
        color: "bg-green-100 text-green-800"
      }
    ]
  },

  traiteur: {
    name: "Traiteur",
    defaultRole: "cuisinier",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du traiteur",
        permissions: ["gestion_complete", "finances", "personnel", "stock", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "cuisinier",
        name: "Cuisinier",
        description: "Préparation des plats traiteur",
        permissions: ["cuisine", "preparation", "recettes"],
        icon: "👨‍🍳",
        color: "bg-orange-100 text-orange-800"
      },
      {
        id: "livreur",
        name: "Livreur",
        description: "Livraison des commandes",
        permissions: ["livraison", "logistique"],
        icon: "🚚",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "vendeur",
        name: "Vendeur/Vendeuse",
        description: "Prise de commandes et vente",
        permissions: ["ventes", "clients", "commandes"],
        icon: "📞",
        color: "bg-green-100 text-green-800"
      }
    ]
  },

  loisirs: {
    name: "Centre de loisirs",
    defaultRole: "animateur",
    roles: [
      {
        id: "gerant",
        name: "Gérant",
        description: "Gestion complète du centre",
        permissions: ["gestion_complete", "finances", "personnel", "activites", "rapports"],
        icon: "👨‍💼",
        color: "bg-purple-100 text-purple-800"
      },
      {
        id: "animateur",
        name: "Animateur/Animatrice",
        description: "Animation et activités",
        permissions: ["animation", "activites", "clients"],
        icon: "🎭",
        color: "bg-blue-100 text-blue-800"
      },
      {
        id: "vendeur",
        name: "Vendeur/Vendeuse",
        description: "Vente de produits/services",
        permissions: ["ventes", "clients", "conseil"],
        icon: "🛒",
        color: "bg-green-100 text-green-800"
      },
      {
        id: "accueil",
        name: "Agent d'accueil",
        description: "Accueil et information clients",
        permissions: ["accueil", "information", "clients"],
        icon: "👋",
        color: "bg-yellow-100 text-yellow-800"
      }
    ]
  }
};

// Fonction pour obtenir les profils d'une activité
export const getEmployeeProfiles = (activityId: string) => {
  return employeeProfiles[activityId] || employeeProfiles.restaurant;
};

// Fonction pour obtenir tous les rôles d'une activité
export const getActivityRoles = (activityId: string): EmployeeRole[] => {
  return getEmployeeProfiles(activityId).roles;
};

// Fonction pour obtenir un rôle spécifique
export const getRole = (activityId: string, roleId: string): EmployeeRole | null => {
  const roles = getActivityRoles(activityId);
  return roles.find(role => role.id === roleId) || null;
};

// Fonction pour obtenir le rôle par défaut d'une activité
export const getDefaultRole = (activityId: string): EmployeeRole => {
  const profiles = getEmployeeProfiles(activityId);
  const defaultRoleId = profiles.defaultRole;
  return getRole(activityId, defaultRoleId) || profiles.roles[0];
};
