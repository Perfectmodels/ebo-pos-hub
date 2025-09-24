import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import QRScanner from "@/components/QRScanner";
import SimpleQRScanner from "@/components/SimpleQRScanner";
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CreditCard, 
  Smartphone,
  Banknote,
  Search,
  Loader2,
  CheckCircle
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Ventes() {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const { addSale, loading: salesLoading } = useSales();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);

  // Filtrer les produits disponibles
  const availableProducts = products.filter(product => product.current_stock > 0);
  
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: typeof availableProducts[0]) => {
    // Vérifier le stock disponible
    const availableStock = product.current_stock;
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantity >= availableStock) {
      toast({
        title: "Stock insuffisant",
        description: `Il ne reste que ${availableStock} unités de ${product.name}`,
        variant: "destructive"
      });
      return;
    }

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: product.selling_price, 
        quantity: 1 
      }]);
    }
  };

  const handleQRScanned = (productData: any) => {
    // Trouver le produit dans la liste des produits disponibles
    const product = availableProducts.find(p => p.barcode === productData.code);
    
    if (product) {
      addToCart(product);
      toast({
        title: "Produit ajouté !",
        description: `${product.name} ajouté au panier`,
      });
    } else {
      toast({
        title: "Produit non disponible",
        description: `${productData.name} n'est pas en stock`,
        variant: "destructive"
      });
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

  const handlePayment = async (method: string) => {
    if (cart.length === 0 || !user) return;
    
    setProcessing(true);
    
    try {
      // Enregistrer chaque article comme une vente séparée
      for (const item of cart) {
        const { error } = await addSale({
          product_id: item.id,
          employee_id: user.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_amount: item.price * item.quantity
        });

        if (error) {
          throw new Error(`Erreur lors de l'enregistrement de ${item.name}: ${error}`);
        }
      }

      toast({
        title: "Vente enregistrée",
        description: `Paiement de ${total.toLocaleString()} FCFA par ${method} effectué avec succès`,
      });

      setCart([]);
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
      <SimpleQRScanner
        onProductFound={handleQRScanned}
        onProductNotFound={(code) => {
          toast({
            title: "Produit non trouvé",
            description: `Aucun produit trouvé pour le code: ${code}`,
            variant: "destructive"
          });
        }}
        mode="sell"
        title="Scanner produit"
        description="Scannez un code QR pour ajouter un produit au panier"
      />
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Chargement des produits...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit trouvé</p>
              <p className="text-sm">
                {searchTerm ? "Essayez un autre terme de recherche" : "Aucun produit en stock"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-medium transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        <Badge 
                          variant={product.current_stock <= product.min_stock ? "destructive" : "outline"}
                          className="text-xs"
                        >
                          Stock: {product.current_stock}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-xl font-bold text-primary">
                        {product.selling_price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Banknote className="w-4 h-4" />
                  )}
                  Espèces
                </Button>
                <Button 
                  onClick={() => handlePayment('Mobile Money')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                  Mobile Money
                </Button>
                <Button 
                  onClick={() => handlePayment('Carte')}
                  className="w-full justify-start gap-2"
                  variant="outline"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
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