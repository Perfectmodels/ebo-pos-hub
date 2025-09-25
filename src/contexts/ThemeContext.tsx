import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

interface BrandTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  logo?: string;
  favicon?: string;
  fonts: {
    primary: string;
    secondary: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadows: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface ThemeContextType {
  currentTheme: BrandTheme;
  availableThemes: BrandTheme[];
  setTheme: (themeId: string) => void;
  customTheme: BrandTheme | null;
  createCustomTheme: (theme: Omit<BrandTheme, 'id'>) => void;
  resetToDefault: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Thèmes prédéfinis
const defaultThemes: BrandTheme[] = [
  {
    id: 'default',
    name: 'Ebo\'o Gest',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter'
    },
    borderRadius: 'md',
    shadows: 'md'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Classique',
    colors: {
      primary: '#dc2626',
      secondary: '#7c2d12',
      accent: '#fbbf24',
      background: '#fefefe',
      foreground: '#1f2937',
      muted: '#f9fafb',
      border: '#e5e7eb',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    borderRadius: 'lg',
    shadows: 'lg'
  },
  {
    id: 'bar',
    name: 'Bar Moderne',
    colors: {
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#fbbf24',
      background: '#0f0f23',
      foreground: '#f8fafc',
      muted: '#1e293b',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    fonts: {
      primary: 'Oswald',
      secondary: 'Inter'
    },
    borderRadius: 'xl',
    shadows: 'xl'
  },
  {
    id: 'cafe',
    name: 'Café Cosy',
    colors: {
      primary: '#92400e',
      secondary: '#451a03',
      accent: '#f59e0b',
      background: '#fefbf3',
      foreground: '#292524',
      muted: '#f5f5f4',
      border: '#d6d3d1',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    fonts: {
      primary: 'Crimson Text',
      secondary: 'Inter'
    },
    borderRadius: 'md',
    shadows: 'sm'
  },
  {
    id: 'commerce',
    name: 'Commerce Pro',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#06b6d4',
      background: '#ffffff',
      foreground: '#111827',
      muted: '#f3f4f6',
      border: '#d1d5db',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    fonts: {
      primary: 'Roboto',
      secondary: 'Inter'
    },
    borderRadius: 'sm',
    shadows: 'md'
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<BrandTheme>(defaultThemes[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customTheme, setCustomTheme] = useState<BrandTheme | null>(null);

  // Charger le thème sauvegardé
  useEffect(() => {
    if (user) {
      const savedTheme = localStorage.getItem(`theme_${user.uid}`);
      const savedDarkMode = localStorage.getItem(`darkMode_${user.uid}`);
      
      if (savedTheme) {
        try {
          const theme = JSON.parse(savedTheme);
          setCustomTheme(theme);
          setCurrentTheme(theme);
        } catch {
          // Thème par défaut basé sur l'activité
          loadActivityTheme();
        }
      } else {
        loadActivityTheme();
      }

      if (savedDarkMode) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
    }
  }, [user]);

  // Charger le thème basé sur l'activité
  const loadActivityTheme = () => {
    if (user) {
      // Récupérer l'activité depuis Firestore
      const fetchActivity = async () => {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { firestore } = await import('@/config/firebase');
          
          const userDoc = await getDoc(doc(firestore, 'businesses', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const businessType = userData.businessType || 'restaurant';
            
            // Mapper le type d'activité au thème
            const themeMap: Record<string, string> = {
              'restaurant': 'restaurant',
              'bar': 'bar',
              'cafe': 'cafe',
              'commerce': 'commerce',
              'epicerie': 'commerce',
              'snack': 'restaurant'
            };
            
            const themeId = themeMap[businessType] || 'default';
            const theme = defaultThemes.find(t => t.id === themeId) || defaultThemes[0];
            setCurrentTheme(theme);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du thème:', error);
        }
      };

      fetchActivity();
    }
  };

  // Appliquer le thème au DOM
  useEffect(() => {
    applyThemeToDOM();
  }, [currentTheme, isDarkMode]);

  // Appliquer le thème aux styles CSS
  const applyThemeToDOM = () => {
    const root = document.documentElement;
    
    // Appliquer les couleurs
    root.style.setProperty('--primary', currentTheme.colors.primary);
    root.style.setProperty('--secondary', currentTheme.colors.secondary);
    root.style.setProperty('--accent', currentTheme.colors.accent);
    root.style.setProperty('--background', isDarkMode ? '#0f172a' : currentTheme.colors.background);
    root.style.setProperty('--foreground', isDarkMode ? '#f8fafc' : currentTheme.colors.foreground);
    root.style.setProperty('--muted', isDarkMode ? '#1e293b' : currentTheme.colors.muted);
    root.style.setProperty('--border', isDarkMode ? '#334155' : currentTheme.colors.border);
    root.style.setProperty('--success', currentTheme.colors.success);
    root.style.setProperty('--warning', currentTheme.colors.warning);
    root.style.setProperty('--error', currentTheme.colors.error);

    // Appliquer les polices
    root.style.setProperty('--font-primary', currentTheme.fonts.primary);
    root.style.setProperty('--font-secondary', currentTheme.fonts.secondary);

    // Appliquer les bordures
    const borderRadiusMap = {
      'none': '0px',
      'sm': '0.25rem',
      'md': '0.5rem',
      'lg': '0.75rem',
      'xl': '1rem'
    };
    root.style.setProperty('--border-radius', borderRadiusMap[currentTheme.borderRadius]);

    // Appliquer les ombres
    const shadowMap = {
      'none': 'none',
      'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    };
    root.style.setProperty('--box-shadow', shadowMap[currentTheme.shadows]);

    // Mode sombre
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Changer de thème
  const setTheme = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      setCustomTheme(null);
      
      if (user) {
        localStorage.setItem(`theme_${user.uid}`, JSON.stringify(theme));
      }
    }
  };

  // Créer un thème personnalisé
  const createCustomTheme = (theme: Omit<BrandTheme, 'id'>) => {
    const customThemeWithId = {
      ...theme,
      id: 'custom'
    };
    
    setCustomTheme(customThemeWithId);
    setCurrentTheme(customThemeWithId);
    
    if (user) {
      localStorage.setItem(`theme_${user.uid}`, JSON.stringify(customThemeWithId));
    }
  };

  // Réinitialiser au thème par défaut
  const resetToDefault = () => {
    setCustomTheme(null);
    setCurrentTheme(defaultThemes[0]);
    
    if (user) {
      localStorage.removeItem(`theme_${user.uid}`);
    }
  };

  // Basculer le mode sombre
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (user) {
      localStorage.setItem(`darkMode_${user.uid}`, JSON.stringify(newDarkMode));
    }
  };

  const value: ThemeContextType = {
    currentTheme,
    availableThemes: defaultThemes,
    setTheme,
    customTheme,
    createCustomTheme,
    resetToDefault,
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
