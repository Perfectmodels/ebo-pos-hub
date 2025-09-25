import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivity } from '@/contexts/ActivityContext';

interface DebugLayoutProps {
  children: React.ReactNode;
}

export const DebugLayout: React.FC<DebugLayoutProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { currentActivity, loading: activityLoading } = useActivity();

  console.log('DebugLayout - Auth:', { user: !!user, authLoading });
  console.log('DebugLayout - Activity:', { currentActivity: !!currentActivity, activityLoading });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Non authentifié</h2>
          <p className="text-muted-foreground">Redirection vers la page de connexion...</p>
        </div>
      </div>
    );
  }

  if (activityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'activité...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="p-4 bg-yellow-100 border-b border-yellow-300">
        <p className="text-sm text-yellow-800">
          DEBUG: User: {user.email} | Activity: {currentActivity?.name || 'Aucune'}
        </p>
      </div>
      {children}
    </div>
  );
};
