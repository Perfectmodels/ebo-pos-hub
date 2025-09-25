import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getRedirectUrl, getCallbackUrl } from '@/config/supabase';
import { getGoogleRedirectUrl, getGoogleScopes, getGoogleQueryParams } from '@/config/google';
import { handleSupabaseError, logError, AppError } from '@/utils/errorHandler';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Log pour débogage
      console.log('🔍 Inscription utilisateur:', {
        email,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Désactiver la confirmation par email
          emailRedirectTo: undefined,
          data: {
            app_name: 'Ebo\'o Gest',
            app_url: getRedirectUrl()
          }
        }
      });
      
      // Log des résultats
      console.log('📧 Résultat inscription:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        session: data.session ? 'Session créée' : 'Aucune session',
        error: error?.message || 'Aucune erreur'
      });

      if (error) {
        const appError = handleSupabaseError(error);
        logError(appError, 'signUp');
        return { error: appError };
      }
      
      return { error: null };
    } catch (err) {
      console.error('❌ Exception signUp:', err);
      const appError = new AppError('Erreur inattendue lors de l\'inscription', 'unknown', 'SIGNUP_EXCEPTION', err);
      logError(appError, 'signUp');
      return { error: appError };
    }
  };

  const signInWithGoogle = async () => {
    const redirectUrl = getGoogleRedirectUrl();
    const queryParams = getGoogleQueryParams();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          ...queryParams,
          scope: getGoogleScopes(),
        },
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};