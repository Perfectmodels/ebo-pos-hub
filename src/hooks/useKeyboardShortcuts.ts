import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'sales' | 'products' | 'employees' | 'reports' | 'general';
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Actions de navigation
  const goToDashboard = useCallback(() => navigate('/dashboard'), [navigate]);
  const goToSales = useCallback(() => navigate('/ventes'), [navigate]);
  const goToStock = useCallback(() => navigate('/stock'), [navigate]);
  const goToProducts = useCallback(() => navigate('/produits'), [navigate]);
  const goToEmployees = useCallback(() => navigate('/personnel'), [navigate]);
  const goToClients = useCallback(() => navigate('/clients'), [navigate]);
  const goToReports = useCallback(() => navigate('/rapports'), [navigate]);
  const goToSettings = useCallback(() => navigate('/parametres'), [navigate]);

  // Actions de vente
  const newSale = useCallback(() => {
    navigate('/ventes');
    // Focus sur le premier produit ou la recherche
    setTimeout(() => {
      const searchInput = document.querySelector('[data-tutorial="product-search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }, [navigate]);

  const finalizeSale = useCallback(() => {
    const finalizeButton = document.querySelector('[data-tutorial="finalize-sale"]') as HTMLButtonElement;
    if (finalizeButton && !finalizeButton.disabled) {
      finalizeButton.click();
    }
  }, []);

  // Actions de produit
  const addProduct = useCallback(() => {
    navigate('/stock');
    setTimeout(() => {
      const addButton = document.querySelector('[data-tutorial="add-product-btn"]') as HTMLButtonElement;
      if (addButton) {
        addButton.click();
      }
    }, 100);
  }, [navigate]);

  const searchProducts = useCallback(() => {
    const searchInput = document.querySelector('[data-tutorial="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  // Actions générales
  const showHelp = useCallback(() => {
    const helpButton = document.querySelector('[data-shortcut="help"]') as HTMLButtonElement;
    if (helpButton) {
      helpButton.click();
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const themeButton = document.querySelector('[data-shortcut="theme"]') as HTMLButtonElement;
    if (themeButton) {
      themeButton.click();
    }
  }, []);

  const refreshData = useCallback(() => {
    const refreshButton = document.querySelector('[data-shortcut="refresh"]') as HTMLButtonElement;
    if (refreshButton) {
      refreshButton.click();
    }
  }, []);

  // Actions de navigation rapide
  const goBack = useCallback(() => window.history.back(), []);
  const goForward = useCallback(() => window.history.forward(), []);

  // Actions de formulaire
  const saveForm = useCallback(() => {
    const saveButton = document.querySelector('button[type="submit"], [data-shortcut="save"]') as HTMLButtonElement;
    if (saveButton && !saveButton.disabled) {
      saveButton.click();
    }
  }, []);

  const cancelForm = useCallback(() => {
    const cancelButton = document.querySelector('[data-shortcut="cancel"]') as HTMLButtonElement;
    if (cancelButton) {
      cancelButton.click();
    } else {
      // Fallback: fermer les modales
      const closeButton = document.querySelector('[data-shortcut="close"]') as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
      }
    }
  }, []);

  // Définir les raccourcis
  const shortcuts: Shortcut[] = [
    // Navigation
    { key: 'h', ctrlKey: true, action: goToDashboard, description: 'Aller au Dashboard', category: 'navigation' },
    { key: 's', ctrlKey: true, action: goToSales, description: 'Aller aux Ventes', category: 'navigation' },
    { key: 'k', ctrlKey: true, action: goToStock, description: 'Aller au Stock', category: 'navigation' },
    { key: 'p', ctrlKey: true, action: goToProducts, description: 'Aller aux Produits', category: 'navigation' },
    { key: 'e', ctrlKey: true, action: goToEmployees, description: 'Aller au Personnel', category: 'navigation' },
    { key: 'c', ctrlKey: true, action: goToClients, description: 'Aller aux Clients', category: 'navigation' },
    { key: 'r', ctrlKey: true, action: goToReports, description: 'Aller aux Rapports', category: 'navigation' },
    { key: ',', ctrlKey: true, action: goToSettings, description: 'Aller aux Paramètres', category: 'navigation' },

    // Ventes
    { key: 'n', ctrlKey: true, action: newSale, description: 'Nouvelle Vente', category: 'sales' },
    { key: 'Enter', ctrlKey: true, action: finalizeSale, description: 'Finaliser la Vente', category: 'sales' },

    // Produits
    { key: 'a', ctrlKey: true, action: addProduct, description: 'Ajouter un Produit', category: 'products' },
    { key: 'f', ctrlKey: true, action: searchProducts, description: 'Rechercher', category: 'products' },

    // Général
    { key: '?', ctrlKey: true, action: showHelp, description: 'Afficher l\'aide', category: 'general' },
    { key: 'd', ctrlKey: true, action: toggleTheme, description: 'Basculer le thème', category: 'general' },
    { key: 'F5', action: refreshData, description: 'Actualiser les données', category: 'general' },
    { key: 'Escape', action: cancelForm, description: 'Annuler/Fermer', category: 'general' },

    // Navigation rapide
    { key: 'ArrowLeft', altKey: true, action: goBack, description: 'Page précédente', category: 'navigation' },
    { key: 'ArrowRight', altKey: true, action: goForward, description: 'Page suivante', category: 'navigation' },

    // Formulaires
    { key: 's', ctrlKey: true, action: saveForm, description: 'Sauvegarder', category: 'general' }
  ];

  // Gérer les raccourcis
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si on est dans un input, textarea ou contenteditable
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        // Permettre certains raccourcis même dans les inputs
        const allowedInInputs = ['Escape', 'F5'];
        if (!allowedInInputs.includes(event.key)) {
          return;
        }
      }

      // Chercher le raccourci correspondant
      const shortcut = shortcuts.find(s => {
        return (
          s.key === event.key &&
          !!s.ctrlKey === !!event.ctrlKey &&
          !!s.shiftKey === !!event.shiftKey &&
          !!s.altKey === !!event.altKey &&
          !!s.metaKey === !!event.metaKey
        );
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return {
    shortcuts,
    goToDashboard,
    goToSales,
    goToStock,
    goToProducts,
    goToEmployees,
    goToClients,
    goToReports,
    goToSettings,
    newSale,
    finalizeSale,
    addProduct,
    searchProducts,
    showHelp,
    toggleTheme,
    refreshData,
    saveForm,
    cancelForm
  };
};
