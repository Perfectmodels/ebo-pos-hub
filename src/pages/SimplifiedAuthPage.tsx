import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SimplifiedAuth from '@/components/SimplifiedAuth';

export default function SimplifiedAuthPage() {
  const [authType, setAuthType] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleAuthType = () => {
    setAuthType(prev => prev === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SimplifiedAuth 
          type={authType} 
          onToggleType={toggleAuthType} 
        />
        
        {/* Informations supplémentaires */}
        <div className="mt-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold text-gray-800 mb-2">
              {authType === 'signin' ? 'Nouveau sur Ebo\'o Gest ?' : 'Déjà utilisateur ?'}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {authType === 'signin' 
                ? 'Rejoignez des milliers d\'entreprises qui font confiance à Ebo\'o Gest pour gérer leur point de vente.'
                : 'Connectez-vous pour accéder à votre tableau de bord et gérer votre entreprise.'
              }
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>✓ Gestion des ventes</span>
              <span>✓ Suivi du stock</span>
              <span>✓ Rapports détaillés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
