import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMultiUser } from '@/contexts/MultiUserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Monitor, 
  Plus, 
  Settings, 
  Users, 
  Clock, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Square
} from "lucide-react";

const statusIcons = {
  available: CheckCircle,
  occupied: XCircle,
  offline: AlertTriangle
};

const statusColors = {
  available: 'text-green-600',
  occupied: 'text-red-600',
  offline: 'text-gray-600'
};

export default function CashRegisterSelector() {
  const { 
    registers, 
    currentSession, 
    availableRegisters, 
    createRegister, 
    startSession, 
    endSession,
    getRegisterStatus 
  } = useMultiUser();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRegisterName, setNewRegisterName] = useState('');
  const [newRegisterLocation, setNewRegisterLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Créer un nouveau registre
  const handleCreateRegister = async () => {
    if (!newRegisterName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour le registre",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await createRegister(newRegisterName.trim(), newRegisterLocation.trim());
      toast({
        title: "Registre créé",
        description: `${newRegisterName} a été ajouté avec succès`,
      });
      setNewRegisterName('');
      setNewRegisterLocation('');
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Démarrer une session
  const handleStartSession = async (registerId: string) => {
    setLoading(true);
    try {
      await startSession(registerId);
      toast({
        title: "Session démarrée",
        description: "Vous pouvez maintenant utiliser cette caisse",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Terminer la session actuelle
  const handleEndSession = async () => {
    if (!currentSession) return;

    const endingAmount = parseFloat(
      prompt('Entrez le montant de fermeture de caisse:') || '0'
    );

    if (isNaN(endingAmount)) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await endSession(currentSession.id, endingAmount);
      toast({
        title: "Session terminée",
        description: "La session a été fermée avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Session actuelle */}
      {currentSession && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Play className="w-5 h-5" />
              Session Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {registers.find(r => r.id === currentSession.registerId)?.name || 'Registre inconnu'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Débuté à {new Date(currentSession.startTime).toLocaleTimeString('fr-FR')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ventes: {currentSession.totalSales.toLocaleString()} FCFA ({currentSession.totalTransactions} transactions)
                </p>
              </div>
              <Button 
                onClick={handleEndSession}
                disabled={loading}
                variant="destructive"
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                Fermer Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des registres */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Registres de Caisse</h3>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Registre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Registre</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="registerName">Nom du Registre</Label>
                  <Input
                    id="registerName"
                    value={newRegisterName}
                    onChange={(e) => setNewRegisterName(e.target.value)}
                    placeholder="Ex: Caisse 1, Caisse Principale..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerLocation">Emplacement (optionnel)</Label>
                  <Input
                    id="registerLocation"
                    value={newRegisterLocation}
                    onChange={(e) => setNewRegisterLocation(e.target.value)}
                    placeholder="Ex: Entrée, Terrasse..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateRegister} disabled={loading}>
                  Créer le Registre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registers.map(register => {
            const status = getRegisterStatus(register.id);
            const StatusIcon = statusIcons[status];
            const isCurrentUser = register.currentUser === user?.uid;
            const currentSessionForRegister = sessions.find(s => 
              s.registerId === register.id && s.status === 'active'
            );

            return (
              <Card key={register.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      {register.name}
                    </CardTitle>
                    <StatusIcon className={`w-5 h-5 ${statusColors[status]}`} />
                  </div>
                  {register.location && (
                    <p className="text-sm text-muted-foreground">{register.location}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status === 'available' ? 'default' : status === 'occupied' ? 'destructive' : 'secondary'}
                    >
                      {status === 'available' ? 'Disponible' : 
                       status === 'occupied' ? 'Occupé' : 'Hors ligne'}
                    </Badge>
                  </div>

                  {currentSessionForRegister && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {currentSessionForRegister.userName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          Depuis {new Date(currentSessionForRegister.startTime).toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {currentSessionForRegister.totalSales.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {status === 'available' ? (
                      <Button 
                        onClick={() => handleStartSession(register.id)}
                        disabled={loading}
                        className="flex-1"
                        size="sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer
                      </Button>
                    ) : isCurrentUser ? (
                      <Button 
                        onClick={handleEndSession}
                        disabled={loading}
                        variant="destructive"
                        className="flex-1"
                        size="sm"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Fermer
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        Occupé
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {registers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun registre configuré</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre premier registre de caisse pour commencer
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer le Premier Registre
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
