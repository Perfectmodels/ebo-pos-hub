// Configuration Supabase
export const supabaseConfig = {
  // URLs de redirection pour l'authentification
  redirectUrls: {
    development: 'http://localhost:8080',
    production: 'https://eboo-gest.vercel.app'
  },
  
  // URLs de callback
  callbackUrls: {
    development: 'http://localhost:8080/confirm-signup',
    production: 'https://eboo-gest.vercel.app/confirm-signup'
  },
  
  // Configuration des emails
  email: {
    confirmEmail: true,
    confirmEmailUrl: process.env.NODE_ENV === 'production' 
      ? 'https://eboo-gest.vercel.app/confirm-signup'
      : 'http://localhost:8080/confirm-signup',
    resetPasswordUrl: process.env.NODE_ENV === 'production'
      ? 'https://eboo-gest.vercel.app/auth/reset-password'
      : 'http://localhost:8080/auth/reset-password'
  }
};

// Fonction pour obtenir l'URL de redirection appropriée
export const getRedirectUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? supabaseConfig.redirectUrls.production
    : supabaseConfig.redirectUrls.development;
};

// Fonction pour obtenir l'URL de callback appropriée
export const getCallbackUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? supabaseConfig.callbackUrls.production
    : supabaseConfig.callbackUrls.development;
};
