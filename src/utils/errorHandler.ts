/**
 * Gestionnaire d'erreurs centralisé pour l'application
 */

export interface ErrorInfo {
  type: 'auth' | 'network' | 'validation' | 'unknown';
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

export class AppError extends Error {
  public type: ErrorInfo['type'];
  public code?: string;
  public details?: any;

  constructor(message: string, type: ErrorInfo['type'] = 'unknown', code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
  }
}

export function handleSupabaseError(error: any): AppError {
  console.error('🔍 Erreur Supabase détaillée:', {
    message: error.message,
    status: error.status,
    statusText: error.statusText,
    details: error.details,
    hint: error.hint,
    code: error.code
  });

  // Erreurs d'authentification
  if (error.message?.includes('Invalid login credentials')) {
    return new AppError('Email ou mot de passe incorrect', 'auth', 'INVALID_CREDENTIALS');
  }

  if (error.message?.includes('Email not confirmed')) {
    return new AppError('Votre compte n\'est pas encore activé', 'auth', 'EMAIL_NOT_CONFIRMED');
  }

  if (error.message?.includes('User already registered')) {
    return new AppError('Cet email est déjà utilisé', 'auth', 'USER_EXISTS');
  }

  if (error.message?.includes('Password should be at least')) {
    return new AppError('Le mot de passe doit contenir au moins 6 caractères', 'validation', 'WEAK_PASSWORD');
  }

  // Erreurs réseau
  if (error.status === 500) {
    return new AppError('Erreur serveur Supabase. Vérifiez votre configuration.', 'network', 'SERVER_ERROR', {
      status: error.status,
      message: error.message
    });
  }

  if (error.status === 0 || !navigator.onLine) {
    return new AppError('Problème de connexion. Vérifiez votre internet.', 'network', 'NO_CONNECTION');
  }

  // Erreurs de validation
  if (error.message?.includes('Invalid email')) {
    return new AppError('Format d\'email invalide', 'validation', 'INVALID_EMAIL');
  }

  // Erreur générique
  return new AppError(
    error.message || 'Une erreur inattendue s\'est produite',
    'unknown',
    error.code || 'UNKNOWN_ERROR',
    error
  );
}

export function logError(error: AppError, context?: string) {
  const errorInfo: ErrorInfo = {
    type: error.type,
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: new Date().toISOString()
  };

  console.error(`❌ Erreur ${context ? `(${context})` : ''}:`, errorInfo);

  // Ici vous pourriez envoyer l'erreur à un service de monitoring
  // comme Sentry, LogRocket, etc.
}

export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Une erreur inattendue s\'est produite';
}
