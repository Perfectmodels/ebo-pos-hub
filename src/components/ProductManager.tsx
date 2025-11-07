import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useActivity } from "@/contexts/ActivityContext";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoriesForActivity } from "@/utils/productCategories";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface ProductFormData {
  name: string;
  category: string;
  selling_price: number;
  purchase_price: number;
  current_stock: number;
  min_stock: number;
  description: string;
}

export default function ProductManager() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { currentActivity } = useActivity();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    selling_price: 0,
    purchase_price: 0,
    current_stock: 0,
    min_stock: 5,
    description: ''
  });

  // Obtenir les catégories spécifiques à l'activité
  const activityCategories = getCategoriesForActivity(currentActivity?.id || 'restaurant');

  // Filtrer les produits selon l'activité et la recherche
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesActivity = activityCategories.some(cat => cat.id === product.category);
    return matchesSearch && matchesCategory && matchesActivity;
  });

  // Gérer l'ajout d'un produit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le nom et la catégorie du produit.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await addProduct({
        ...formData,
        price: formData.selling_price || 0,
        stock: formData.current_stock || 0,
        business_id: user?.uid || ''
      });
      
      if (result.success) {
        toast({
          title: "Produit ajouté",
          description: `${formData.name} a été ajouté avec succès.`,
        });
        resetForm();
        setIsAddModalOpen(false);
      } else {
        throw new Error(result.error || "Erreur lors de l'ajout");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Gérer la modification d'un produit
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    try {
      const result = await updateProduct(editingProduct.id, formData);
      
      if (result.success) {
        toast({
          title: "Produit modifié",
          description: `${formData.name} a été modifié avec succès.`,
        });
        resetForm();
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } else {
        throw new Error(result.error || "Erreur lors de la modification");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return;
    }

    try {
      const result = await deleteProduct(productId);
      
      if (result.success) {
        toast({
          title: "Produit supprimé",
          description: `${productName} a été supprimé avec succès.`,
        });
      } else {
        throw new Error(result.error || "Erreur lors de la suppression");
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Ouvrir le modal d'édition
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      selling_price: product.selling_price,
      purchase_price: product.purchase_price,
      current_stock: product.current_stock,
      min_stock: product.min_stock,
      description: product.description || ''
    });
    setIsEditModalOpen(true);
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      selling_price: 0,
      purchase_price: 0,
      current_stock: 0,
      min_stock: 5,
      description: ''
    });
  };

  // Vérifier le statut du stock
  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { status: 'out', color: 'destructive', icon: AlertTriangle };
    if (current <= min) return { status: 'low', color: 'destructive', icon: AlertTriangle };
    return { status: 'ok', color: 'default', icon: CheckCircle };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Produits - {currentActivity?.name}
          </h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits spécifique à votre activité
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Produit
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {activityCategories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory 
                ? "Aucun produit ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre premier produit."
              }
            </p>
            <Button onClick={() => setIsAddModalOpen(true)} className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un produit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.current_stock, product.min_stock);
            const StockIcon = stockStatus.icon;
            
            return (
              <Card key={product.id} className="card-stats">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">
                        {product.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {activityCategories.find(cat => cat.id === product.category)?.icon} {activityCategories.find(cat => cat.id === product.category)?.name}
                      </Badge>
                    </div>
                    <Badge variant={stockStatus.color as any} className="flex items-center gap-1">
                      <StockIcon className="w-3 h-3" />
                      {product.current_stock} / {product.min_stock}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Prix de vente</span>
                      <span className="font-semibold text-green-600">
                        {product.selling_price.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Prix d'achat</span>
                      <span className="font-semibold">
                        {product.purchase_price.toLocaleString()} FCFA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Marge</span>
                      <span className="font-semibold text-blue-600">
                        {((product.selling_price - product.purchase_price) / product.selling_price * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditModal(product)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal d'ajout */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du produit"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="selling_price">Prix de vente (FCFA) *</Label>
                <Input
                  id="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, selling_price: Number(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_price">Prix d'achat (FCFA)</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current_stock">Stock actuel</Label>
                <Input
                  id="current_stock"
                  type="number"
                  value={formData.current_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_stock: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock">Stock minimum</Label>
                <Input
                  id="min_stock"
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_stock: Number(e.target.value) }))}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du produit (optionnel)"
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="btn-gradient">
                Ajouter le produit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Nom du produit *</Label>
                <Input
                  id="edit_name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du produit"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_selling_price">Prix de vente (FCFA) *</Label>
                <Input
                  id="edit_selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, selling_price: Number(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_purchase_price">Prix d'achat (FCFA)</Label>
                <Input
                  id="edit_purchase_price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit_current_stock">Stock actuel</Label>
                <Input
                  id="edit_current_stock"
                  type="number"
                  value={formData.current_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_stock: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_min_stock">Stock minimum</Label>
                <Input
                  id="edit_min_stock"
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_stock: Number(e.target.value) }))}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <Input
                id="edit_description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du produit (optionnel)"
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="btn-gradient">
                Modifier le produit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
