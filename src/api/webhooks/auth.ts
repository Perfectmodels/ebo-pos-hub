import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Vérifier l'authentification du webhook
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.WEBHOOK_SECRET;
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || 
        authHeader.substring(7) !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Traiter le webhook selon le type
    switch (body.type) {
      case 'user_registration':
        await handleUserRegistration(body.data);
        break;
      case 'user_confirmation':
        await handleUserConfirmation(body.data);
        break;
      case 'password_reset':
        await handlePasswordReset(body.data);
        break;
      default:
        console.log('Unknown webhook type:', body.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleUserRegistration(data: any) {
  try {
    // Envoyer email de bienvenue
    await sendWelcomeEmail(data.email, data.user_id);
    
    // Créer un profil utilisateur
    await supabase
      .from('user_profiles')
      .insert({
        user_id: data.user_id,
        email: data.email,
        created_at: new Date().toISOString(),
        status: 'pending_confirmation'
      });

    // Log d'audit
    await supabase
      .from('audit_logs')
      .insert({
        user_id: data.user_id,
        action: 'user_registration_webhook',
        resource: 'user',
        resource_id: data.user_id,
        severity: 'medium',
        category: 'auth',
        timestamp: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error handling user registration:', error);
  }
}

async function handleUserConfirmation(data: any) {
  try {
    // Mettre à jour le statut du profil
    await supabase
      .from('user_profiles')
      .update({ status: 'confirmed' })
      .eq('user_id', data.user_id);

    // Envoyer email de confirmation
    await sendConfirmationEmail(data.email);

  } catch (error) {
    console.error('Error handling user confirmation:', error);
  }
}

async function handlePasswordReset(data: any) {
  try {
    // Log de sécurité
    await supabase
      .from('audit_logs')
      .insert({
        user_id: data.user_id,
        action: 'password_reset_requested',
        resource: 'security',
        resource_id: data.user_id,
        severity: 'high',
        category: 'security',
        timestamp: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error handling password reset:', error);
  }
}

async function sendWelcomeEmail(email: string, userId: string) {
  // Ici vous pouvez intégrer votre service d'email (SendGrid, Resend, etc.)
  console.log(`Sending welcome email to ${email} for user ${userId}`);
  
  // Exemple avec Resend
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'noreply@ebo-gest.com',
    to: email,
    subject: 'Bienvenue sur Ebo\'o Gest !',
    html: `
      <h1>Bienvenue sur Ebo'o Gest !</h1>
      <p>Votre compte a été créé avec succès.</p>
      <p>Commencez par configurer votre activité.</p>
    `
  });
  */
}

async function sendConfirmationEmail(email: string) {
  console.log(`Sending confirmation email to ${email}`);
  
  // Logique d'envoi d'email de confirmation
}
