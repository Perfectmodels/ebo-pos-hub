import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  Download, 
  CheckCircle, 
  Star, 
  Users, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  Smartphone, 
  Monitor, 
  Zap, 
  Shield, 
  Clock, 
  Target,
  Lightbulb,
  HelpCircle,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react';
import EboLogo from '@/components/EboLogo';

export default function Guide() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const quickStartSteps = [
    {
      step: 1,
      title: "Créer votre compte",
      description: "Inscrivez-vous avec vos informations d'entreprise",
      icon: Users,
      action: "S'inscrire",
      link: "/inscription"
    },
    {
      step: 2,
      title: "Configurer votre activité",
      description: "Sélectionnez votre type d'activité (Restaurant, Snack, Bar, etc.)",
      icon: Target,
      action: "Configurer",
      link: "/dashboard"
    },
    {
      step: 3,
      title: "Ajouter vos produits",
      description: "Importez ou ajoutez manuellement vos produits et services",
      icon: Package,
      action: "Ajouter",
      link: "/stock"
    },
    {
      step: 4,
      title: "Commencer les ventes",
      description: "Utilisez l'interface de vente pour enregistrer vos transactions",
      icon: ShoppingCart,
      action: "Vendre",
      link: "/ventes"
    }
  ];

  const features = [
    {
      title: "Gestion des Ventes",
      description: "Interface caisse moderne avec paiement multi-modes",
      icon: ShoppingCart,
      steps: [
        "Sélectionnez les produits à vendre",
        "Ajustez les quantités si nécessaire",
        "Choisissez le mode de paiement",
        "Validez la transaction",
        "Imprimez le ticket de caisse"
      ]
    },
    {
      title: "Suivi du Stock",
      description: "Gestion complète de vos inventaires",
      icon: Package,
      steps: [
        "Ajoutez vos produits avec codes-barres",
        "Configurez les seuils d'alerte",
        "Recevez des notifications de stock faible",
        "Gérez les approvisionnements",
        "Suivez les mouvements de stock"
      ]
    },
    {
      title: "Gestion du Personnel",
      description: "Suivi des employés et pointage",
      icon: Users,
      steps: [
        "Créez les profils employés",
        "Configurez les horaires de travail",
        "Activez le pointage automatique",
        "Suivez les performances",
        "Générez les rapports de présence"
      ]
    },
    {
      title: "Rapports et Analyses",
      description: "Tableaux de bord et analyses détaillées",
      icon: BarChart3,
      steps: [
        "Consultez les ventes en temps réel",
        "Analysez les tendances",
        "Exportez les rapports",
        "Suivez les KPIs",
        "Planifiez les stratégies"
      ]
    }
  ];

  const tutorials = [
    {
      title: "Première connexion",
      duration: "2 min",
      difficulty: "Facile",
      icon: Play,
      description: "Apprenez à vous connecter et naviguer dans l'interface"
    },
    {
      title: "Configuration initiale",
      duration: "5 min",
      difficulty: "Moyen",
      icon: Settings,
      description: "Configurez votre entreprise et vos paramètres de base"
    },
    {
      title: "Ajout de produits",
      duration: "3 min",
      difficulty: "Facile",
      icon: Package,
      description: "Découvrez comment ajouter et gérer vos produits"
    },
    {
      title: "Première vente",
      duration: "4 min",
      difficulty: "Facile",
      icon: ShoppingCart,
      description: "Effectuez votre première transaction de vente"
    },
    {
      title: "Gestion du stock",
      duration: "6 min",
      difficulty: "Moyen",
      icon: BarChart3,
      description: "Maîtrisez la gestion de vos inventaires"
    },
    {
      title: "Rapports avancés",
      duration: "8 min",
      difficulty: "Avancé",
      icon: Target,
      description: "Utilisez les fonctionnalités avancées de reporting"
    }
  ];

  const faqs = [
    {
      question: "Comment commencer avec Ebo'o Gest ?",
      answer: "Créez votre compte, configurez votre activité, ajoutez vos produits et commencez à vendre. Notre guide vous accompagne à chaque étape."
    },
    {
      question: "Puis-je utiliser l'app hors ligne ?",
      answer: "Oui, Ebo'o Gest fonctionne hors ligne. Vos données sont synchronisées dès que vous retrouvez une connexion internet."
    },
    {
      question: "Comment ajouter mes employés ?",
      answer: "Allez dans la section Personnel, cliquez sur 'Ajouter un employé' et remplissez les informations. Vous pouvez ensuite gérer leurs accès et horaires."
    },
    {
      question: "Puis-je personnaliser les rapports ?",
      answer: "Absolument ! Vous pouvez créer des rapports personnalisés, choisir les métriques à afficher et programmer des envois automatiques."
    },
    {
      question: "Comment contacter le support ?",
      answer: "Notre équipe support est disponible 24/7. Contactez-nous par email (Asseko19@gmail.com) ou téléphone (+241 74 06 64 61)."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <EboLogo size="md" variant="minimal" />
                <Badge variant="secondary">Pro</Badge>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/contact">
                <Button variant="ghost">Support</Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/inscription">
                <Button className="btn-gradient">Inscription PME</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to home */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Guide Complet Ebo'o Gest
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Apprenez à maîtriser toutes les fonctionnalités d'Ebo'o Gest 
            pour optimiser la gestion de votre entreprise
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Démarrage</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="tutorials">Tutoriels</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Démarrage Rapide */}
          <TabsContent value="getting-started" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Démarrage Rapide
              </h2>
              <p className="text-lg text-muted-foreground">
                Suivez ces étapes pour configurer votre compte en quelques minutes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="card-stats group hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <Badge variant="outline">Étape {step.step}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <Link to={step.link}>
                      <Button className="btn-gradient">
                        {step.action}
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Fonctionnalités */}
          <TabsContent value="features" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Fonctionnalités Détaillées
              </h2>
              <p className="text-lg text-muted-foreground">
                Découvrez toutes les capacités d'Ebo'o Gest
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card key={index} className="card-stats">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <feature.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        <CardDescription className="text-lg">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feature.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tutoriels */}
          <TabsContent value="tutorials" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Tutoriels Vidéo
              </h2>
              <p className="text-lg text-muted-foreground">
                Apprenez avec nos tutoriels vidéo détaillés
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="card-stats group hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <tutorial.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{tutorial.duration}</Badge>
                        <Badge variant={tutorial.difficulty === 'Facile' ? 'default' : 'secondary'}>
                          {tutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full btn-gradient">
                      <Play className="w-4 h-4 mr-2" />
                      Regarder
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Questions Fréquentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Trouvez rapidement les réponses à vos questions
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="card-stats">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary" />
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Support */}
            <Card className="card-stats bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Besoin d'aide supplémentaire ?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Notre équipe support est là pour vous aider 24/7
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="btn-gradient">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                  <a href="tel:+24174066461">
                    <Button variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
