# 📋 Documentation Technique - Ebo'o Gest

## 🏗️ Architecture Générale

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
│   ├── auth/           # Composants d'authentification
│   ├── dashboard/      # Composants de tableau de bord
│   ├── forms/          # Formulaires
│   └── ui/             # Composants UI de base
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── pages/              # Pages principales
├── utils/              # Utilitaires et helpers
├── config/             # Configuration
└── types/              # Types TypeScript
```

## 🔧 Composants Principaux

### 1. Système d'Authentification
**Fichiers clés :**
- `src/contexts/AuthContext.tsx`
- `src/components/SimplifiedAuth.tsx`
- `src/components/GoogleUserSetup.tsx`

**Fonctionnalités :**
- Authentification Email/Password
- Authentification Google OAuth
- Gestion des profils utilisateur et entreprise
- Isolation des données par `business_id`

### 2. Gestion Multi-Activités
**Fichiers clés :**
- `src/contexts/ActivityContext.tsx`
- `src/utils/activityMapper.ts`
- `src/utils/productCategories.ts`

**Activités supportées :**
- Restaurant, Bar, Café, Snack
- Commerce/Épicerie, Boulangerie
- Traiteur, Loisirs

### 3. Système de Permissions
**Fichiers clés :**
- `src/utils/permissions.ts`
- `src/hooks/usePermissions.ts`

**Rôles définis :**
- **Propriétaire** : Accès complet
- **Manager** : Gestion + Ventes
- **Serveur** : Ventes + Pointage
- **Cuisinier** : Production + Stock
- **Caissier** : Ventes uniquement

### 4. Expérience Utilisateur Avancée
**Fichiers clés :**
- `src/contexts/ThemeContext.tsx`
- `src/contexts/MultiUserContext.tsx`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/components/InteractiveTutorial.tsx`

## 🔥 Configuration Firebase

### Collections Firestore
```typescript
// Structure des collections
businesses/           // Profils d'entreprises
├── {business_id}
    ├── name: string
    ├── type: string
    ├── currency: string
    └── settings: object

users/               // Profils utilisateurs
├── {user_id}
    ├── email: string
    ├── role: 'owner' | 'employee'
    ├── business_id: string
    └── permissions: string[]

products/            // Produits par entreprise
├── {product_id}
    ├── business_id: string
    ├── name: string
    ├── category: string
    ├── price: number
    ├── stock: number
    └── min_stock: number

employees/           // Employés par entreprise
├── {employee_id}
    ├── business_id: string
    ├── full_name: string
    ├── role: string
    ├── pin_code: string
    └── permissions: string[]

sales/               // Ventes par entreprise
├── {sale_id}
    ├── business_id: string
    ├── employee_id: string
    ├── items: SaleItem[]
    ├── total: number
    └── timestamp: Date
```

