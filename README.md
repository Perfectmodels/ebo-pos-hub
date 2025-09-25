# Ebo'o Gest - Solution de Gestion Multi-Activités PME

Solution de gestion complète et moderne pour restaurants, snacks, bars, cafés et commerces au Cameroun et en Afrique. Expérience utilisateur de niveau professionnel avec fonctionnalités avancées.

**URL de production**: https://eboo-gest.vercel.app

## 🚀 À propos

Ebo'o Gest est une solution de gestion complète et moderne adaptée aux PME du secteur de la restauration et du commerce. Elle offre une expérience utilisateur exceptionnelle avec des fonctionnalités avancées, des tutoriels interactifs, des thèmes personnalisés et un mode multi-utilisateur pour une gestion optimale de votre entreprise.

## ✨ Fonctionnalités Principales

### 🛒 Point de Vente (POS) Avancé
- **Gestion des ventes en temps réel** avec interface intuitive
- **Mode multi-utilisateur** : Plusieurs caisses simultanées
- **Accès propriétaire direct** sans PIN requis
- **Scanner QR intégré** pour ajout rapide de produits
- **Gestion des sessions** par employé avec suivi des performances

### 📦 Gestion du Stock Intelligente
- **Catégories spécifiques par activité** (restaurant, bar, café, commerce, etc.)
- **Alertes automatiques** de stock faible et rupture
- **Scanner QR** pour inventaire rapide
- **Calcul automatique des marges** et rentabilité
- **Gestion des mouvements** de stock en temps réel

### 👥 Gestion du Personnel Complète
- **Profils d'employés par activité** avec permissions spécifiques
- **Système de rôles avancé** (Serveur, Cuisinier, Caissier, Manager, etc.)
- **Inscription simplifiée** sans email obligatoire
- **Suivi des performances** et des ventes par employé
- **Pointage et gestion des horaires**

### 📊 Analytics et Rapports Professionnels
- **Tableaux de bord spécialisés** par type d'activité
- **Graphiques en temps réel** avec Recharts
- **Rapports PDF** avec export professionnel
- **Alertes intelligentes** pour seuils critiques
- **Comparaisons** et évolutions vs périodes précédentes
- **Analyse de rentabilité** automatique

### 🎯 Expérience Utilisateur Exceptionnelle
- **Tutoriels interactifs** avec onboarding guidé
- **Thèmes personnalisés** adaptés à votre marque
- **Raccourcis clavier** pour navigation rapide
- **Mode sombre/clair** avec persistance des préférences
- **Interface responsive** optimisée mobile et desktop
- **PWA complète** avec fonctionnement offline

### 🔐 Sécurité et Permissions
- **Système de permissions granulaires** par rôle
- **Contrôle d'accès propriétaire** avec tous les privilèges
- **Navigation verrouillée** par type d'activité
- **Isolation des données** par entreprise
- **Authentification Firebase** sécurisée

## 🏢 Activités Supportées

- **🍽️ Restaurant** : Gestion complète des plats, tables et service
- **🍻 Bar** : Boissons, cocktails, happy hour
- **☕ Café** : Boissons chaudes, viennoiseries, ambiance cosy
- **🥪 Snack** : Service rapide, plats à emporter
- **🛍️ Commerce/Épicerie** : Produits variés, gestion des rayons
- **🍞 Boulangerie** : Pain, pâtisseries, production
- **🚚 Traiteur** : Événements, livraisons, commandes
- **🎵 Loisirs** : Animation, équipements, réservations

## 🛠️ Tech Stack Moderne

### Frontend
- **React 18** avec TypeScript pour la robustesse
- **Vite** pour un développement ultra-rapide
- **shadcn/ui + Radix UI** pour des composants accessibles
- **Tailwind CSS** pour un design moderne et responsive

### Backend & Services
- **Firebase** (Auth, Firestore, Storage, Analytics)
- **Firebase Emulators** pour le développement local
- **React Query** pour la gestion d'état serveur
- **Context API** pour l'état global

### Fonctionnalités Avancées
- **Recharts** pour les graphiques interactifs
- **html5-qrcode** pour le scan QR
- **jsPDF + jsPDF-AutoTable** pour les rapports PDF
- **PWA** avec Service Worker et Manifest
- **Raccourcis clavier** personnalisés
- **Thèmes dynamiques** avec CSS Variables

