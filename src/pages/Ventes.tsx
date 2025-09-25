
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from '@/hooks/useEmployees';
import PinInput from '@/components/PinInput';
import { useToast } from '@/hooks/use-toast';
import { 
  Trash2, 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  X, 
  Loader2, 
  User,
  PackageSearch,
  LogOut
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Ventes() {
  const { user } = useAuth();
  const { products, loading: productsLoading, updateProduct } = useProducts();
  const { addSale } = useSales();
  const { toast } = useToast();
  
  const [verifiedEmployee, setVerifiedEmployee] = useState<Employee | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [finalizing, setFinalizing] = useState(false);

  const handleEmployeeVerified = (employee: Employee) => {
    setVerifiedEmployee(employee);
    toast({
      title: `Bienvenue, ${employee.full_name}!`,
      description: "Vous pouvez maintenant commencer à vendre.",
    });
  };

  const handleLogout = () => {
    setVerifiedEmployee(null);
    setCart([]);
    toast({
      title: "Employé déconnecté",
    });
  }

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find((item) => item.id === product.id);

    const stockAvailable = product.current_stock - (existingItem?.quantity || 0);

    if (stockAvailable < 1) {
      toast({
        title: "Stock insuffisant",
        description: `Le stock pour ${product.name} est épuisé.`,
        variant: "destructive",
      });
      return;
    }

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.selling_price, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);

    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== productId));
      return;
    }

    if (product && newQuantity > product.current_stock) {
      toast({
        title: "Stock insuffisant",
        description: `Il ne reste que ${product.current_stock} unité(s) pour ${product.name}.`,
        variant: "destructive",
      });
      return;
    }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };
  
  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0 || !verifiedEmployee || !user) return;

    setFinalizing(true);
    try {
      const saleData = {
        business_id: user.uid,
        employee_id: verifiedEmployee.id,
        items: cart.map(({ id, name, price, quantity }) => ({ product_id: id, name, price, quantity })),
        total_amount: getTotal(),
        created_at: new Date().toISOString(),
      };
      
      const { error: saleError } = await addSale(saleData);
      if (saleError) throw new Error(saleError);

      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newStock = product.current_stock - item.quantity;
          await updateProduct(product.id, { current_stock: newStock });
        }
      }

      setCart([]);
      toast({ title: 'Vente finalisée', description: 'La vente a été enregistrée avec succès.' });

    } catch (error: any) {
      console.error("Error finalizing sale: ", error);
      toast({ title: 'Erreur', description: error.message || 'Impossible de finaliser la vente.', variant: 'destructive' });
    } finally {
      setFinalizing(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !verifiedEmployee) {
    return <PinInput onVerified={handleEmployeeVerified} />;
  }

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col p-4">
        <Card className="mb-4">
          <CardContent className="p-4 flex items-center gap-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit par nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>
        
        {productsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <Card 
                  key={product.id} 
                  onClick={() => addToCart(product)} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-3 flex flex-col justify-between h-full">
                    <div>
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.selling_price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <Badge variant={product.current_stock > product.min_stock ? "secondary" : "destructive"} className="mt-2 text-xs self-start">
                      Stock: {product.current_stock}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
               {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <PackageSearch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-semibold">Aucun produit trouvé</p>
                  <p className="text-sm text-muted-foreground">Essayez une autre recherche.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="w-full max-w-sm border-l bg-background flex flex-col shadow-lg">
        <Card className="flex-1 flex flex-col rounded-none shadow-none border-none">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center justify-between">
              Panier
              <ShoppingCart className="w-6 h-6 text-primary"/>
            </CardTitle>
            <CardDescription className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4"/>
                <span>{verifiedEmployee.full_name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2"/>
                Changer
              </Button>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <ShoppingCart className="w-16 h-16 mb-4"/>
                <p className="font-semibold">Votre panier est vide</p>
                <p className="text-sm">Cliquez sur un produit pour l'ajouter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.price.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-4 h-4"/>
                      </Button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-4 h-4"/>
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => updateCartQuantity(item.id, 0)}>
                      <Trash2 className="w-4 h-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          <div className="p-4 border-t mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                {getTotal().toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <Button 
              onClick={handleFinalizeSale}
              disabled={cart.length === 0 || finalizing}
              className="w-full btn-gradient"
              size="lg"
            >
              {finalizing ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin"/>
              ) : (
                <ShoppingCart className="w-5 h-5 mr-2"/>
              )}
              {finalizing ? "Finalisation..." : "Finaliser la Vente"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
