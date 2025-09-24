// Configuration Google OAuth
export const googleConfig = {
  // Ces valeurs doivent être configurées dans Supabase Dashboard
  // Authentication > Providers > Google
  
  // URL de redirection pour le développement
  redirectUrls: {
    development: 'http://localhost:8080/auth/callback',
    production: 'https://eboo-gest.vercel.app/auth/callback'
  },
  
  // Scopes Google OAuth
  scopes: [
    'openid',
    'email',
    'profile'
  ],
  
  // Configuration des paramètres de requête
  queryParams: {
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true'
  }
};

export const getGoogleRedirectUrl = () => {
  return googleConfig.redirectUrls[process.env.NODE_ENV === 'production' ? 'production' : 'development'];
};

export const getGoogleScopes = () => {
  return googleConfig.scopes.join(' ');
};

export const getGoogleQueryParams = () => {
  return googleConfig.queryParams;
};
