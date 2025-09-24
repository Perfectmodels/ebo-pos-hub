import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Smartphone,
  TrendingUp,
  Clock,
  Globe,
  Award,
  Target,
  Lightbulb,
  Heart,
  Sparkles,
  BookOpen,
  Play,
  Download,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  ChevronUp,
  Menu,
  X,
  ShoppingCart,
  Package,
  Utensils,
  Coffee,
  Truck,
  Store,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';
import EboLogo from '@/components/EboLogo';

export default function HomeNew() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Effet de scroll pour la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation d'apparition
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotation des fonctionnalités
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: ShoppingCart,
      title: "Gestion des Ventes",
      description: "Interface caisse moderne avec paiement multi-modes",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Package,
      title: "Suivi du Stock",
      description: "Alertes automatiques et gestion des approvisionnements",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Gestion du Personnel",
      description: "Suivi des employés et pointage automatique",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Rapports Avancés",
      description: "Analyses détaillées et tableaux de bord",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "500+", label: "PMEs Actives", icon: Store },
    { number: "50K+", label: "Transactions", icon: TrendingUp },
    { number: "99.9%", label: "Disponibilité", icon: Shield },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const testimonials = [
    {
      name: "Catherine Mengue",
      role: "Commerçante",
      content: "Ebo'o Gest a révolutionné notre gestion. Interface intuitive et fonctionnalités complètes.",
      rating: 5,
      avatar: "MN"
    },
    {
      name: "Jean Dupont",
      role: "Propriétaire, Snack Express",
      content: "Solution parfaite pour notre snack. Gestion des stocks et ventes simplifiée.",
      rating: 5,
      avatar: "JD"
    },
    {
      name: "Paul Mballa",
      role: "Manager, Bar Le Coq",
      content: "Excellent outil de gestion. Les rapports nous aident beaucoup dans nos décisions.",
      rating: 5,
      avatar: "PM"
    }
  ];

  const quickLinks = [
    { name: "Tableau de bord", href: "/dashboard", icon: BarChart3 },
    { name: "Gestion des ventes", href: "/ventes", icon: ShoppingCart },
    { name: "Suivi du stock", href: "/stock", icon: Package },
    { name: "Gestion du personnel", href: "/personnel", icon: Users },
    { name: "Rapports", href: "/rapports", icon: TrendingUp },
    { name: "Paramètres", href: "/parametres", icon: Settings }
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "YouTube", href: "#", icon: Youtube }
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation avec effets */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <EboLogo size="md" variant="minimal" />
              <Badge variant="secondary" className="ml-2">Pro</Badge>
            </div>
            
            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
              <Link to="/admin-login" className="text-muted-foreground hover:text-primary transition-colors">
                Admin
              </Link>
              <Link to="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/inscription">
                <Button className="btn-gradient">
                  Inscription PME
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Menu Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
              <div className="px-4 py-4 space-y-4">
                <Link to="/" className="block text-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
                <Link to="/admin-login" className="block text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
                <div className="flex space-x-2 pt-2">
                  <Link to="/auth" className="flex-1">
                    <Button variant="outline" className="w-full">Connexion</Button>
                  </Link>
                  <Link to="/inscription" className="flex-1">
                    <Button className="btn-gradient w-full">Inscription</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section avec effets */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background avec particules animées */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Solution #1 en Afrique
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Ebo'o Gest
                </span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl text-muted-foreground">
                  Gestion Multi-Activités
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                La solution complète pour gérer votre restaurant, snack, bar ou commerce. 
                Interface moderne, fonctionnalités avancées, support 24/7.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <Link to="/inscription">
                <Button size="lg" className="btn-gradient text-lg px-8 py-4">
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer Gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/guide">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Guide Complet
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats avec animation */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {stats.map((stat, index) => (
                <Card key={index} className="card-stats text-center group hover:scale-105 transition-transform duration-300">
                  <CardContent className="p-4">
                    <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section avec rotation automatique */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une suite complète d'outils pour gérer efficacement votre entreprise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`card-stats group hover:scale-105 transition-all duration-300 cursor-pointer ${
                  activeFeature === index ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-stats group hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à transformer votre gestion ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des centaines d'entreprises qui font confiance à Ebo'o Gest
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription">
              <Button size="lg" className="btn-gradient text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Commencer Maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <EboLogo size="md" variant="minimal" />
                <Badge variant="secondary" className="ml-2">Pro</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Solution de gestion complète pour PME africaines. 
                Interface moderne, fonctionnalités avancées.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="text-muted-foreground hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    Guide Complet
                  </Link>
                </li>
                <li>
                  <a href="tel:+24174066461" className="text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 inline mr-2" />
                    +241 74 06 64 61
                  </a>
                </li>
                <li>
                  <a href="mailto:Asseko19@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Asseko19@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Informations */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Informations</h3>
              <ul className="space-y-2">
                <li>
                  <span className="text-muted-foreground">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Libreville, Gabon
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Support 24/7
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Sécurisé & Fiable
                  </span>
                </li>
                <li>
                  <span className="text-muted-foreground">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Disponible partout
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Ebo'o Gest. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Confidentialité
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Conditions
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bouton retour en haut */}
      <Button
        className="fixed bottom-6 right-6 z-40 rounded-full w-12 h-12 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp className="w-5 h-5" />
      </Button>
    </div>
  );
}
