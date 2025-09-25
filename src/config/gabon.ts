// Configuration spécifique au Gabon - Ebo'o Gest

export const GABON_CONFIG = {
  // Informations géographiques
  country: 'Gabon',
  currency: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Franc CFA'
  },
  
  // Villes principales du Gabon
  cities: [
    { name: 'Libreville', code: 'LBV', isCapital: true },
    { name: 'Port-Gentil', code: 'POG', isCapital: false },
    { name: 'Franceville', code: 'MVB', isCapital: false },
    { name: 'Oyem', code: 'OYE', isCapital: false },
    { name: 'Moanda', code: 'MFF', isCapital: false },
    { name: 'Lambaréné', code: 'LBQ', isCapital: false },
    { name: 'Mouila', code: 'MJL', isCapital: false },
    { name: 'Koulamoutou', code: 'KOU', isCapital: false },
    { name: 'Tchibanga', code: 'TCH', isCapital: false },
    { name: 'Lastoursville', code: 'LTB', isCapital: false }
  ],
  
  // Types d'activité populaires au Gabon
  businessTypes: [
    { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
    { id: 'snack', name: 'Snack', icon: '🥪' },
    { id: 'bar', name: 'Bar', icon: '🍻' },
    { id: 'cafe', name: 'Café', icon: '☕' },
    { id: 'epicerie', name: 'Épicerie', icon: '🛒' },
    { id: 'boulangerie', name: 'Boulangerie', icon: '🥖' },
    { id: 'hotel', name: 'Hôtel', icon: '🏨' },
    { id: 'pharmacie', name: 'Pharmacie', icon: '💊' },
    { id: 'supermarche', name: 'Supermarché', icon: '🏪' },
    { id: 'traiteur', name: 'Traiteur', icon: '🍱' },
    { id: 'service', name: 'Service', icon: '🔧' },
    { id: 'loisirs', name: 'Loisirs', icon: '🎮' }
  ],
  
  // Format de numéro de téléphone gabonais
  phoneFormat: {
    countryCode: '+241',
    pattern: '+241 XX XX XX XX',
    example: '+241 01 23 45 67'
  },
  
  // Domaines email populaires au Gabon
  emailDomains: [
    '@lapaillote.ga',
    '@restaurant-gabon.ga',
    '@libreville.ga',
    '@portgentil.ga',
    '@gmail.com',
    '@yahoo.fr',
    '@hotmail.com'
  ],
  
  // Exemples d'entreprises gabonaises
  businessExamples: {
    restaurant: [
      'Restaurant La Paillote',
      'Le Relais du Gabon',
      'Restaurant Chez Mama',
      'La Pergola',
      'Restaurant Le Baobab'
    ],
    bar: [
      'Bar Le Phoenix',
      'Le Bistrot Gabonais',
      'Bar Le Coco Beach',
      'La Terrasse',
      'Bar Le Tropique'
    ],
    cafe: [
      'Café de la Paix',
      'Le Petit Paris',
      'Café Libreville',
      'La Brasserie',
      'Café des Arts'
    ],
    hotel: [
      'Hôtel Le Méridien',
      'Hotel Intercontinental',
      'Hotel Montagne Sainte',
      'Hotel Radisson Blu',
      'Hotel Sofitel'
    ]
  },
  
  // Configuration des impôts et taxes (exemple)
  taxes: {
    tva: 18, // TVA au Gabon
    service: 10, // Taxe de service
    municipal: 5 // Taxe municipale
  },
  
  // Langues supportées
  languages: [
    { code: 'fr', name: 'Français', native: 'Français' },
    { code: 'en', name: 'Anglais', native: 'English' }
  ],
  
  // Fuseau horaire
  timezone: 'Africa/Libreville',
  
  // Format de date local
  dateFormat: 'DD/MM/YYYY',
  
  // Configuration des paiements
  paymentMethods: [
    { id: 'cash', name: 'Espèces', icon: '💵' },
    { id: 'card', name: 'Carte bancaire', icon: '💳' },
    { id: 'mobile', name: 'Mobile Money', icon: '📱' },
    { id: 'transfer', name: 'Virement', icon: '🏦' }
  ],
  
  // Mobile Money providers au Gabon
  mobileMoneyProviders: [
    { name: 'Airtel Money', code: 'AIRTEL' },
    { name: 'Moov Money', code: 'MOOV' },
    { name: 'Orange Money', code: 'ORANGE' }
  ]
};

// Fonction utilitaire pour formater les numéros de téléphone gabonais
export const formatGabonPhoneNumber = (phone: string): string => {
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '');
  
  // Ajouter l'indicatif pays si nécessaire
  if (cleaned.startsWith('241')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('01') || cleaned.startsWith('02') || cleaned.startsWith('03') || cleaned.startsWith('04') || cleaned.startsWith('05') || cleaned.startsWith('06') || cleaned.startsWith('07')) {
    return `+241 ${cleaned}`;
  }
  
  return phone;
};

// Fonction pour valider un numéro de téléphone gabonais
export const isValidGabonPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('241') && cleaned.length === 12;
};

// Fonction pour obtenir une ville par son code
export const getCityByCode = (code: string) => {
  return GABON_CONFIG.cities.find(city => city.code === code);
};

// Fonction pour obtenir un type d'activité par son ID
export const getBusinessTypeById = (id: string) => {
  return GABON_CONFIG.businessTypes.find(type => type.id === id);
};
