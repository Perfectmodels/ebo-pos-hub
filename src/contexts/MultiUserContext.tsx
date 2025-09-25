import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { firestore } from '@/config/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

interface CashRegister {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  currentUser: string | null;
  currentSession: string | null;
  businessId: string;
  createdAt: string;
  lastActivity: string;
}

interface CashSession {
  id: string;
  registerId: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string | null;
  startingAmount: number;
  endingAmount: number | null;
  totalSales: number;
  totalTransactions: number;
  status: 'active' | 'closed';
  businessId: string;
}

interface MultiUserContextType {
  registers: CashRegister[];
  sessions: CashSession[];
  currentSession: CashSession | null;
  availableRegisters: CashRegister[];
  createRegister: (name: string, location: string) => Promise<string>;
  updateRegister: (id: string, updates: Partial<CashRegister>) => Promise<void>;
  deleteRegister: (id: string) => Promise<void>;
  startSession: (registerId: string) => Promise<string>;
  endSession: (sessionId: string, endingAmount: number) => Promise<void>;
  switchRegister: (registerId: string) => Promise<void>;
  getRegisterStatus: (registerId: string) => 'available' | 'occupied' | 'offline';
}

const MultiUserContext = createContext<MultiUserContextType | undefined>(undefined);

export const MultiUserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CashSession | null>(null);

  // Écouter les registres de caisse
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, 'cashRegisters'),
      where('businessId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const registersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CashRegister[];
      setRegisters(registersData);
    });

    return () => unsubscribe();
  }, [user]);

  // Écouter les sessions de caisse
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, 'cashSessions'),
      where('businessId', '==', user.uid),
      where('status', '==', 'active'),
      orderBy('startTime', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CashSession[];
      setSessions(sessionsData);

      // Trouver la session actuelle de l'utilisateur
      const userSession = sessionsData.find(session => session.userId === user.uid);
      setCurrentSession(userSession || null);
    });

    return () => unsubscribe();
  }, [user]);

  // Créer un registre de caisse
  const createRegister = async (name: string, location: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    const registerData = {
      name,
      location,
      status: 'active' as const,
      currentUser: null,
      currentSession: null,
      businessId: user.uid,
      createdAt: serverTimestamp(),
      lastActivity: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, 'cashRegisters'), registerData);
    return docRef.id;
  };

  // Mettre à jour un registre
  const updateRegister = async (id: string, updates: Partial<CashRegister>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    await updateDoc(doc(firestore, 'cashRegisters', id), {
      ...updates,
      lastActivity: serverTimestamp()
    });
  };

  // Supprimer un registre
  const deleteRegister = async (id: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    // Vérifier qu'il n'y a pas de session active
    const activeSession = sessions.find(session => 
      session.registerId === id && session.status === 'active'
    );

    if (activeSession) {
      throw new Error('Impossible de supprimer un registre avec une session active');
    }

    await deleteDoc(doc(firestore, 'cashRegisters', id));
  };

  // Démarrer une session
  const startSession = async (registerId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Vérifier que le registre est disponible
    const register = registers.find(r => r.id === registerId);
    if (!register) throw new Error('Registre introuvable');

    if (register.currentUser && register.currentUser !== user.uid) {
      throw new Error('Ce registre est déjà utilisé par un autre utilisateur');
    }

    // Créer la session
    const sessionData = {
      registerId,
      userId: user.uid,
      userName: user.displayName || user.email || 'Utilisateur',
      startTime: serverTimestamp(),
      endTime: null,
      startingAmount: 0,
      endingAmount: null,
      totalSales: 0,
      totalTransactions: 0,
      status: 'active' as const,
      businessId: user.uid
    };

    const sessionRef = await addDoc(collection(firestore, 'cashSessions'), sessionData);

    // Mettre à jour le registre
    await updateRegister(registerId, {
      currentUser: user.uid,
      currentSession: sessionRef.id,
      status: 'active'
    });

    return sessionRef.id;
  };

  // Terminer une session
  const endSession = async (sessionId: string, endingAmount: number): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session introuvable');

    if (session.userId !== user.uid) {
      throw new Error('Vous ne pouvez pas terminer cette session');
    }

    // Mettre à jour la session
    await updateDoc(doc(firestore, 'cashSessions', sessionId), {
      endTime: serverTimestamp(),
      endingAmount,
      status: 'closed'
    });

    // Libérer le registre
    await updateRegister(session.registerId, {
      currentUser: null,
      currentSession: null
    });
  };

  // Changer de registre
  const switchRegister = async (registerId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    // Terminer la session actuelle si elle existe
    if (currentSession) {
      await endSession(currentSession.id, currentSession.startingAmount);
    }

    // Démarrer une nouvelle session
    await startSession(registerId);
  };

  // Obtenir le statut d'un registre
  const getRegisterStatus = (registerId: string): 'available' | 'occupied' | 'offline' => {
    const register = registers.find(r => r.id === registerId);
    if (!register) return 'offline';
    if (register.status === 'inactive' || register.status === 'maintenance') return 'offline';
    if (register.currentUser) return 'occupied';
    return 'available';
  };

  // Registres disponibles
  const availableRegisters = registers.filter(register => 
    getRegisterStatus(register.id) === 'available'
  );

  const value: MultiUserContextType = {
    registers,
    sessions,
    currentSession,
    availableRegisters,
    createRegister,
    updateRegister,
    deleteRegister,
    startSession,
    endSession,
    switchRegister,
    getRegisterStatus
  };

  return (
    <MultiUserContext.Provider value={value}>
      {children}
    </MultiUserContext.Provider>
  );
};

export const useMultiUser = () => {
  const context = useContext(MultiUserContext);
  if (context === undefined) {
    throw new Error('useMultiUser must be used within a MultiUserProvider');
  }
  return context;
};
