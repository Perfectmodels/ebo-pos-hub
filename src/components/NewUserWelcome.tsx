import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  ArrowRight, 
  Plus, 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Star,
  Zap,
  Target
} from 'lucide-react';
import EboLogo from '@/components/EboLogo';

interface NewUserWelcomeProps {
  onComplete: () => void;
}

export default function NewUserWelcome({ onComplete }: NewUserWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      title: "Bienvenue sur Ebo'o Gest !",
      description: "Votre solution de gestion PME est prête",
      icon: Star,
      action: "Commencer",
      nextStep: 1
    },
    {
      id: 1,
      title: "Ajoutez vos premiers produits",
      description: "Commencez par ajouter vos produits en stock",
      icon: Package,
      action: "Ajouter des produits",
      nextStep: 2,
      route: "/stock"
    },
    {
      id: 2,
      title: "Configurez votre équipe",
      description: "Ajoutez vos employés pour le suivi",
      icon: Users,
      action: "Gérer le personnel",
      nextStep: 3,
      route: "/personnel"
    },
    {
      id: 3,
      title: "Effectuez votre première vente",
      description: "Testez le point de vente avec une vente",
      icon: ShoppingCart,
      action: "Ouvrir la caisse",
      nextStep: 4,
      route: "/ventes"
    },
    {
      id: 4,
      title: "Explorez les rapports",
      description: "Découvrez vos analyses et statistiques",
      icon: BarChart3,
      action: "Voir les rapports",
      nextStep: 5,
      route: "/rapports"
    }
  ];

  const handleStepAction = (step: typeof steps[0]) => {
    setCompletedSteps(prev => [...prev, step.id]);
    
    if (step.route) {
      // Rediriger vers la page correspondante
      window.location.href = step.route;
    } else if (step.nextStep !== null) {
      setCurrentStep(step.nextStep);
    } else {
      // Dernière étape terminée
      onComplete();
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <EboLogo size="xl" variant="minimal" />
          <h1 className="text-4xl font-bold text-foreground mt-6 mb-4">
            Bienvenue sur Ebo'o Gest !
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre solution de gestion PME est prête. Suivez ce guide pour commencer.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression</span>
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} sur {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <currentStepData.icon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-lg">
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => handleStepAction(currentStepData)}
              className="btn-gradient"
              size="lg"
            >
              {currentStepData.action}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`transition-all ${
                index === currentStep 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : completedSteps.includes(step.id)
                  ? 'bg-green-50 border-green-200'
                  : 'opacity-60'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completedSteps.includes(step.id)
                      ? 'bg-green-100 text-green-600'
                      : index === currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStepAction(steps[1])}>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Produits</h4>
              <p className="text-sm text-muted-foreground">Gérer votre stock</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStepAction(steps[2])}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Personnel</h4>
              <p className="text-sm text-muted-foreground">Gérer votre équipe</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleStepAction(steps[3])}>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Ventes</h4>
              <p className="text-sm text-muted-foreground">Point de vente</p>
            </CardContent>
          </Card>
        </div>

        {/* Skip Guide */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={onComplete}
            className="text-muted-foreground"
          >
            Passer le guide et aller au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
}
