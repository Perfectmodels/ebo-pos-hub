// Service d'email pour Ebo'o Gest - Gabon

interface WelcomeEmailData {
  userName: string;
  businessName: string;
  businessType: string;
  email: string;
  loginUrl: string;
}

interface BusinessTypeInfo {
  name: string;
  features: string[];
  tips: string[];
  icon: string;
}

// Informations spécifiques par type d'activité au Gabon
const businessTypeInfo: Record<string, BusinessTypeInfo> = {
  restaurant: {
    name: "Restaurant",
    features: [
      "Gestion des commandes en temps réel",
      "Suivi des tables et réservations", 
      "Gestion des stocks de produits frais",
      "Rapports de rentabilité par plat",
      "Pointage des employés (serveurs, cuisiniers)"
    ],
    tips: [
      "Configurez vos plats avec les ingrédients pour un suivi précis des coûts",
      "Utilisez les rapports quotidiens pour optimiser vos achats",
      "Formez vos serveurs sur l'utilisation de la caisse"
    ],
    icon: "🍽️"
  },
  bar: {
    name: "Bar",
    features: [
      "Gestion des boissons et cocktails",
      "Suivi des stocks d'alcool",
      "Gestion des happy hours",
      "Pointage des barmen",
      "Rapports de consommation"
    ],
    tips: [
      "Enregistrez vos cocktails avec leurs ingrédients",
      "Configurez les périodes de happy hour",
      "Surveillez les ventes par heure pour optimiser les horaires"
    ],
    icon: "🍻"
  },
  cafe: {
    name: "Café",
    features: [
      "Gestion des boissons chaudes et froides",
      "Suivi des pâtisseries et viennoiseries",
      "Gestion des stocks de café et thé",
      "Rapports de ventes par période",
      "Pointage des baristas"
    ],
    tips: [
      "Enregistrez vos recettes de café pour un suivi précis",
      "Configurez vos heures de pointe",
      "Surveillez les ventes de pâtisseries"
    ],
    icon: "☕"
  },
  snack: {
    name: "Snack",
    features: [
      "Gestion rapide des commandes",
      "Suivi des stocks de produits",
      "Gestion des plats à emporter",
      "Rapports de performance",
      "Pointage des employés"
    ],
    tips: [
      "Organisez vos produits par catégories (sandwichs, boissons, etc.)",
      "Configurez les prix de gros pour optimiser les marges",
      "Utilisez les rapports pour identifier vos meilleures ventes"
    ],
    icon: "🥪"
  },
  epicerie: {
    name: "Épicerie",
    features: [
      "Gestion complète des produits",
      "Suivi des dates d'expiration",
      "Gestion des fournisseurs",
      "Rapports de rotation des stocks",
      "Pointage des employés"
    ],
    tips: [
      "Configurez les alertes de péremption",
      "Organisez vos produits par rayons",
      "Surveillez les mouvements de stock"
    ],
    icon: "🛒"
  },
  hotel: {
    name: "Hôtel",
    features: [
      "Gestion des chambres et réservations",
      "Suivi des services (restauration, spa, etc.)",
      "Gestion des stocks d'hôtellerie",
      "Rapports de revenus par service",
      "Pointage du personnel"
    ],
    tips: [
      "Configurez vos services additionnels",
      "Surveillez les revenus par chambre",
      "Organisez votre personnel par départements"
    ],
    icon: "🏨"
  },
  pharmacie: {
    name: "Pharmacie",
    features: [
      "Gestion des médicaments et produits",
      "Suivi des prescriptions",
      "Gestion des stocks sensibles",
      "Rapports de ventes par catégorie",
      "Pointage du personnel médical"
    ],
    tips: [
      "Configurez les alertes de stock critique",
      "Organisez par catégories thérapeutiques",
      "Surveillez les dates d'expiration"
    ],
    icon: "💊"
  },
  supermarche: {
    name: "Supermarché",
    features: [
      "Gestion multi-rayons",
      "Suivi des stocks en temps réel",
      "Gestion des promotions",
      "Rapports de performance par rayon",
      "Pointage du personnel"
    ],
    tips: [
      "Organisez vos rayons efficacement",
      "Configurez les promotions saisonnières",
      "Surveillez la rotation des produits"
    ],
    icon: "🏪"
  }
};

