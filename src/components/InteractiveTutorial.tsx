import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  X, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  MousePointer,
  Keyboard,
  Monitor
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // Selector CSS de l'élément ciblé
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'navigate' | 'scroll';
  actionText?: string;
  keyboard?: string; // Raccourci clavier associé
  videoUrl?: string;
  interactive?: boolean;
  completed?: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: number; // en minutes
  steps: TutorialStep[];
  category: 'onboarding' | 'feature' | 'advanced';
}

const tutorials: Tutorial[] = [
  {
    id: 'first-sale',
    title: 'Première Vente',
    description: 'Apprenez à effectuer votre première vente',
    icon: '🛒',
    duration: 5,
    category: 'onboarding',
    steps: [
      {
        id: 'access-pos',
        title: 'Accéder à la Caisse',
        description: 'Cliquez sur "Accès Propriétaire" pour ouvrir la caisse',
        target: '[data-tutorial="owner-access"]',
        position: 'right',
        action: 'click',
        actionText: 'Cliquez ici'
      },
      {
        id: 'select-product',
        title: 'Sélectionner un Produit',
        description: 'Choisissez un produit dans la grille pour l\'ajouter au panier',
        target: '[data-tutorial="product-grid"]',
        position: 'top',
        action: 'click',
        actionText: 'Cliquez sur un produit'
      },
      {
        id: 'adjust-quantity',
        title: 'Ajuster la Quantité',
        description: 'Utilisez les boutons + et - pour modifier la quantité',
        target: '[data-tutorial="quantity-controls"]',
        position: 'left',
        action: 'click',
        actionText: 'Modifiez la quantité'
      },
      {
        id: 'finalize-sale',
        title: 'Finaliser la Vente',
        description: 'Cliquez sur "Finaliser la Vente" pour enregistrer',
        target: '[data-tutorial="finalize-sale"]',
        position: 'top',
        action: 'click',
        actionText: 'Finalisez la vente'
      }
    ]
  },
  {
    id: 'add-product',
    title: 'Ajouter un Produit',
    description: 'Créez votre premier produit dans le catalogue',
    icon: '📦',
    duration: 3,
    category: 'onboarding',
    steps: [
      {
        id: 'go-to-stock',
        title: 'Aller au Stock',
        description: 'Naviguez vers la gestion du stock',
        target: '[data-tutorial="stock-nav"]',
        position: 'right',
        action: 'click',
        actionText: 'Accédez au stock'
      },
      {
        id: 'add-product-button',
        title: 'Ajouter un Produit',
        description: 'Cliquez sur "Ajouter Produit"',
        target: '[data-tutorial="add-product-btn"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Ajoutez un produit'
      },
      {
        id: 'fill-product-form',
        title: 'Remplir le Formulaire',
        description: 'Complétez les informations du produit',
        target: '[data-tutorial="product-form"]',
        position: 'top',
        action: 'type',
        actionText: 'Remplissez le formulaire'
      }
    ]
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Raccourcis Clavier',
    description: 'Maîtrisez les raccourcis pour une utilisation rapide',
    icon: '⌨️',
    duration: 4,
    category: 'feature',
    steps: [
      {
        id: 'shortcut-overview',
        title: 'Vue d\'ensemble',
        description: 'Les raccourcis clavier accélèrent votre travail',
        target: 'body',
        position: 'top',
        keyboard: 'Ctrl+?',
        actionText: 'Appuyez sur Ctrl+? pour voir tous les raccourcis'
      },
      {
        id: 'quick-sale',
        title: 'Vente Rapide',
        description: 'Utilisez Ctrl+N pour une nouvelle vente',
        target: '[data-tutorial="new-sale"]',
        position: 'right',
        keyboard: 'Ctrl+N',
        actionText: 'Ctrl+N = Nouvelle vente'
      },
      {
        id: 'search-products',
        title: 'Recherche Produits',
        description: 'Ctrl+F pour rechercher rapidement',
        target: '[data-tutorial="search"]',
        position: 'bottom',
        keyboard: 'Ctrl+F',
        actionText: 'Ctrl+F = Recherche'
      }
    ]
  }
];

interface InteractiveTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialId?: string;
}

