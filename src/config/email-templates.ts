/**
 * Configuration des templates d'email pour Ebo'o Gest
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const invitationEmailTemplate: EmailTemplate = {
  subject: "🎉 Invitation à rejoindre Ebo'o Gest",
  
  html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation Ebo'o Gest</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
        }
        .features {
            background: #f7fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .features h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .feature-list li {
            padding: 8px 0;
            color: #4a5568;
            position: relative;
            padding-left: 25px;
        }
        .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #48bb78;
            font-weight: bold;
        }
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #718096;
            font-size: 14px;
            margin: 5px 0;
        }
        .security-note {
            background: #edf2f7;
            border-left: 4px solid #4299e1;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .security-note p {
            margin: 0;
            color: #2d3748;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .title {
                font-size: 24px;
            }
            .cta-button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EBO</div>
            <h1 style="margin: 0; font-size: 24px;">Ebo'o Gest</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Solution de gestion point de vente</p>
        </div>
        
        <div class="content">
            <h2 class="title">Vous êtes invité !</h2>
            <p class="subtitle">Rejoignez l'équipe Ebo'o Gest</p>
            
            <div class="message">
                <p>Bonjour,</p>
                <p>Vous avez été invité à rejoindre <strong>Ebo'o Gest</strong>, notre plateforme de gestion de point de vente moderne et sécurisée.</p>
                <p>Cliquez sur le bouton ci-dessous pour accepter l'invitation et créer votre compte :</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Accepter l'invitation
                </a>
            </div>
            
            <div class="features">
                <h3>Ce que vous pourrez faire avec Ebo'o Gest :</h3>
                <ul class="feature-list">
                    <li>Gestion complète des ventes et du stock</li>
                    <li>Suivi des employés en temps réel</li>
                    <li>Génération de rapports détaillés</li>
                    <li>Interface mobile optimisée</li>
                    <li>Sécurité et protection des données</li>
                    <li>Notifications automatiques</li>
                </ul>
            </div>
            
            <div class="security-note">
                <p><strong>🔒 Sécurité :</strong> Ce lien d'invitation est sécurisé et expire automatiquement. Ne partagez jamais vos identifiants de connexion.</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f4f8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                    <strong>Besoin d'aide ?</strong><br>
                    Contactez notre équipe support à <a href="mailto:Asseko19@gmail.com" style="color: #667eea;">Asseko19@gmail.com</a>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Ebo'o Gest</strong></p>
            <p>Solution de gestion point de vente professionnelle</p>
            <p style="font-size: 12px; color: #a0aec0;">
                Cet email a été envoyé depuis {{ .SiteURL }}<br>
                Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.
            </p>
        </div>
    </div>
</body>
</html>`,

  text: `===============================================
           INVITATION EBO'O GEST
===============================================

Bonjour,

Vous avez été invité à rejoindre Ebo'o Gest, notre plateforme de 
gestion de point de vente moderne et sécurisée.

ACCEPTER L'INVITATION :
{{ .ConfirmationURL }}

===============================================
           FONCTIONNALITÉS DISPONIBLES
===============================================

✓ Gestion complète des ventes et du stock
✓ Suivi des employés en temps réel  
✓ Génération de rapports détaillés
✓ Interface mobile optimisée
✓ Sécurité et protection des données
✓ Notifications automatiques

===============================================
              SÉCURITÉ
===============================================

🔒 Ce lien d'invitation est sécurisé et expire automatiquement.
   Ne partagez jamais vos identifiants de connexion.

===============================================
              SUPPORT
===============================================

Besoin d'aide ? Contactez notre équipe support :
Asseko19@gmail.com

===============================================

Ebo'o Gest - Solution de gestion point de vente professionnelle

Cet email a été envoyé depuis {{ .SiteURL }}
Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.

===============================================`
};

export const magicLinkEmailTemplate: EmailTemplate = {
  subject: "🔗 Lien de connexion Ebo'o Gest",
  
  html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion Ebo'o Gest</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
        }
        .security-info {
            background: #f7fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .security-info h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .security-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .security-list li {
            padding: 8px 0;
            color: #4a5568;
            position: relative;
            padding-left: 25px;
        }
        .security-list li:before {
            content: "🔐";
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #718096;
            font-size: 14px;
            margin: 5px 0;
        }
        .warning-note {
            background: #fef5e7;
            border-left: 4px solid #f6ad55;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .warning-note p {
            margin: 0;
            color: #744210;
            font-size: 14px;
        }
        .alternative-link {
            background: #edf2f7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            word-break: break-all;
        }
        .alternative-link p {
            margin: 0 0 10px 0;
            color: #4a5568;
            font-size: 14px;
        }
        .alternative-link a {
            color: #667eea;
            text-decoration: none;
            font-family: monospace;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .title {
                font-size: 24px;
            }
            .cta-button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EBO</div>
            <h1 style="margin: 0; font-size: 24px;">Ebo'o Gest</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Connexion sécurisée</p>
        </div>
        
        <div class="content">
            <h2 class="title">Lien de connexion</h2>
            <p class="subtitle">Accédez à votre compte Ebo'o Gest</p>
            
            <div class="message">
                <p>Bonjour,</p>
                <p>Vous avez demandé un lien de connexion pour accéder à votre compte <strong>Ebo'o Gest</strong>.</p>
                <p>Cliquez sur le bouton ci-dessous pour vous connecter instantanément :</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Se connecter maintenant
                </a>
            </div>
            
            <div class="security-info">
                <h3>Informations de sécurité</h3>
                <ul class="security-list">
                    <li>Ce lien est valide pendant 1 heure</li>
                    <li>Il ne peut être utilisé qu'une seule fois</li>
                    <li>Votre session sera sécurisée par chiffrement</li>
                    <li>Aucun mot de passe n'est requis</li>
                </ul>
            </div>
            
            <div class="warning-note">
                <p><strong>⚠️ Important :</strong> Si vous n'avez pas demandé ce lien de connexion, ignorez cet email et contactez immédiatement notre support.</p>
            </div>
            
            <div class="alternative-link">
                <p><strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f4f8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                    <strong>Besoin d'aide ?</strong><br>
                    Contactez notre équipe support à <a href="mailto:Asseko19@gmail.com" style="color: #667eea;">Asseko19@gmail.com</a>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Ebo'o Gest</strong></p>
            <p>Solution de gestion point de vente professionnelle</p>
            <p style="font-size: 12px; color: #a0aec0;">
                Cet email a été envoyé depuis {{ .SiteURL }}<br>
                Pour votre sécurité, ne partagez jamais ce lien.
            </p>
        </div>
    </div>
</body>
</html>`,

  text: `===============================================
         CONNEXION EBO'O GEST
===============================================

Bonjour,

Vous avez demandé un lien de connexion pour accéder à votre compte 
Ebo'o Gest.

SE CONNECTER MAINTENANT :
{{ .ConfirmationURL }}

===============================================
         INFORMATIONS DE SÉCURITÉ
===============================================

🔐 Ce lien est valide pendant 1 heure
🔐 Il ne peut être utilisé qu'une seule fois
🔐 Votre session sera sécurisée par chiffrement
🔐 Aucun mot de passe n'est requis

===============================================
              ATTENTION
===============================================

⚠️ Si vous n'avez pas demandé ce lien de connexion, ignorez cet 
   email et contactez immédiatement notre support.

===============================================
              SUPPORT
===============================================

Besoin d'aide ? Contactez notre équipe support :
Asseko19@gmail.com

===============================================

Ebo'o Gest - Solution de gestion point de vente professionnelle

Cet email a été envoyé depuis {{ .SiteURL }}
Pour votre sécurité, ne partagez jamais ce lien.

===============================================`
};

export const passwordResetEmailTemplate: EmailTemplate = {
  subject: "🔑 Réinitialisation mot de passe Ebo'o Gest",
  
  html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation mot de passe - Ebo'o Gest</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
        }
        .security-info {
            background: #f7fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .security-info h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .security-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .security-list li {
            padding: 8px 0;
            color: #4a5568;
            position: relative;
            padding-left: 25px;
        }
        .security-list li:before {
            content: "🔐";
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #718096;
            font-size: 14px;
            margin: 5px 0;
        }
        .warning-note {
            background: #fef5e7;
            border-left: 4px solid #f6ad55;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .warning-note p {
            margin: 0;
            color: #744210;
            font-size: 14px;
        }
        .alternative-link {
            background: #edf2f7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            word-break: break-all;
        }
        .alternative-link p {
            margin: 0 0 10px 0;
            color: #4a5568;
            font-size: 14px;
        }
        .alternative-link a {
            color: #667eea;
            text-decoration: none;
            font-family: monospace;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .title {
                font-size: 24px;
            }
            .cta-button {
                display: block;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EBO</div>
            <h1 style="margin: 0; font-size: 24px;">Ebo'o Gest</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Réinitialisation mot de passe</p>
        </div>
        
        <div class="content">
            <h2 class="title">Réinitialiser votre mot de passe</h2>
            <p class="subtitle">Créez un nouveau mot de passe sécurisé</p>
            
            <div class="message">
                <p>Bonjour,</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>Ebo'o Gest</strong>.</p>
                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    Réinitialiser le mot de passe
                </a>
            </div>
            
            <div class="security-info">
                <h3>Informations de sécurité</h3>
                <ul class="security-list">
                    <li>Ce lien est valide pendant 1 heure</li>
                    <li>Il ne peut être utilisé qu'une seule fois</li>
                    <li>Votre nouveau mot de passe sera chiffré</li>
                    <li>Choisissez un mot de passe fort et unique</li>
                </ul>
            </div>
            
            <div class="warning-note">
                <p><strong>⚠️ Important :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et contactez immédiatement notre support.</p>
            </div>
            
            <div class="alternative-link">
                <p><strong>Lien alternatif :</strong> Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f4f8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                    <strong>Besoin d'aide ?</strong><br>
                    Contactez notre équipe support à <a href="mailto:Asseko19@gmail.com" style="color: #667eea;">Asseko19@gmail.com</a>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Ebo'o Gest</strong></p>
            <p>Solution de gestion point de vente professionnelle</p>
            <p style="font-size: 12px; color: #a0aec0;">
                Cet email a été envoyé depuis {{ .SiteURL }}<br>
                Pour votre sécurité, ne partagez jamais ce lien.
            </p>
        </div>
    </div>
</body>
</html>`,

  text: `===============================================
      RÉINITIALISATION MOT DE PASSE
===============================================

Bonjour,

Vous avez demandé à réinitialiser votre mot de passe pour votre 
compte Ebo'o Gest.

RÉINITIALISER LE MOT DE PASSE :
{{ .ConfirmationURL }}

===============================================
         INFORMATIONS DE SÉCURITÉ
===============================================

🔐 Ce lien est valide pendant 1 heure
🔐 Il ne peut être utilisé qu'une seule fois
🔐 Votre nouveau mot de passe sera chiffré
🔐 Choisissez un mot de passe fort et unique

===============================================
              ATTENTION
===============================================

⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet 
   email et contactez immédiatement notre support.

===============================================
              SUPPORT
===============================================

Besoin d'aide ? Contactez notre équipe support :
Asseko19@gmail.com

===============================================

Ebo'o Gest - Solution de gestion point de vente professionnelle

Cet email a été envoyé depuis {{ .SiteURL }}
Pour votre sécurité, ne partagez jamais ce lien.

===============================================`
};

export const reauthenticationEmailTemplate: EmailTemplate = {
  subject: "🔐 Code de réauthentification Ebo'o Gest",
  
  html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation réauthentification - Ebo'o Gest</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 40px 30px;
        }
        .title {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 16px;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            color: #4a5568;
            margin-bottom: 30px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .code-container {
            background: #f7fafc;
            border-radius: 8px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            border: 2px dashed #4299e1;
        }
        .code-label {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .code-value {
            font-size: 32px;
            font-weight: 700;
            color: #2d3748;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
            background: white;
            padding: 15px 25px;
            border-radius: 8px;
            border: 2px solid #4299e1;
            display: inline-block;
            margin: 10px 0;
        }
        .security-info {
            background: #f7fafc;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        .security-info h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .security-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .security-list li {
            padding: 8px 0;
            color: #4a5568;
            position: relative;
            padding-left: 25px;
        }
        .security-list li:before {
            content: "🔐";
            position: absolute;
            left: 0;
            font-size: 16px;
        }
        .footer {
            background: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            color: #718096;
            font-size: 14px;
            margin: 5px 0;
        }
        .warning-note {
            background: #fef5e7;
            border-left: 4px solid #f6ad55;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .warning-note p {
            margin: 0;
            color: #744210;
            font-size: 14px;
        }
        .instructions {
            background: #edf2f7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .instructions h4 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .instructions p {
            margin: 5px 0;
            color: #4a5568;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .title {
                font-size: 24px;
            }
            .code-value {
                font-size: 24px;
                letter-spacing: 2px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EBO</div>
            <h1 style="margin: 0; font-size: 24px;">Ebo'o Gest</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Confirmation réauthentification</p>
        </div>
        
        <div class="content">
            <h2 class="title">Code de réauthentification</h2>
            <p class="subtitle">Confirmez votre identité avec ce code</p>
            
            <div class="message">
                <p>Bonjour,</p>
                <p>Vous avez demandé une réauthentification pour votre compte <strong>Ebo'o Gest</strong>.</p>
                <p>Utilisez le code ci-dessous pour confirmer votre identité :</p>
            </div>
            
            <div class="code-container">
                <div class="code-label">Votre code de confirmation :</div>
                <div class="code-value">{{ .Token }}</div>
            </div>
            
            <div class="instructions">
                <h4>Comment utiliser ce code :</h4>
                <p>1. Copiez le code ci-dessus</p>
                <p>2. Retournez sur la page de connexion</p>
                <p>3. Collez le code dans le champ demandé</p>
                <p>4. Cliquez sur "Confirmer"</p>
            </div>
            
            <div class="security-info">
                <h3>Informations de sécurité</h3>
                <ul class="security-list">
                    <li>Ce code est valide pendant 10 minutes</li>
                    <li>Il ne peut être utilisé qu'une seule fois</li>
                    <li>Ne partagez jamais ce code avec d'autres</li>
                    <li>Votre session sera sécurisée après confirmation</li>
                </ul>
            </div>
            
            <div class="warning-note">
                <p><strong>⚠️ Important :</strong> Si vous n'avez pas demandé cette réauthentification, ignorez cet email et contactez immédiatement notre support.</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f4f8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #4a5568; font-size: 14px;">
                    <strong>Besoin d'aide ?</strong><br>
                    Contactez notre équipe support à <a href="mailto:Asseko19@gmail.com" style="color: #667eea;">Asseko19@gmail.com</a>
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Ebo'o Gest</strong></p>
            <p>Solution de gestion point de vente professionnelle</p>
            <p style="font-size: 12px; color: #a0aec0;">
                Cet email a été envoyé depuis {{ .SiteURL }}<br>
                Pour votre sécurité, ne partagez jamais ce code.
            </p>
        </div>
    </div>
</body>
</html>`,

  text: `===============================================
    CONFIRMATION RÉAUTHENTIFICATION
===============================================

Bonjour,

Vous avez demandé une réauthentification pour votre compte Ebo'o Gest.

VOTRE CODE DE CONFIRMATION :
{{ .Token }}

===============================================
         COMMENT UTILISER CE CODE
===============================================

1. Copiez le code ci-dessus
2. Retournez sur la page de connexion
3. Collez le code dans le champ demandé
4. Cliquez sur "Confirmer"

===============================================
         INFORMATIONS DE SÉCURITÉ
===============================================

🔐 Ce code est valide pendant 10 minutes
🔐 Il ne peut être utilisé qu'une seule fois
🔐 Ne partagez jamais ce code avec d'autres
🔐 Votre session sera sécurisée après confirmation

===============================================
              ATTENTION
===============================================

⚠️ Si vous n'avez pas demandé cette réauthentification, ignorez cet 
   email et contactez immédiatement notre support.

===============================================
              SUPPORT
===============================================

Besoin d'aide ? Contactez notre équipe support :
Asseko19@gmail.com

===============================================

Ebo'o Gest - Solution de gestion point de vente professionnelle

Cet email a été envoyé depuis {{ .SiteURL }}
Pour votre sécurité, ne partagez jamais ce code.

===============================================`
};

export const emailTemplates = {
  invitation: invitationEmailTemplate,
  magicLink: magicLinkEmailTemplate,
  passwordReset: passwordResetEmailTemplate,
  reauthentication: reauthenticationEmailTemplate,
  // Ajouter d'autres templates ici
  // welcome: welcomeTemplate,
} as const;
