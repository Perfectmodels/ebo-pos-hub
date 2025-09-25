import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Utensils, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Clock,
  Flame,
  Leaf,
  Star,
  Eye,
  Package,
  ChefHat
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  preparationTime: number; // en minutes
  isAvailable: boolean;
  isPopular: boolean;
  ingredients: string[];
  allergens: string[];
  calories?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
}

export default function Menu() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Formulaire pour nouvel item
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    preparationTime: 15,
    isAvailable: true,
    isPopular: false,
    ingredients: '',
    allergens: '',
    calories: 0,
    imageUrl: ''
  });

  // Charger les données
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des données depuis Firebase
      const mockCategories: Category[] = [
        { id: '1', name: 'Entrées', description: 'Entrées et apéritifs', icon: '🥗', sortOrder: 1 },
        { id: '2', name: 'Plats Principaux', description: 'Plats principaux', icon: '🍽️', sortOrder: 2 },
        { id: '3', name: 'Desserts', description: 'Desserts et douceurs', icon: '🍰', sortOrder: 3 },
        { id: '4', name: 'Boissons', description: 'Boissons et rafraîchissements', icon: '🥤', sortOrder: 4 }
      ];

      const mockMenuItems: MenuItem[] = [
        {
          id: '1',
          name: 'Salade César',
          description: 'Salade fraîche avec poulet grillé, croûtons et parmesan',
          price: 4500,
          category: 'Entrées',
          preparationTime: 10,
          isAvailable: true,
          isPopular: true,
          ingredients: ['Salade', 'Poulet', 'Croûtons', 'Parmesan', 'Sauce césar'],
          allergens: ['Gluten', 'Lait'],
          calories: 320,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '2',
          name: 'Poulet Braisé',
          description: 'Poulet braisé aux légumes avec riz parfumé',
          price: 6500,
          category: 'Plats Principaux',
          preparationTime: 25,
          isAvailable: true,
          isPopular: true,
          ingredients: ['Poulet', 'Tomates', 'Oignons', 'Riz', 'Épices'],
          allergens: [],
          calories: 580,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '3',
          name: 'Tiramisu',
          description: 'Dessert italien aux mascarpone et café',
          price: 3500,
          category: 'Desserts',
          preparationTime: 5,
          isAvailable: true,
          isPopular: false,
          ingredients: ['Mascarpone', 'Café', 'Cacao', 'Biscuits'],
          allergens: ['Œufs', 'Lait', 'Gluten'],
          calories: 420,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];

      setCategories(mockCategories);
      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Erreur lors du chargement du menu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le menu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!itemForm.name || !itemForm.description || itemForm.price <= 0 || !itemForm.category) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...itemForm,
        ingredients: itemForm.ingredients.split(',').map(i => i.trim()).filter(i => i),
        allergens: itemForm.allergens.split(',').map(a => a.trim()).filter(a => a),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        businessId: user?.uid || ''
      };

      setMenuItems(prev => [newItem, ...prev]);
      
      toast({
        title: "Item ajouté",
        description: "L'item a été ajouté au menu avec succès"
      });

      setShowAddItem(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'item:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'item au menu",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem || !itemForm.name || !itemForm.description || itemForm.price <= 0) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setMenuItems(prev => 
        prev.map(item => 
          item.id === selectedItem.id 
            ? { 
                ...item, 
                ...itemForm,
                ingredients: itemForm.ingredients.split(',').map(i => i.trim()).filter(i => i),
                allergens: itemForm.allergens.split(',').map(a => a.trim()).filter(a => a),
                updatedAt: new Date().toISOString()
              }
            : item
        )
      );

      toast({
        title: "Item modifié",
        description: "L'item a été modifié avec succès"
      });

      setShowEditItem(false);
      setSelectedItem(null);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet item du menu ?')) {
      return;
    }

    try {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item supprimé",
        description: "L'item a été supprimé du menu avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'item",
        variant: "destructive"
      });
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      setMenuItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, isAvailable: !item.isAvailable, updatedAt: new Date().toISOString() }
            : item
        )
      );

      const item = menuItems.find(i => i.id === id);
      toast({
        title: "Disponibilité mise à jour",
        description: `L'item est maintenant ${item?.isAvailable ? 'indisponible' : 'disponible'}`
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la disponibilité",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: 0,
      category: '',
      preparationTime: 15,
      isAvailable: true,
      isPopular: false,
      ingredients: '',
      allergens: '',
      calories: 0,
      imageUrl: ''
    });
  };

  const openEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      preparationTime: item.preparationTime,
      isAvailable: item.isAvailable,
      isPopular: item.isPopular,
      ingredients: item.ingredients.join(', '),
      allergens: item.allergens.join(', '),
      calories: item.calories || 0,
      imageUrl: item.imageUrl || ''
    });
    setShowEditItem(true);
  };

  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || item.category === selectedCategory)
  );

  const groupedItems = categories.reduce((acc, category) => {
    const items = filteredItems.filter(item => item.category === category.name);
    if (items.length > 0) {
      acc[category.name] = items;
    }
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion du Menu</h1>
            <p className="text-muted-foreground">Organisez et gérez votre menu restaurant</p>
          </div>
          <Button 
            onClick={() => setShowAddItem(true)}
            className="btn-gradient"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un Item
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">{menuItems.length}</p>
                </div>
                <Utensils className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {menuItems.filter(i => i.isAvailable).length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Populaires</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {menuItems.filter(i => i.isPopular).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Catégories</p>
                  <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                </div>
                <ChefHat className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un item..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Menu par catégories */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : Object.keys(groupedItems).length === 0 ? (
          <Card className="card-stats">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Utensils className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun item trouvé</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm ? "Aucun item ne correspond à votre recherche." : "Commencez par ajouter votre premier item au menu."}
              </p>
              <Button onClick={() => setShowAddItem(true)} className="btn-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([categoryName, items]) => (
              <div key={categoryName}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-foreground">{categoryName}</h2>
                  <Badge variant="secondary">{items.length} item{items.length > 1 ? 's' : ''}</Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Card key={item.id} className="card-stats">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              {item.name}
                              {item.isPopular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {item.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={item.isAvailable ? "default" : "secondary"}
                              onClick={() => handleToggleAvailability(item.id)}
                            >
                              {item.isAvailable ? "Disponible" : "Indisponible"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            {item.price.toLocaleString()} FCFA
                          </span>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {item.preparationTime}min
                          </div>
                        </div>

                        {item.calories && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Flame className="w-4 h-4" />
                            {item.calories} calories
                          </div>
                        )}

                        {item.ingredients.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1">Ingrédients:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.slice(0, 3).map((ingredient, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                              {item.ingredients.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.ingredients.length - 3} autres
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {item.allergens.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1 text-red-600">Allergènes:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.allergens.map((allergen, index) => (
                                <Badge key={index} variant="destructive" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditItem(item)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Ajouter/Modifier Item */}
        <Dialog open={showAddItem || showEditItem} onOpenChange={(open) => {
          if (!open) {
            setShowAddItem(false);
            setShowEditItem(false);
            setSelectedItem(null);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {showAddItem ? 'Ajouter un Item au Menu' : 'Modifier l\'Item'}
              </DialogTitle>
              <DialogDescription>
                {showAddItem ? 'Ajoutez un nouvel item à votre menu' : 'Modifiez les informations de cet item'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de l'item *</Label>
                  <Input
                    id="name"
                    placeholder="Salade César"
                    value={itemForm.name}
                    onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select value={itemForm.category} onValueChange={(value) => setItemForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée de l'item..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Prix (FCFA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="4500"
                    value={itemForm.price}
                    onChange={(e) => setItemForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="preparationTime">Temps de préparation (min)</Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    min="0"
                    placeholder="15"
                    value={itemForm.preparationTime}
                    onChange={(e) => setItemForm(prev => ({ ...prev, preparationTime: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    placeholder="320"
                    value={itemForm.calories}
                    onChange={(e) => setItemForm(prev => ({ ...prev, calories: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
                <Input
                  id="ingredients"
                  placeholder="Salade, Poulet, Croûtons, Parmesan, Sauce césar"
                  value={itemForm.ingredients}
                  onChange={(e) => setItemForm(prev => ({ ...prev, ingredients: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="allergens">Allergènes (séparés par des virgules)</Label>
                <Input
                  id="allergens"
                  placeholder="Gluten, Lait, Œufs"
                  value={itemForm.allergens}
                  onChange={(e) => setItemForm(prev => ({ ...prev, allergens: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">URL de l'image</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm(prev => ({ ...prev, isAvailable: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isAvailable">Disponible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={itemForm.isPopular}
                    onChange={(e) => setItemForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isPopular">Populaire</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddItem(false);
                setShowEditItem(false);
                setSelectedItem(null);
                resetForm();
              }}>
                Annuler
              </Button>
              <Button 
                onClick={showAddItem ? handleAddItem : handleUpdateItem}
                className="btn-gradient"
              >
                {showAddItem ? 'Ajouter l\'item' : 'Modifier l\'item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
