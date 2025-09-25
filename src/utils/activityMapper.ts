// Mapper pour convertir les types d'activité du formulaire d'inscription vers les IDs de l'ActivityContext

export const businessTypeToActivityId = (businessType: string): string => {
  const mapping: Record<string, string> = {
    'restaurant': 'restaurant',
    'snack': 'snack', 
    'bar': 'bar',
    'cafe': 'snack', // Les cafés utilisent la config snack
    'commerce': 'epicerie',
    'boutique': 'epicerie', // Les boutiques utilisent la config épicerie
    'pharmacie': 'epicerie', // Les pharmacies utilisent la config épicerie
    'boulangerie': 'boulangerie',
    'traiteur': 'traiteur',
    'loisirs': 'loisirs',
    'autre': 'restaurant' // Par défaut, utiliser la config restaurant
  };

  return mapping[businessType.toLowerCase()] || 'restaurant';
};

// Mapper inverse pour l'affichage
export const activityIdToBusinessType = (activityId: string): string => {
  const mapping: Record<string, string> = {
    'restaurant': 'restaurant',
    'snack': 'snack',
    'bar': 'bar', 
    'epicerie': 'commerce',
    'boulangerie': 'boulangerie',
    'traiteur': 'traiteur',
    'loisirs': 'loisirs'
  };

  return mapping[activityId] || 'restaurant';
};

// Fonction pour valider qu'un type d'activité est supporté
export const isSupportedActivityType = (businessType: string): boolean => {
  const supportedTypes = [
    'restaurant', 'snack', 'bar', 'cafe', 'commerce', 
    'boutique', 'pharmacie', 'boulangerie', 'traiteur', 
    'loisirs', 'autre'
  ];
  
  return supportedTypes.includes(businessType.toLowerCase());
};
