import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CreditCard, 
  Smartphone,
  Banknote,
  Search
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Ventes() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock products
  const products = [
    { id: "1", name: "Attiéké-Poisson", price: 1500, category: "Plats" },
    { id: "2", name: "Riz sauce", price: 1200, category: "Plats" },
    { id: "3", name: "Café au lait", price: 500, category: "Boissons" },
    { id: "4", name: "Coca Cola 33cl", price: 500, category: "Boissons" },
    { id: "5", name: "Pain de mie", price: 400, category: "Boulangerie" },
    { id: "6", name: "Croissant", price: 300, category: "Boulangerie" }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = (method: string) => {
    if (cart.length === 0) return;
    
    // Here would be payment processing with Supabase
    alert(`Paiement de ${total} FCFA par ${method} - Intégration Supabase requise`);
    setCart([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Point de Vente</h1>
          <p className="text-muted-foreground mt-1">
            Interface caisse pour enregistrer vos ventes
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:shadow-medium transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xl font-bold text-primary">
                      {product.price} FCFA
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Panier ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Panier vide
                </p>
              ) : (
                <>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded border border-border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.price} FCFA x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">{total} FCFA</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          {cart.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Mode de Paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => handlePayment('Espèces')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Banknote className="w-4 h-4" />
                  Espèces
                </Button>
                <Button 
                  onClick={() => handlePayment('Mobile Money')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile Money
                </Button>
                <Button 
                  onClick={() => handlePayment('Carte')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                >
                  <CreditCard className="w-4 h-4" />
                  Carte Bancaire
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}