// Template HTML pour l'email de bienvenue
export const generateWelcomeEmailHTML = (data: WelcomeEmailData): string => {
  const businessInfo = businessTypeInfo[data.businessType] || businessTypeInfo.restaurant;
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Ebo'o Gest</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3b82f6;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
        }
        .welcome-message {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .business-info {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .features {
            margin: 20px 0;
        }
        .feature-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 0;
        }
        .feature-icon {
            margin-right: 10px;
            font-size: 16px;
        }
        .tips {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #666;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
            text-align: center;
        }
        .social-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 10px;
        }
        .gabon-info {
            background: #10b981;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏪 Ebo'o Gest</div>
            <div class="subtitle">Solution de gestion pour PME gabonaises</div>
        </div>

        <div class="welcome-message">
            <h1>Bienvenue ${data.userName} ! 🎉</h1>
            <p>Votre compte a été créé avec succès sur Ebo'o Gest</p>
        </div>

        <div class="business-info">
            <h2>${businessInfo.icon} Votre entreprise : ${data.businessName}</h2>
            <p><strong>Type d'activité :</strong> ${businessInfo.name}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div class="gabon-info">
            <h3>🇬🇦 Spécialement conçu pour le Gabon</h3>
            <p>Ebo'o Gest est adapté aux besoins des entreprises gabonaises avec support du FCFA, 
            gestion des villes gabonaises et fonctionnalités locales.</p>
        </div>

        <div class="features">
            <h3>🚀 Fonctionnalités pour ${businessInfo.name} :</h3>
            ${businessInfo.features.map(feature => `
                <div class="feature-item">
                    <span class="feature-icon">✅</span>
                    <span>${feature}</span>
                </div>
            `).join('')}
        </div>

        <div class="tips">
            <h3>💡 Conseils pour bien démarrer :</h3>
            <ul>
                ${businessInfo.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="${data.loginUrl}" class="cta-button">
                🚀 Accéder à votre tableau de bord
            </a>
        </div>

        <div class="social-links">
            <p>Suivez-nous pour les dernières actualités :</p>
            <a href="https://facebook.com/eboogest">Facebook</a> |
            <a href="https://linkedin.com/company/eboogest">LinkedIn</a> |
            <a href="https://twitter.com/eboogest">Twitter</a>
        </div>

        <div class="footer">
            <p><strong>Besoin d'aide ?</strong></p>
            <p>📧 Email : support@ebo-gest.com</p>
            <p>📞 Téléphone : +241 01 23 45 67</p>
            <p>📍 Libreville, Gabon</p>
            <br>
            <p>Ebo'o Gest - Transformez votre gestion d'entreprise au Gabon</p>
            <p>© 2024 Ebo'o Gest. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Template texte pour l'email de bienvenue
export const generateWelcomeEmailText = (data: WelcomeEmailData): string => {
  const businessInfo = businessTypeInfo[data.businessType] || businessTypeInfo.restaurant;
  
  return `
Bienvenue sur Ebo'o Gest ! 🎉

Bonjour ${data.userName},

Votre compte a été créé avec succès sur Ebo'o Gest, la solution de gestion pour PME gabonaises.

INFORMATIONS DE VOTRE COMPTE :
- Entreprise : ${data.businessName}
- Type d'activité : ${businessInfo.name}
- Email : ${data.email}
- Date d'inscription : ${new Date().toLocaleDateString('fr-FR')}

🇬🇦 SPÉCIALEMENT CONÇU POUR LE GABON :
Ebo'o Gest est adapté aux besoins des entreprises gabonaises avec :
- Support du FCFA
- Gestion des villes gabonaises
- Fonctionnalités locales

🚀 FONCTIONNALITÉS POUR ${businessInfo.name.toUpperCase()} :
${businessInfo.features.map(feature => `✅ ${feature}`).join('\n')}

💡 CONSEILS POUR BIEN DÉMARRER :
${businessInfo.tips.map(tip => `• ${tip}`).join('\n')}

🚀 ACCÉDER À VOTRE TABLEAU DE BORD :
${data.loginUrl}

📞 SUPPORT :
- Email : support@ebo-gest.com
- Téléphone : +241 01 23 45 67
- Libreville, Gabon

Suivez-nous :
- Facebook : https://facebook.com/eboogest
- LinkedIn : https://linkedin.com/company/eboogest
- Twitter : https://twitter.com/eboogest

Ebo'o Gest - Transformez votre gestion d'entreprise au Gabon
© 2024 Ebo'o Gest. Tous droits réservés.
  `;
};

// Fonction pour envoyer l'email de bienvenue (à implémenter avec votre service d'email)
export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<boolean> => {
  try {
    // Ici vous pouvez intégrer votre service d'email préféré :
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer avec SMTP
    // - Firebase Functions avec un service d'email
    
    console.log('📧 Email de bienvenue généré pour :', data.email);
    console.log('📧 Contenu HTML :', generateWelcomeEmailHTML(data));
    console.log('📧 Contenu texte :', generateWelcomeEmailText(data));
    
    // Pour l'instant, on simule l'envoi
    // Dans un vrai projet, vous remplaceriez ceci par l'appel à votre service d'email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue :', error);
    return false;
  }
};
