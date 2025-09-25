import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/config/firebase';

interface BusinessProfile {
  businessName?: string;
  businessType?: string;
  currency?: string;
  needsSetup?: boolean;
  isGoogleUser?: boolean;
}

export const useUserSetup = () => {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const businessDoc = await getDoc(doc(db, "businesses", user.uid));
        
        if (businessDoc.exists()) {
          const data = businessDoc.data();
          setBusinessProfile(data);
          
          // Vérifier si l'utilisateur a besoin de finaliser sa configuration
          const isIncomplete = !data.businessName || !data.businessType || data.needsSetup;
          setNeedsSetup(isIncomplete);
        } else {
          // Aucun profil business trouvé - rediriger vers l'inscription
          setNeedsSetup(true);
        }
      } catch (error) {
        console.error('Erreur vérification profil:', error);
        setNeedsSetup(true);
      } finally {
        setLoading(false);
      }
    };

    checkUserSetup();
  }, [user]);

  const markSetupComplete = () => {
    setNeedsSetup(false);
  };

  return {
    needsSetup,
    businessProfile,
    loading,
    markSetupComplete
  };
};
