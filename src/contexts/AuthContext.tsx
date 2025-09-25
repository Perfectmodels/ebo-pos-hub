
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import firestore functions
import { auth, firestore } from '@/config/firebase';
import { sendWelcomeEmail } from '@/services/emailService';

interface BusinessData {
  businessName: string;
  businessType: string;
  currency: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, businessData: BusinessData) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any, isNewUser?: boolean }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, businessData: BusinessData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le profil business dans Firestore
      const businessProfile = {
        ownerId: user.uid,
        email: user.email,
        ...businessData,
        createdAt: new Date().toISOString(),
        status: 'active',
        isGoogleUser: false
      };

      await setDoc(doc(firestore, "businesses", user.uid), businessProfile);

      // Créer aussi un profil utilisateur séparé
      const userProfile = {
        uid: user.uid,
        email: user.email,
        businessId: user.uid,
        role: 'owner',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'active'
      };

      await setDoc(doc(firestore, "users", user.uid), userProfile);

      // Envoyer l'email de bienvenue
      try {
        await sendWelcomeEmail({
          userName: businessData.businessName || user.displayName || 'Utilisateur',
          businessName: businessData.businessName,
          businessType: businessData.businessType,
          email: user.email || '',
          loginUrl: `${window.location.origin}/login`
        });
        console.log('✅ Email de bienvenue envoyé avec succès');
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de bienvenue :', emailError);
        // On continue même si l'email échoue
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
     try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Vérifier si c'est un nouvel utilisateur
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      // Si c'est un nouvel utilisateur, créer un profil business par défaut
      if (isNewUser) {
        const defaultBusinessData = {
          businessName: user.displayName || "Mon Entreprise",
          businessType: "autre",
          currency: "XAF",
          email: user.email,
          ownerId: user.uid,
          createdAt: new Date().toISOString(),
          isGoogleUser: true
        };
        
        await setDoc(doc(firestore, "businesses", user.uid), defaultBusinessData);
        
        // Envoyer l'email de bienvenue pour les nouveaux utilisateurs Google
        try {
          await sendWelcomeEmail({
            userName: user.displayName || 'Utilisateur',
            businessName: defaultBusinessData.businessName,
            businessType: defaultBusinessData.businessType,
            email: user.email || '',
            loginUrl: `${window.location.origin}/login`
          });
          console.log('✅ Email de bienvenue envoyé avec succès (Google)');
        } catch (emailError) {
          console.error('⚠️ Erreur lors de l\'envoi de l\'email de bienvenue (Google) :', emailError);
        }
        
        return { error: null, isNewUser: true, needsSetup: true };
      }
      
      return { error: null, isNewUser: false };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // Nettoyer les données locales
      localStorage.removeItem('userActivity');
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_login_time');
      // La redirection sera gérée par ProtectedRoute
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