export default function InteractiveTutorial({ 
  isOpen, 
  onClose, 
  tutorialId 
}: InteractiveTutorialProps) {
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Initialiser le tutoriel
  useEffect(() => {
    if (isOpen && tutorialId) {
      const tutorial = tutorials.find(t => t.id === tutorialId);
      if (tutorial) {
        setCurrentTutorial(tutorial);
        setCurrentStep(0);
        setProgress(0);
        setIsPlaying(true);
      }
    }
  }, [isOpen, tutorialId]);

  // Gérer la progression du tutoriel
  useEffect(() => {
    if (currentTutorial && isPlaying) {
      const step = currentTutorial.steps[currentStep];
      if (step) {
        highlightElement(step.target);
        updateProgress();
      }
    }
  }, [currentStep, currentTutorial, isPlaying]);

  // Mettre en surbrillance l'élément ciblé
  const highlightElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      
      // Créer l'overlay de mise en surbrillance
      const rect = element.getBoundingClientRect();
      if (overlayRef.current) {
        overlayRef.current.style.clipPath = `polygon(
          0% 0%, 
          0% 100%, 
          ${rect.left}px 100%, 
          ${rect.left}px ${rect.top}px, 
          ${rect.right}px ${rect.top}px, 
          ${rect.right}px ${rect.bottom}px, 
          ${rect.left}px ${rect.bottom}px, 
          ${rect.left}px 100%, 
          100% 100%, 
          100% 0%
        )`;
      }
    }
  };

  // Mettre à jour la progression
  const updateProgress = () => {
    if (currentTutorial) {
      const newProgress = ((currentStep + 1) / currentTutorial.steps.length) * 100;
      setProgress(newProgress);
    }
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (currentTutorial && currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Terminer le tutoriel
  const completeTutorial = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setHighlightedElement(null);
    onClose();
  };

  // Gérer les raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const step = currentTutorial?.steps[currentStep];
      if (step?.keyboard && e.ctrlKey && e.key === step.keyboard.split('+')[1]) {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'Escape') {
        completeTutorial();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentStep, currentTutorial]);

  if (!isOpen) return null;

  const step = currentTutorial?.steps[currentStep];

  return (
    <>
      {/* Overlay avec mise en surbrillance */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-50 pointer-events-none"
        style={{ clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)' }}
      />

      {/* Tooltip du tutoriel */}
      {step && highlightedElement && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 max-w-sm"
          style={{
            left: step.position === 'right' ? highlightedElement.offsetLeft + highlightedElement.offsetWidth + 20 : 
                  step.position === 'left' ? highlightedElement.offsetLeft - 320 : 
                  highlightedElement.offsetLeft + highlightedElement.offsetWidth / 2 - 160,
            top: step.position === 'bottom' ? highlightedElement.offsetTop + highlightedElement.offsetHeight + 20 :
                 step.position === 'top' ? highlightedElement.offsetTop - 120 :
                 highlightedElement.offsetTop + highlightedElement.offsetHeight / 2 - 60
          }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="text-2xl">{currentTutorial?.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
              
              {step.keyboard && (
                <div className="flex items-center gap-2 mt-2">
                  <Keyboard className="w-4 h-4" />
                  <Badge variant="outline">{step.keyboard}</Badge>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 0}>
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep}>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button size="sm" onClick={completeTutorial}>
                  Terminer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panneau de contrôle du tutoriel */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentTutorial?.icon}</span>
                <div>
                  <h4 className="font-semibold">{currentTutorial?.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    Étape {currentStep + 1} sur {currentTutorial?.steps.length}
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <Progress value={progress} className="w-32" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep === 0}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextStep}>
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={completeTutorial}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Composant pour lancer les tutoriels
export const TutorialLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<string>('');

  const startTutorial = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Tutoriels Interactifs</h3>
      </div>
      
      <div className="grid gap-3">
        {tutorials.map(tutorial => (
          <Card key={tutorial.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tutorial.icon}</span>
                  <div>
                    <h4 className="font-medium">{tutorial.title}</h4>
                    <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.duration} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button onClick={() => startTutorial(tutorial.id)} size="sm">
                  Commencer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InteractiveTutorial 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tutorialId={selectedTutorial}
      />
    </div>
  );
};
