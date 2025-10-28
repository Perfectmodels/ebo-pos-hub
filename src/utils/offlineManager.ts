// Gestionnaire de données hors ligne pour Ebo'o Gest
import { firestore } from '@/config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface OfflineData {
  sales: any[];
  products: any[];
  employees: any[];
  clients: any[];
  lastSync: Date;
  businessId: string;
}

class OfflineManager {
  private dbName = 'ebo-gest-offline';
  private version = 1;
  private db: IDBDatabase | null = null;
  private onlineStatus = navigator.onLine;
  private syncQueue: any[] = [];

  constructor() {
    this.initIndexedDB();
    this.setupNetworkListeners();
    this.setupBackgroundSync();
  }

  // Initialiser IndexedDB pour le stockage local
  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store pour les ventes
        if (!db.objectStoreNames.contains('sales')) {
          const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
          salesStore.createIndex('business_id', 'business_id', { unique: false });
          salesStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Store pour les produits
        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'id' });
          productsStore.createIndex('business_id', 'business_id', { unique: false });
        }

        // Store pour les employés
        if (!db.objectStoreNames.contains('employees')) {
          const employeesStore = db.createObjectStore('employees', { keyPath: 'id' });
          employeesStore.createIndex('business_id', 'business_id', { unique: false });
        }

        // Store pour les clients
        if (!db.objectStoreNames.contains('clients')) {
          const clientsStore = db.createObjectStore('clients', { keyPath: 'id' });
          clientsStore.createIndex('business_id', 'business_id', { unique: false });
        }

        // Store pour les données de synchronisation
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
        }

        // Store pour les métadonnées
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  // Écouter les changements de connectivité
  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.onlineStatus = true;
      console.log('🌐 Connexion rétablie - Synchronisation en cours...');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.onlineStatus = false;
      console.log('📴 Mode hors ligne activé');
    });
  }

  // Configuration du Background Sync
  private setupBackgroundSync(): void {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('offline-sync').catch(console.error);
      });
    }
  }

  // Sauvegarder des données localement
  async saveOfflineData(collection: string, data: any[]): Promise<void> {
    if (!this.db) await this.initIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([collection], 'readwrite');
      const store = transaction.objectStore(collection);

      // Vider le store existant
      store.clear();

      // Ajouter les nouvelles données
      data.forEach(item => {
        store.add(item);
      });

      transaction.oncomplete = () => {
        console.log(`💾 Données ${collection} sauvegardées hors ligne (${data.length} éléments)`);
        resolve();
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Récupérer des données du cache local
  async getOfflineData(collection: string, businessId?: string): Promise<any[]> {
    if (!this.db) await this.initIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([collection], 'readonly');
      const store = transaction.objectStore(collection);
      const request = store.getAll();

      request.onsuccess = () => {
        let data = request.result;
        
        // Filtrer par business_id si spécifié
        if (businessId) {
          data = data.filter(item => item.business_id === businessId);
        }

        resolve(data);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Ajouter une opération à la queue de synchronisation
  async addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    collection: string;
    data: any;
    businessId: string;
  }): Promise<void> {
    if (!this.db) await this.initIndexedDB();

    const syncItem = {
      ...operation,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');
      const request = store.add(syncItem);

      request.onsuccess = () => {
        console.log(`📝 Opération ajoutée à la queue de sync: ${operation.type} ${operation.collection}`);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Synchroniser les données hors ligne avec Firestore
  async syncOfflineData(): Promise<void> {
    if (!this.isOnline) {
      console.log('📴 Hors ligne - Synchronisation reportée');
      return;
    }

    try {
      console.log('🔄 Début de la synchronisation...');
      
      // Récupérer la queue de synchronisation
      const syncQueue = await this.getSyncQueue();
      
      for (const item of syncQueue) {
        try {
          await this.executeSyncOperation(item);
          await this.removeFromSyncQueue(item.id);
        } catch (error) {
          console.error('❌ Erreur sync opération:', error);
          await this.incrementRetryCount(item.id);
        }
      }

      // Synchroniser les données complètes
      await this.fullDataSync();
      
      console.log('✅ Synchronisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
    }
  }

  // Exécuter une opération de synchronisation
  private async executeSyncOperation(item: any): Promise<void> {
    const { type, collection, data, businessId } = item;

    switch (type) {
      case 'create':
        await setDoc(doc(firestore, collection, data.id), {
          ...data,
          business_id: businessId,
          createdAt: new Date()
        });
        break;
      case 'update':
        await setDoc(doc(firestore, collection, data.id), data, { merge: true });
        break;
      case 'delete':
        // Note: Firestore ne supporte pas la suppression hors ligne
        console.log('⚠️ Suppression reportée (non supportée hors ligne)');
        break;
    }
  }

  // Synchronisation complète des données
  private async fullDataSync(): Promise<void> {
    const businessId = this.getCurrentBusinessId();
    if (!businessId) return;

    try {
      // Synchroniser les ventes
      const salesQuery = query(collection(firestore, 'sales'), where('business_id', '==', businessId));
      const salesSnapshot = await getDocs(salesQuery);
      const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      await this.saveOfflineData('sales', salesData);

      // Synchroniser les produits
      const productsQuery = query(collection(firestore, 'products'), where('business_id', '==', businessId));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      await this.saveOfflineData('products', productsData);

      // Synchroniser les employés
      const employeesQuery = query(collection(firestore, 'employees'), where('business_id', '==', businessId));
      const employeesSnapshot = await getDocs(employeesQuery);
      const employeesData = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      await this.saveOfflineData('employees', employeesData);

      // Synchroniser les clients
      const clientsQuery = query(collection(firestore, 'clients'), where('business_id', '==', businessId));
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsData = clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      await this.saveOfflineData('clients', clientsData);

      // Mettre à jour les métadonnées
      await this.updateMetadata('lastSync', new Date().toISOString());

    } catch (error) {
      console.error('❌ Erreur sync complète:', error);
      throw error;
    }
  }

  // Récupérer la queue de synchronisation
  private async getSyncQueue(): Promise<any[]> {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readonly');
      const store = transaction.objectStore('sync_queue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Supprimer un élément de la queue
  private async removeFromSyncQueue(id: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Incrémenter le compteur de tentatives
  private async incrementRetryCount(id: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item && item.retryCount < item.maxRetries) {
          item.retryCount++;
          store.put(item);
        } else if (item) {
          // Supprimer après max tentatives
          store.delete(id);
        }
        resolve();
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // Mettre à jour les métadonnées
  private async updateMetadata(key: string, value: any): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['metadata'], 'readwrite');
      const store = transaction.objectStore('metadata');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Récupérer les métadonnées
  async getMetadata(key: string): Promise<any> {
    if (!this.db) await this.initIndexedDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['metadata'], 'readonly');
      const store = transaction.objectStore('metadata');
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Obtenir l'ID de l'entreprise actuelle
  private getCurrentBusinessId(): string | null {
    // Récupérer depuis le contexte d'authentification ou localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.uid || null;
  }

  // Vérifier si on est en ligne
  isOnline(): boolean {
    return this.onlineStatus;
  }

  // Obtenir le statut de synchronisation
  async getSyncStatus(): Promise<{
    isOnline: boolean;
    lastSync: Date | null;
    pendingOperations: number;
  }> {
    const lastSyncStr = await this.getMetadata('lastSync');
    const syncQueue = await this.getSyncQueue();
    
    return {
      isOnline: this.onlineStatus,
      lastSync: lastSyncStr ? new Date(lastSyncStr) : null,
      pendingOperations: syncQueue.length
    };
  }

  // Nettoyer les données expirées
  async cleanupExpiredData(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Nettoyer les anciennes ventes
    const sales = await this.getOfflineData('sales');
    const recentSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt?.toDate ? sale.createdAt.toDate() : sale.createdAt);
      return saleDate > thirtyDaysAgo;
    });

    if (recentSales.length !== sales.length) {
      await this.saveOfflineData('sales', recentSales);
      console.log(`🧹 Nettoyage: ${sales.length - recentSales.length} anciennes ventes supprimées`);
    }
  }
}

// Instance singleton
export const offlineManager = new OfflineManager();

// Export des types
export type { OfflineData };