### Outils de Développement
- **TypeScript** pour la sécurité des types
- **ESLint + Prettier** pour la qualité du code
- **Vite** pour le build optimisé
- **Git** avec workflow moderne

## 🚀 Installation et Configuration

### Prérequis
- **Node.js** 18+ et npm
- **Compte Firebase** pour l'authentification et la base de données
- **Git** pour le contrôle de version

### Installation Rapide
```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/ebo-pos-hub.git
cd ebo-pos-hub

# 2. Installer les dépendances
npm install

# 3. Configuration Firebase
cp .env.example .env.local
# Éditer .env.local avec vos clés Firebase

# 4. Démarrer le serveur de développement
npm run dev
```

### Configuration Firebase
1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activez **Authentication** (Email/Password + Google)
3. Créez une base **Firestore** en mode production
4. Configurez **Storage** pour les images
5. Copiez vos clés dans `.env.local`

### Variables d'Environnement
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🎯 Guide de Démarrage Rapide

### 1. Première Connexion
- Créez un compte propriétaire
- Choisissez votre type d'activité
- Configurez votre entreprise

### 2. Configuration Initiale
- **Ajoutez vos produits** avec catégories spécifiques
- **Créez vos employés** avec rôles appropriés
- **Configurez votre caisse** et vos préférences

### 3. Utilisation Quotidienne
- **Ventes** : Interface intuitive avec raccourcis clavier
- **Stock** : Scanner QR et alertes automatiques
- **Personnel** : Suivi des performances en temps réel
- **Rapports** : Analytics et exports PDF

## 📱 Fonctionnalités Avancées

### Raccourcis Clavier
- `Ctrl + N` : Nouveau produit
- `Ctrl + S` : Sauvegarder
- `Ctrl + /` : Afficher tous les raccourcis
- `Escape` : Fermer les modales

### Mode Multi-utilisateur
- Plusieurs caisses simultanées
- Sessions isolées par employé
- Suivi des performances individuelles

### Tutoriels Interactifs
- Onboarding guidé pour nouveaux utilisateurs
- Tours guidés par fonctionnalité
- Aide contextuelle intégrée

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build

# Qualité du code
npm run lint         # Vérification ESLint
npm run lint:fix     # Correction automatique ESLint
npm run type-check   # Vérification TypeScript
npm run format       # Formatage du code
npm run format:check # Vérification du formatage
```

## 🚀 Déploiement

### Déploiement Automatique
Le projet est configuré pour un déploiement automatique sur **Vercel** :
- Push sur `main` → Déploiement automatique
- Pull Request → Prévisualisation automatique
- Configuration Firebase → Variables d'environnement

### Déploiement Manuel
```bash
# Build de production
npm run build

# Déploiement sur Vercel
npx vercel --prod

# Ou sur Netlify
npm run build && netlify deploy --prod --dir=dist
```

## 📊 Architecture et Performance

### Optimisations Implémentées
- **Lazy Loading** des composants
- **Code Splitting** par route
- **Memoization** des calculs coûteux
- **Optimistic Updates** pour UX fluide
- **PWA** avec cache intelligent

### Sécurité
- **Firestore Rules** pour isolation des données
- **Authentification** Firebase sécurisée
- **Permissions granulaires** par rôle
- **Validation** côté client et serveur

## 🤝 Contribution

### Workflow de Développement
1. Fork du repository
2. Création d'une branche feature
3. Développement avec code propre
4. Pull Request avec description détaillée

### Standards de Code
- **TypeScript** strict mode
- **ESLint + Prettier** configurés
- **Commits conventionnels** (Conventional Commits)
- **Code propre** et bien documenté

## 📞 Support et Contact

### Support Technique
- **Email** : support@ebo-gest.com
- **Documentation** : [docs.ebo-gest.com](https://docs.ebo-gest.com)
- **Issues GitHub** : [github.com/votre-org/ebo-pos-hub/issues](https://github.com/votre-org/ebo-pos-hub/issues)

### Formation et Accompagnement
- **Formation utilisateurs** disponible
- **Support technique** réactif
- **Mises à jour régulières** avec nouvelles fonctionnalités

---

**Ebo'o Gest** - Transformez votre gestion d'entreprise avec une solution moderne et intuitive ! 🚀