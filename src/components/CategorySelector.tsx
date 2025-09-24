import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Utensils, 
  Coffee, 
  Store, 
  Wine, 
  Truck, 
  Music, 
  ShoppingBag,
  Cake,
  Plus
} from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  customCategory?: string;
  onCustomCategoryChange?: (category: string) => void;
}

const categories = [
  {
    id: "restaurant",
    name: "Restaurant",
    icon: Utensils,
    description: "Service de restauration sur place",
    color: "bg-blue-500",
    examples: ["Restaurant gastronomique", "Restaurant traditionnel", "Restaurant moderne"]
  },
  {
    id: "snack",
    name: "Snack",
    icon: Store,
    description: "Restauration rapide et snacks",
    color: "bg-orange-500",
    examples: ["Snack-bar", "Fast-food", "Sandwicherie"]
  },
  {
    id: "bar",
    name: "Bar",
    icon: Coffee,
    description: "Boissons et ambiance",
    color: "bg-amber-500",
    examples: ["Bar traditionnel", "Pub", "Bar à cocktails"]
  },
  {
    id: "epicerie",
    name: "Épicerie / Supérette",
    icon: ShoppingBag,
    description: "Vente de produits alimentaires",
    color: "bg-green-500",
    examples: ["Épicerie", "Supérette", "Mini-marché"]
  },
  {
    id: "boulangerie",
    name: "Boulangerie / Pâtisserie",
    icon: Cake,
    description: "Pain et pâtisseries",
    color: "bg-yellow-500",
    examples: ["Boulangerie", "Pâtisserie", "Boulangerie-pâtisserie"]
  },
  {
    id: "cave",
    name: "Cave à vin / Spiritueux",
    icon: Wine,
    description: "Vente de boissons alcoolisées",
    color: "bg-purple-500",
    examples: ["Cave à vin", "Dépôt de boissons", "Magasin de spiritueux"]
  },
  {
    id: "traiteur",
    name: "Service traiteur / Livraison",
    icon: Truck,
    description: "Catering et livraison",
    color: "bg-red-500",
    examples: ["Traiteur", "Service de livraison", "Catering"]
  },
  {
    id: "loisirs",
    name: "Loisirs & Animation",
    icon: Music,
    description: "Karaoké, billard, jeux",
    color: "bg-pink-500",
    examples: ["Karaoké", "Salle de billard", "Centre de loisirs"]
  }
];

export default function CategorySelector({ 
  selectedCategory, 
  onCategoryChange, 
  customCategory = "", 
  onCustomCategoryChange 
}: CategorySelectorProps) {
  const [showCustom, setShowCustom] = useState(selectedCategory === "autre");

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "autre") {
      setShowCustom(true);
    } else {
      setShowCustom(false);
    }
    onCategoryChange(categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <div className="mt-2">
                      {category.examples.slice(0, 2).map((example, index) => (
                        <Badge key={index} variant="secondary" className="text-xs mr-1 mb-1">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Autre option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedCategory === "autre" 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-muted/50'
          }`}
          onClick={() => handleCategorySelect("autre")}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center text-white">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">Autre</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Activité non listée
                </p>
                <Badge variant="outline" className="text-xs mt-2">
                  Précisez ci-dessous
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Category Input */}
      {showCustom && (
        <div className="space-y-2">
          <Label htmlFor="customCategory">Précisez votre activité</Label>
          <Input
            id="customCategory"
            value={customCategory}
            onChange={(e) => onCustomCategoryChange?.(e.target.value)}
            placeholder="Décrivez votre activité spécifique"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Cette information nous aide à personnaliser votre expérience Ebo'o Gest
          </p>
        </div>
      )}
    </div>
  );
}
