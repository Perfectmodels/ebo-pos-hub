import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle,
  Edit,
  Trash2,
  Filter
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  price: number;
  unit: string;
}

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Mock data
  const products: Product[] = [
    { id: "1", name: "Attiéké", category: "Céréales", currentStock: 25, minStock: 10, price: 1000, unit: "kg" },
    { id: "2", name: "Poisson frais", category: "Protéines", currentStock: 8, minStock: 5, price: 2500, unit: "kg" },
    { id: "3", name: "Coca Cola 33cl", category: "Boissons", currentStock: 5, minStock: 20, price: 400, unit: "unité" },
    { id: "4", name: "Pain de mie", category: "Boulangerie", currentStock: 2, minStock: 10, price: 350, unit: "unité" },
    { id: "5", name: "Huile de palme", category: "Condiments", currentStock: 1, minStock: 5, price: 1500, unit: "litre" },
    { id: "6", name: "Riz", category: "Céréales", currentStock: 50, minStock: 20, price: 800, unit: "kg" },
    { id: "7", name: "Café soluble", category: "Boissons", currentStock: 15, minStock: 8, price: 1200, unit: "pot" },
    { id: "8", name: "Sucre", category: "Condiments", currentStock: 30, minStock: 10, price: 500, unit: "kg" }
  ];

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Tous" || product.category === selectedCategory)
    );

  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock);

  const getStockStatus = (product: Product) => {
    if (product.currentStock <= product.minStock * 0.5) {
      return { status: 'critical', color: 'bg-destructive text-destructive-foreground' };
    } else if (product.currentStock <= product.minStock) {
      return { status: 'low', color: 'bg-orange-500 text-white' };
    }
    return { status: 'normal', color: 'bg-accent text-accent-foreground' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Stock</h1>
          <p className="text-muted-foreground mt-1">
            Suivez vos inventaires et gérez vos approvisionnements
          </p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Produit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Produits</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Faible</p>
                <p className="text-2xl font-bold text-destructive">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Catégories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-stats">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Valeur Stock</p>
              <p className="text-2xl font-bold">2.5M FCFA</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Alerte Stock Faible ({lowStockProducts.length} produits)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-3 rounded bg-card border border-destructive/20">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Stock: <span className="text-destructive font-semibold">{product.currentStock}</span> / Min: {product.minStock} {product.unit}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-3 font-semibold">Produit</th>
                  <th className="pb-3 font-semibold">Catégorie</th>
                  <th className="pb-3 font-semibold">Stock Actuel</th>
                  <th className="pb-3 font-semibold">Stock Min</th>
                  <th className="pb-3 font-semibold">Prix Unitaire</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="py-3">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="py-3">{product.currentStock} {product.unit}</td>
                      <td className="py-3 text-muted-foreground">{product.minStock} {product.unit}</td>
                      <td className="py-3 font-semibold">{product.price} FCFA</td>
                      <td className="py-3">
                        <Badge className={stockStatus.color}>
                          {stockStatus.status === 'critical' ? 'Critique' : 
                           stockStatus.status === 'low' ? 'Faible' : 'Normal'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}