// Configuration pour supprimer les avertissements de console en développement
if (process.env.NODE_ENV === 'development') {
  // Supprimer les avertissements React Router
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0]?.includes?.('React Router Future Flag Warning') ||
      args[0]?.includes?.('v7_startTransition') ||
      args[0]?.includes?.('v7_relativeSplatPath')
    ) {
      return; // Ignorer ces avertissements spécifiques
    }
    originalWarn.apply(console, args);
  };

  // Supprimer les avertissements d'icônes manquantes
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args[0]?.includes?.('Error while trying to use the following icon from the Manifest') ||
      args[0]?.includes?.('Download error or resource isn\'t a valid image')
    ) {
      return; // Ignorer ces erreurs d'icônes
    }
    originalError.apply(console, args);
  };
}
