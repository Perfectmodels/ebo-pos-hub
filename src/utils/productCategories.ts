// Catégories de produits spécifiques par type d'activité
export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const activityCategories: Record<string, ProductCategory[]> = {
  restaurant: [
    { id: 'entrees', name: 'Entrées', description: 'Entrées et apéritifs', icon: '🥗' },
    { id: 'plats', name: 'Plats Principaux', description: 'Plats chauds et froids', icon: '🍽️' },
    { id: 'desserts', name: 'Desserts', description: 'Desserts et douceurs', icon: '🍰' },
    { id: 'boissons', name: 'Boissons', description: 'Boissons chaudes et froides', icon: '🥤' },
    { id: 'alcool', name: 'Alcool', description: 'Vins, bières, spiritueux', icon: '🍷' },
    { id: 'accompagnements', name: 'Accompagnements', description: 'Riz, frites, légumes', icon: '🍟' }
  ],
  
  bar: [
    { id: 'bieres', name: 'Bières', description: 'Bières locales et importées', icon: '🍺' },
    { id: 'vins', name: 'Vins', description: 'Vins rouges, blancs, rosés', icon: '🍷' },
    { id: 'spiritueux', name: 'Spiritueux', description: 'Whisky, vodka, rhum, gin', icon: '🥃' },
    { id: 'cocktails', name: 'Cocktails', description: 'Cocktails maison et classiques', icon: '🍹' },
    { id: 'softs', name: 'Softs', description: 'Boissons non alcoolisées', icon: '🥤' },
    { id: 'snacks', name: 'Snacks', description: 'Petits plats et encas', icon: '🍿' }
  ],
  
  cafe: [
    { id: 'cafe', name: 'Café', description: 'Cafés et expressos', icon: '☕' },
    { id: 'the', name: 'Thé', description: 'Thés et infusions', icon: '🍵' },
    { id: 'chocolat', name: 'Chocolat', description: 'Chocolats chauds et froids', icon: '🍫' },
    { id: 'jus', name: 'Jus', description: 'Jus de fruits frais', icon: '🧃' },
    { id: 'viennoiseries', name: 'Viennoiseries', description: 'Croissants, pains au chocolat', icon: '🥐' },
    { id: 'patisseries', name: 'Pâtisseries', description: 'Gâteaux et desserts', icon: '🧁' }
  ],
  
  snack: [
    { id: 'sandwichs', name: 'Sandwichs', description: 'Sandwichs et paninis', icon: '🥪' },
    { id: 'burgers', name: 'Burgers', description: 'Burgers et hot-dogs', icon: '🍔' },
    { id: 'pizza', name: 'Pizzas', description: 'Pizzas et tartes', icon: '🍕' },
    { id: 'frites', name: 'Frites', description: 'Frites et pommes de terre', icon: '🍟' },
    { id: 'boissons', name: 'Boissons', description: 'Boissons fraîches', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', description: 'Desserts rapides', icon: '🍦' }
  ],
  
  commerce: [
    { id: 'alimentaire', name: 'Alimentaire', description: 'Produits alimentaires', icon: '🛒' },
    { id: 'boissons', name: 'Boissons', description: 'Boissons diverses', icon: '🥤' },
    { id: 'hygiene', name: 'Hygiène', description: 'Produits d\'hygiène', icon: '🧴' },
    { id: 'entretien', name: 'Entretien', description: 'Produits d\'entretien', icon: '🧽' },
    { id: 'papeterie', name: 'Papeterie', description: 'Articles de bureau', icon: '📝' },
    { id: 'divers', name: 'Divers', description: 'Autres produits', icon: '📦' }
  ],
  
  epicerie: [
    { id: 'alimentaire', name: 'Alimentaire', description: 'Produits alimentaires', icon: '🛒' },
    { id: 'boissons', name: 'Boissons', description: 'Boissons et jus', icon: '🥤' },
    { id: 'fruits-legumes', name: 'Fruits & Légumes', description: 'Fruits et légumes frais', icon: '🥬' },
    { id: 'viande-poisson', name: 'Viande & Poisson', description: 'Boucherie et poissonnerie', icon: '🥩' },
    { id: 'boulangerie', name: 'Boulangerie', description: 'Pain et pâtisseries', icon: '🥖' },
    { id: 'produits-laitiers', name: 'Produits Laitiers', description: 'Lait, fromage, yaourts', icon: '🥛' }
  ],
  
  boulangerie: [
    { id: 'pain', name: 'Pain', description: 'Pains traditionnels', icon: '🥖' },
    { id: 'viennoiseries', name: 'Viennoiseries', description: 'Croissants et brioches', icon: '🥐' },
    { id: 'patisseries', name: 'Pâtisseries', description: 'Gâteaux et tartes', icon: '🧁' },
    { id: 'sandwichs', name: 'Sandwichs', description: 'Sandwichs et paninis', icon: '🥪' },
    { id: 'boissons', name: 'Boissons', description: 'Café et jus', icon: '☕' },
    { id: 'traiteur', name: 'Traiteur', description: 'Plats préparés', icon: '🍽️' }
  ],
  
  traiteur: [
    { id: 'plats-chauds', name: 'Plats Chauds', description: 'Plats chauds préparés', icon: '🍲' },
    { id: 'plats-froids', name: 'Plats Froids', description: 'Salades et buffets froids', icon: '🥗' },
    { id: 'entrees', name: 'Entrées', description: 'Entrées et apéritifs', icon: '🍤' },
    { id: 'desserts', name: 'Desserts', description: 'Desserts et douceurs', icon: '🍰' },
    { id: 'boissons', name: 'Boissons', description: 'Boissons diverses', icon: '🥤' },
    { id: 'decoration', name: 'Décoration', description: 'Éléments décoratifs', icon: '🎀' }
  ],
  
  loisirs: [
    { id: 'activites', name: 'Activités', description: 'Services d\'animation', icon: '🎯' },
    { id: 'equipements', name: 'Équipements', description: 'Location d\'équipements', icon: '🎪' },
    { id: 'nourriture', name: 'Nourriture', description: 'Snacks et boissons', icon: '🍿' },
    { id: 'souvenirs', name: 'Souvenirs', description: 'Articles souvenirs', icon: '🎁' },
    { id: 'photos', name: 'Photos', description: 'Services photo', icon: '📸' },
    { id: 'divers', name: 'Divers', description: 'Autres services', icon: '🎨' }
  ]
};

// Fonction pour obtenir les catégories d'une activité
export const getCategoriesForActivity = (activityId: string): ProductCategory[] => {
  return activityCategories[activityId] || activityCategories.restaurant;
};

// Fonction pour obtenir le nom d'une catégorie
export const getCategoryName = (activityId: string, categoryId: string): string => {
  const categories = getCategoriesForActivity(activityId);
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
};

// Fonction pour obtenir l'icône d'une catégorie
export const getCategoryIcon = (activityId: string, categoryId: string): string => {
  const categories = getCategoriesForActivity(activityId);
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.icon : '📦';
};
