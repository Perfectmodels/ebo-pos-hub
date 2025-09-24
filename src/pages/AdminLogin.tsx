import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminAuth from '@/components/AdminAuth';
import { ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    console.log('Connexion admin réussie, redirection vers /admin...');
    // Rediriger vers le panel admin après connexion réussie avec un petit délai
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header avec navigation */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <span className="text-sm text-muted-foreground hover:text-primary">
                  Connexion utilisateur
                </span>
              </Link>
              <Link to="/contact">
                <span className="text-sm text-muted-foreground hover:text-primary">
                  Support
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu de connexion admin */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          <AdminAuth onSuccess={handleSuccess} />
          
          {/* Message d'aide discret */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Besoin d'aide ? Contactez le support technique
            </p>
            <Link to="/contact" className="text-xs text-primary hover:underline">
              Support technique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