### Règles de Sécurité Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Isolation par business_id
    match /{collection}/{document} {
      allow read, write: if request.auth != null 
        && resource.data.business_id == request.auth.uid;
    }
    
    // Accès admin pour surveillance
    match /{collection}/{document} {
      allow read: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎨 Système de Thèmes

### Configuration CSS Variables
```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
}

[data-theme="dark"] {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... autres variables */
}
```

### Thèmes par Activité
```typescript
const activityThemes = {
  restaurant: {
    primary: 'hsl(142, 76%, 36%)',    // Vert restaurant
    secondary: 'hsl(142, 76%, 86%)'
  },
  bar: {
    primary: 'hsl(280, 100%, 70%)',   // Violet bar
    secondary: 'hsl(280, 100%, 90%)'
  },
  cafe: {
    primary: 'hsl(25, 95%, 53%)',     // Orange café
    secondary: 'hsl(25, 95%, 90%)'
  }
}
```

## ⌨️ Système de Raccourcis Clavier

### Raccourcis Globaux
```typescript
const globalShortcuts = {
  'Ctrl+N': 'Nouveau produit',
  'Ctrl+S': 'Sauvegarder',
  'Ctrl+/': 'Afficher raccourcis',
  'Escape': 'Fermer modales',
  'Ctrl+K': 'Recherche rapide'
}

const pageSpecificShortcuts = {
  '/ventes': {
    'F1': 'Scanner QR',
    'F2': 'Nouvelle vente',
    'F3': 'Annuler vente'
  },
  '/stock': {
    'Ctrl+A': 'Ajouter produit',
    'Ctrl+F': 'Rechercher produit',
    'F5': 'Actualiser stock'
  }
}
```

## 🔄 Mode Multi-utilisateur

### Gestion des Sessions
```typescript
interface CashRegisterSession {
  id: string;
  employeeId: string;
  businessId: string;
  startTime: Date;
  endTime?: Date;
  sales: Sale[];
  status: 'active' | 'closed';
}
```

### Isolation des Données
- Chaque session est isolée par `employeeId`
- Les ventes sont marquées avec la session active
- Les rapports peuvent filtrer par employé

## 📊 Analytics et Rapports

### Métriques Calculées
```typescript
interface BusinessMetrics {
  dailyRevenue: number;
  monthlyRevenue: number;
  topProducts: Product[];
  employeePerformance: EmployeeStats[];
  stockAlerts: Product[];
  salesTrends: TrendData[];
}
```

### Export PDF
```typescript
// Utilisation de jsPDF + jsPDF-AutoTable
const generateSalesReport = async (sales: Sale[], dateRange: DateRange) => {
  const doc = new jsPDF();
  doc.text('Rapport de Ventes', 20, 20);
  
  const tableData = sales.map(sale => [
    sale.date,
    sale.employeeName,
    sale.total,
    sale.items.length
  ]);
  
  autoTable(doc, {
    head: [['Date', 'Employé', 'Total', 'Articles']],
    body: tableData
  });
  
  return doc.save('rapport-ventes.pdf');
};
```

## 🔧 Qualité du Code

### Configuration ESLint
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Configuration Prettier
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🚀 Optimisations Performance

### Lazy Loading
```typescript
// Composants chargés à la demande
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Stock = lazy(() => import('./pages/StockNew'));
const Reports = lazy(() => import('./pages/Reports'));
```

### Memoization
```typescript
// Calculs coûteux mémorisés
const expensiveCalculation = useMemo(() => {
  return sales.reduce((total, sale) => total + sale.amount, 0);
}, [sales]);

// Composants mémorisés
const ProductCard = memo(({ product }: { product: Product }) => {
  return <div>{product.name}</div>;
});
```

### Optimistic Updates
```typescript
// Mise à jour optimiste pour UX fluide
const addProduct = async (product: Product) => {
  // Mise à jour locale immédiate
  setProducts(prev => [...prev, product]);
  
  try {
    // Synchronisation avec Firebase
    await addProductToFirestore(product);
  } catch (error) {
    // Rollback en cas d'erreur
    setProducts(prev => prev.filter(p => p.id !== product.id));
    showError('Erreur lors de l\'ajout du produit');
  }
};
```

## 🔐 Sécurité

### Validation des Données
```typescript
// Schémas Zod pour validation
const ProductSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  price: z.number().positive('Prix positif requis'),
  category: z.string().min(1, 'Catégorie requise'),
  business_id: z.string().uuid()
});
```

### Gestion des Erreurs
```typescript
// Intercepteur d'erreurs global
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('Erreur application:', error, errorInfo);
        // Envoi à service de monitoring
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## 📱 PWA et Offline

### Service Worker
```typescript
// Cache des ressources critiques
const CACHE_NAME = 'ebo-gest-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

### Manifest PWA
```json
{
  "name": "Ebo'o Gest",
  "short_name": "EboGest",
  "description": "Solution de gestion PME",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔄 Workflow de Développement

### Branches Git
```
main                 # Production
├── develop         # Développement
├── feature/xxx     # Nouvelles fonctionnalités
├── bugfix/xxx      # Corrections de bugs
└── hotfix/xxx      # Corrections urgentes
```

### Commits Conventionnels
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: tâches de maintenance
```

---

**Documentation mise à jour** - Version 2.0 avec toutes les nouvelles fonctionnalités ! 🚀
