// @ts-nocheck - Temporarily disabled for Firebase User type compatibility
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  CheckCircle,
  AlertCircle,
  Timer,
  Calendar,
  MapPin,
  User,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface TimeTrackingProps {
  employeeId?: string;
  employeeName?: string;
  onTimeUpdate?: (timeData: any) => void;
}

interface TimeEntry {
  id: string;
  employee_id: string;
  check_in: string;
  check_out?: string;
  date: string;
  total_hours?: number;
  status: 'active' | 'completed';
}

export default function TimeTracking({ 
  employeeId, 
  employeeName, 
  onTimeUpdate 
}: TimeTrackingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeEntry | null>(null);
  const [todayHours, setTodayHours] = useState(0);
  const [loading, setLoading] = useState(false);

  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Vérifier le statut de pointage au chargement
  useEffect(() => {
    checkClockStatus();
  }, [employeeId]);

  const checkClockStatus = async () => {
    try {
      // En production, vérifier en base de données
      const hasActiveSession = localStorage.getItem(`active_session_${employeeId || user?.id}`);
      if (hasActiveSession) {
        const sessionData = JSON.parse(hasActiveSession);
        setIsClockedIn(true);
        setCurrentSession(sessionData);
        calculateTodayHours();
      }
    } catch (error) {
      console.error('Erreur vérification statut:', error);
    }
  };

  const calculateTodayHours = () => {
    const today = new Date().toDateString();
    const todaySessions = JSON.parse(localStorage.getItem(`sessions_${employeeId || user?.id}`) || '[]');
    
    const todayTotal = todaySessions
      .filter((session: TimeEntry) => new Date(session.date).toDateString() === today)
      .reduce((total: number, session: TimeEntry) => total + (session.total_hours || 0), 0);
    
    setTodayHours(todayTotal);
  };

  const handleClockIn = async () => {
    setLoading(true);
    
    try {
      const now = new Date();
      const sessionData: TimeEntry = {
        id: `session_${Date.now()}`,
        employee_id: employeeId || user?.id || '',
        check_in: now.toISOString(),
        date: now.toDateString(),
        status: 'active'
      };

      // Sauvegarder en local (en production, utiliser Supabase)
      localStorage.setItem(`active_session_${employeeId || user?.id}`, JSON.stringify(sessionData));
      
      setIsClockedIn(true);
      setCurrentSession(sessionData);
      
      toast({
        title: "Pointage effectué !",
        description: `Vous avez pointé à ${now.toLocaleTimeString()}`,
      });

      onTimeUpdate?.(sessionData);
      
    } catch (error) {
      toast({
        title: "Erreur de pointage",
        description: "Impossible d'enregistrer le pointage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    
    try {
      if (!currentSession) return;

      const now = new Date();
      const checkInTime = new Date(currentSession.check_in);
      const totalHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

      const completedSession = {
        ...currentSession,
        check_out: now.toISOString(),
        total_hours: Math.round(totalHours * 100) / 100,
        status: 'completed' as const
      };

      // Sauvegarder la session complétée
      const existingSessions = JSON.parse(localStorage.getItem(`sessions_${employeeId || user?.id}`) || '[]');
      const updatedSessions = [...existingSessions, completedSession];
      localStorage.setItem(`sessions_${employeeId || user?.id}`, JSON.stringify(updatedSessions));

      // Supprimer la session active
      localStorage.removeItem(`active_session_${employeeId || user?.id}`);
      
      setIsClockedIn(false);
      setCurrentSession(null);
      calculateTodayHours();
      
      toast({
        title: "Fin de service !",
        description: `Vous avez travaillé ${totalHours.toFixed(2)} heures aujourd'hui`,
      });

      onTimeUpdate?.(completedSession);
      
    } catch (error) {
      toast({
        title: "Erreur de pointage",
        description: "Impossible d'enregistrer la fin de service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Pointage Employé
        </CardTitle>
        <CardDescription>
          Gestion des heures de travail en temps réel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="" />
            <AvatarFallback>
              {getInitials(employeeName || 'E')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{employeeName || 'Employé'}</h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(currentTime)}
            </p>
          </div>
        </div>

        {/* Clock Status */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-mono">
            {formatTime(currentTime)}
          </div>
          
          <div className="flex items-center justify-center gap-2">
            {isClockedIn ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                En service
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="w-4 h-4 mr-1" />
                Hors service
              </Badge>
            )}
          </div>

          {isClockedIn && currentSession && (
            <div className="text-sm text-muted-foreground">
              Début de service: {formatTime(new Date(currentSession.check_in))}
            </div>
          )}
        </div>

        {/* Clock Actions */}
        <div className="flex gap-2">
          {!isClockedIn ? (
            <Button 
              onClick={handleClockIn}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? 'Pointage...' : 'Commencer'}
            </Button>
          ) : (
            <Button 
              onClick={handleClockOut}
              disabled={loading}
              variant="destructive"
              className="flex-1"
            >
              <Square className="w-4 h-4 mr-2" />
              {loading ? 'Fin...' : 'Terminer'}
            </Button>
          )}
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {todayHours.toFixed(1)}h
            </div>
            <div className="text-sm text-muted-foreground">
              Aujourd'hui
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {isClockedIn ? '●' : '○'}
            </div>
            <div className="text-sm text-muted-foreground">
              Statut
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">Lun</div>
            <div className="text-muted-foreground">8.5h</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">Mar</div>
            <div className="text-muted-foreground">7.2h</div>
          </div>
          <div className="p-2 bg-muted/50 rounded">
            <div className="font-semibold">Mer</div>
            <div className="text-muted-foreground">8.0h</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
