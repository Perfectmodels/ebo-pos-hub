import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, 
  Plus,
  Clock,
  Users,
  ChefHat,
  Star,
  Edit,
  Trash2
} from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  preparationTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string[];
  notes?: string;
  rating: number;
  createdAt: string;
  businessId: string;
}

export default function Recipes() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const mockRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Pain de mie traditionnel',
          description: 'Pain de mie moelleux et savoureux',
          category: 'Pain',
          preparationTime: 180,
          servings: 12,
          difficulty: 'medium',
          ingredients: [
            { name: 'Farine T55', quantity: '500', unit: 'g' },
            { name: 'Eau tiède', quantity: '300', unit: 'ml' },
            { name: 'Levure fraîche', quantity: '10', unit: 'g' },
            { name: 'Sel', quantity: '10', unit: 'g' },
            { name: 'Sucre', quantity: '20', unit: 'g' }
          ],
          instructions: [
            'Mélanger la farine et le sel',
            'Délayer la levure dans l\'eau tiède avec le sucre',
            'Incorporer l\'eau progressivement à la farine',
            'Pétrir pendant 10 minutes',
            'Laisser reposer 1h30',
            'Cuire à 200°C pendant 30 minutes'
          ],
          rating: 4.5,
          createdAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];
      
      setRecipes(mockRecipes);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Moyen';
      case 'hard': return 'Difficile';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Recettes</h1>
            <p className="text-muted-foreground">Organisez vos recettes boulangères</p>
          </div>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Recette
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Recettes</p>
                  <p className="text-2xl font-bold">{recipes.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recettes Faciles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {recipes.filter(r => r.difficulty === 'easy').length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps Moyen</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {recipes.length > 0 ? Math.round(recipes.reduce((sum, r) => sum + r.preparationTime, 0) / recipes.length) : 0}min
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="card-stats">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{recipe.name}</CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {getDifficultyLabel(recipe.difficulty)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.preparationTime}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} portions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{recipe.rating}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Ingrédients principaux:</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient.name}
                        </Badge>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{recipe.ingredients.length - 3} autres
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
