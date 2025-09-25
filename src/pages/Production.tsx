import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChefHat, 
  Plus,
  Calendar,
  Clock,
  Package,
  Users,
  TrendingUp
} from "lucide-react";

interface ProductionPlan {
  id: string;
  productName: string;
  quantity: number;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignedStaff: string[];
  ingredients: string[];
  notes?: string;
  createdAt: string;
  businessId: string;
}

export default function Production() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductionPlans();
  }, []);

  const loadProductionPlans = async () => {
    setLoading(true);
    try {
      const mockPlans: ProductionPlan[] = [
        {
          id: '1',
          productName: 'Pain de mie',
          quantity: 50,
          startTime: '06:00',
          endTime: '08:00',
          status: 'completed',
          assignedStaff: ['Jean Mba', 'Marie Obame'],
          ingredients: ['Farine', 'Levure', 'Eau', 'Sel'],
          notes: 'Production matinale',
          createdAt: new Date().toISOString(),
          businessId: user?.uid || ''
        },
        {
          id: '2',
          productName: 'Croissants',
          quantity: 30,
          startTime: '14:00',
          endTime: '16:00',
          status: 'in_progress',
          assignedStaff: ['Paul Mballa'],
          ingredients: ['Pâte feuilletée', 'Beurre', 'Œufs'],
          createdAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];
      
      setProductionPlans(mockPlans);
    } catch (error) {
      console.error('Erreur lors du chargement des plans de production:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ProductionPlan['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ProductionPlan['status']) => {
    switch (status) {
      case 'scheduled': return 'Programmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planification de Production</h1>
            <p className="text-muted-foreground">Gérez votre production boulangère</p>
          </div>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plans Totaux</p>
                  <p className="text-2xl font-bold">{productionPlans.length}</p>
                </div>
                <ChefHat className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {productionPlans.filter(p => p.status === 'in_progress').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {productionPlans.filter(p => p.status === 'completed').length}
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
                  <p className="text-sm text-muted-foreground">Produits</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {productionPlans.reduce((sum, plan) => sum + plan.quantity, 0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {productionPlans.map((plan) => (
              <Card key={plan.id} className="card-stats">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{plan.productName}</h3>
                        <Badge className={getStatusColor(plan.status)}>
                          {getStatusLabel(plan.status)}
                        </Badge>
                        <Badge variant="outline">
                          {plan.quantity} unités
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date().toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{plan.startTime} - {plan.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{plan.assignedStaff.join(', ')}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">Ingrédients:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.ingredients.map((ingredient, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {plan.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Notes:</strong> {plan.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Modifier
                      </Button>
                      {plan.status === 'scheduled' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Démarrer
                        </Button>
                      )}
                      {plan.status === 'in_progress' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Terminer
                        </Button>
                      )}
                    </div>
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
