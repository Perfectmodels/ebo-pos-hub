import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  Plus,
  Music,
  Clock,
  MapPin,
  Users,
  Star
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'concert' | 'karaoke' | 'party' | 'other';
  capacity: number;
  price: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  createdAt: string;
  businessId: string;
}

export default function Events() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const mockEvents: Event[] = [
        {
          id: '1',
          name: 'Soirée Karaoké',
          description: 'Soirée karaoké avec DJ et ambiance festive',
          date: '2024-01-25',
          time: '20:00',
          location: 'Bar Le Coq',
          type: 'karaoke',
          capacity: 50,
          price: 5000,
          status: 'upcoming',
          attendees: 25,
          createdAt: new Date().toISOString(),
          businessId: user?.uid || ''
        }
      ];
      
      setEvents(mockEvents);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'concert': return <Music className="w-4 h-4" />;
      case 'karaoke': return <Users className="w-4 h-4" />;
      case 'party': return <Star className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Événements</h1>
            <p className="text-muted-foreground">Organisez vos événements et soirées</p>
          </div>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Événement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Événements</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">À venir</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {events.filter(e => e.status === 'upcoming').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold text-green-600">
                    {events.reduce((sum, event) => sum + event.attendees, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-stats">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {events.reduce((sum, event) => sum + (event.price * event.attendees), 0).toLocaleString()} FCFA
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
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
            {events.map((event) => (
              <Card key={event.id} className="card-stats">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {getTypeIcon(event.type)}
                        {event.name}
                      </CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {getStatusLabel(event.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.attendees}/{event.capacity} participants</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold text-primary">
                      {event.price.toLocaleString()} FCFA
                    </span>
                    <Button size="sm" variant="outline">
                      Voir détails
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
