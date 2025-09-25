
import { useState, useEffect, useCallback } from 'react';
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  current_stock: number;
  min_stock: number;
  category: string;
  business_id: string;
}

export const useProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) {
        setProducts([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const q = query(collection(firestore, 'products'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    await addDoc(collection(firestore, 'products'), productData);
    fetchProducts();
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const productRef = doc(firestore, 'products', id);
    await updateDoc(productRef, updates);
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    const productRef = doc(firestore, 'products', id);
    await deleteDoc(productRef);
    fetchProducts();
  };

  const updateProductStock = async (items: { productId: string; quantity: number }[]) => {
    const batch = writeBatch(firestore);
    
    items.forEach(item => {
        const productRef = doc(firestore, 'products', item.productId);
        // Here you should read the product first to calculate the new stock,
        // but for simplicity, we assume we're just decrementing.
        // For a real app, a transaction would be safer to prevent race conditions.
        const currentProduct = products.find(p => p.id === item.productId);
        if (currentProduct) {
            const newStock = currentProduct.stock - item.quantity;
            batch.update(productRef, { stock: newStock });
        }
    });

    await batch.commit();
    fetchProducts(); // Refresh products list
  };

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, updateProductStock };
};
