
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Headphones,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import EboLogo from '@/components/EboLogo';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "Asseko19@gmail.com",
      description: "Réponse sous 24h",
      action: "mailto:Asseko19@gmail.com",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Téléphone",
      value: "+241 74 06 64 61",
      description: "Disponible 9h-18h",
      action: "tel:+24174066461",
      color: "text-green-600"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: "+241 74 06 64 61",
      description: "Support instantané",
      action: "https://wa.me/24174066461",
      color: "text-green-500"
    }
  ];

  const supportHours = [
    { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
    { day: "Samedi", hours: "9h00 - 14h00" },
    { day: "Dimanche", hours: "Fermé" }
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
              <Link to="/admin-login">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                  Admin
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/auth">
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
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <Headphones className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Besoin d'aide ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe de support est là pour vous accompagner dans l'utilisation d'Ebo'o Gest
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="card-stats">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Envoyez-nous un message
              </CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Objet de votre message"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Décrivez votre problème ou votre question..."
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full btn-gradient"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card className="card-stats">
              <CardHeader>
                <CardTitle>Nos coordonnées</CardTitle>
                <CardDescription>
                  Contactez-nous par le moyen qui vous convient le mieux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                      <div>
                        <div className="font-medium">{method.title}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{method.value}</div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(method.action, '_blank')}
                        className="mt-1"
                      >
                        Contacter
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card className="card-stats">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horaires de support
                </CardTitle>
                <CardDescription>
                  Nos équipes sont disponibles pour vous aider
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="font-medium">{schedule.day}</span>
                      <span className="text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-stats">
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>
                  Solutions rapides pour les problèmes courants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/auth">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Problème de connexion
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/auth">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Problème d'inscription
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="mailto:Asseko19@gmail.com?subject=Support Ebo'o Gest">
                    <Mail className="w-4 h-4 mr-2" />
                    Email direct
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-stats">
              <CardHeader>
                <CardTitle className="text-lg">Comment créer un compte ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Allez sur la page d'authentification, sélectionnez l'onglet "Inscription PME" et remplissez le formulaire. C'est simple et rapide.
                </p>
              </CardContent>
            </Card>

            <Card className="card-stats">
              <CardHeader>
                <CardTitle className="text-lg">Problème de connexion ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Vérifiez votre email et mot de passe. Si le problème persiste, 
                  contactez-nous directement.
                </p>
              </CardContent>
            </Card>

            <Card className="card-stats">
              <CardHeader>
                <CardTitle className="text-lg">Comment utiliser le scanner QR ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Autorisez l'accès à la caméra, pointez vers un code QR, 
                  et le produit sera automatiquement ajouté.
                </p>
              </CardContent>
            </Card>

            <Card className="card-stats">
              <CardHeader>
                <CardTitle className="text-lg">Support technique ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Contactez-nous par email ou WhatsApp pour un support technique 
                  personnalisé et rapide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <EboLogo size="md" variant="minimal" />
            <Badge variant="secondary" className="ml-2">Pro</Badge>
          </div>
          <p className="text-muted-foreground">
            © 2024 Ebo'o Gest. Solution de gestion pour PME africaines.
          </p>
        </div>
      </footer>
    </div>
  );
}
