# Configuration Google OAuth pour Ebo'o Gest

## 📋 Prérequis

1. **Compte Google Cloud Console** : [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. **Projet Supabase** : [https://supabase.com/dashboard](https://supabase.com/dashboard)

## 🔧 Configuration Google Cloud Console

### 1. Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez l'ID du projet

### 2. Activer l'API Google+ 
1. Allez dans **APIs & Services** > **Library**
2. Recherchez "Google+ API" et activez-la
3. Recherchez "Google OAuth2 API" et activez-la

### 3. Créer les identifiants OAuth
1. Allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Sélectionnez **Web application**
4. Configurez les URLs autorisées :

**URLs de redirection autorisées :**
```
http://localhost:8080/auth/callback
https://eboo-gest.vercel.app/auth/callback
https://your-supabase-project.supabase.co/auth/v1/callback
```

**Origines JavaScript autorisées :**
```
http://localhost:8080
https://eboo-gest.vercel.app
```

5. Cliquez sur **CREATE**
6. **Copiez le Client ID et Client Secret** (vous en aurez besoin pour Supabase)

## 🔧 Configuration Supabase

### 1. Accéder aux paramètres d'authentification
1. Allez sur votre [Dashboard Supabase](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **Providers**

### 2. Configurer Google Provider
1. Trouvez **Google** dans la liste des providers
2. Activez le toggle **Enable Google provider**
3. Entrez vos identifiants Google :
   - **Client ID** : (copié depuis Google Cloud Console)
   - **Client Secret** : (copié depuis Google Cloud Console)

### 3. Configurer les URLs de redirection
Dans **Site URL**, ajoutez :
```
http://localhost:8080
https://eboo-gest.vercel.app
```

Dans **Redirect URLs**, ajoutez :
```
http://localhost:8080/auth/callback
https://eboo-gest.vercel.app/auth/callback
```

## 🧪 Test de la configuration

### 1. Test en développement
1. Démarrez votre serveur : `npm run dev`
2. Allez sur `http://localhost:8080/auth`
3. Cliquez sur "Continuer avec Google"
4. Vous devriez être redirigé vers Google pour la connexion

### 2. Test en production
1. Déployez votre application sur Vercel
2. Allez sur `https://eboo-gest.vercel.app/auth`
3. Testez la connexion Google

## 🔍 Dépannage

### Erreur "redirect_uri_mismatch"
- Vérifiez que les URLs de redirection dans Google Cloud Console correspondent exactement
- Assurez-vous que les URLs dans Supabase sont correctes

### Erreur "invalid_client"
- Vérifiez que le Client ID et Client Secret sont corrects dans Supabase
- Assurez-vous que le projet Google Cloud est le bon

### Erreur "access_denied"
- Vérifiez que l'API Google+ est activée
- Assurez-vous que les scopes sont correctement configurés

## 📚 Ressources utiles

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google Provider](https://supabase.com/docs/guides/auth/social-login/auth-google)

## 🔐 Sécurité

- Ne partagez jamais vos Client Secret
- Utilisez des variables d'environnement pour la production
- Configurez des URLs de redirection spécifiques
- Activez la validation des domaines dans Google Cloud Console
