import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmployees } from "@/hooks/useEmployees";
import { useSales } from "@/hooks/useSales";
import { useToast } from "@/hooks/use-toast";
import EmployeeProfile from "@/components/EmployeeProfile";
import TimeTracking from "@/components/TimeTracking";
import EmployeeRealtimeTracker from "@/components/EmployeeRealtimeTracker";
import EmployeeSalesTracker from "@/components/EmployeeSalesTracker";
import { 
  Users, 
  Plus, 
  UserCheck, 
  Clock, 
  DollarSign,
  Edit,
  MoreHorizontal,
  Phone,
  Mail,
  Loader2,
  Trash2,
  TrendingUp,
  CheckCircle
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'present' | 'absent' | 'conge';
  shift: string;
  phone: string;
  email: string;
  todaySales: number;
  hoursWorked: number;
}

export default function Personnel() {
  const { employees, loading: employeesLoading, deleteEmployee, getEmployeeStats } = useEmployees();
  const { sales } = useSales();
  const { toast } = useToast();
  
  const [employeeStats, setEmployeeStats] = useState<Record<string, any>>({});
  const [loadingStats, setLoadingStats] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showTimeTracking, setShowTimeTracking] = useState(false);
  const [showRealtimeTracker, setShowRealtimeTracker] = useState(false);
  const [showSalesTracker, setShowSalesTracker] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'realtime' | 'sales' | 'time'>('list');

  // Charger les statistiques des employés
  useEffect(() => {
    const loadEmployeeStats = async () => {
      setLoadingStats(true);
      const stats: Record<string, any> = {};
      
      for (const employee of employees) {
        const statsData = await getEmployeeStats(employee.user_id);
        stats[employee.user_id] = statsData;
      }
      
      setEmployeeStats(stats);
      setLoadingStats(false);
    };

    if (employees.length > 0) {
      loadEmployeeStats();
    }
  }, [employees, getEmployeeStats]);

  const stats = {
    totalEmployees: employees.length,
    presentToday: employees.length, // Tous les employés sont considérés comme présents
    totalSalesToday: Object.values(employeeStats).reduce((sum: number, emp: any) => sum + (emp.todaySales || 0), 0),
    avgHoursWorked: 8 // Valeur par défaut
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-accent text-accent-foreground';
      case 'absent':
        return 'bg-destructive text-destructive-foreground';
      case 'conge':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'conge':
        return 'En congé';
      default:
        return 'Inconnu';
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await deleteEmployee(employeeId);
      if (error) {
        throw new Error(error);
      }
      toast({
        title: "Employé supprimé",
        description: "L'employé a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Personnel</h1>
          <p className="text-muted-foreground mt-1">
            Suivez votre équipe et gérez les plannings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('realtime')}>
            <Users className="w-4 h-4 mr-2" />
            Suivi Temps Réel
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('sales')}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Ventes
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('time')}>
            <Clock className="w-4 h-4 mr-2" />
            Pointage
          </Button>
          <Button className="btn-gradient" onClick={() => setShowAddEmployee(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Employé
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === 'list' ? 'default' : 'outline'}
          onClick={() => setActiveTab('list')}
        >
          <Users className="w-4 h-4 mr-2" />
          Liste Employés
        </Button>
        <Button 
          variant={activeTab === 'realtime' ? 'default' : 'outline'}
          onClick={() => setActiveTab('realtime')}
        >
          <Users className="w-4 h-4 mr-2" />
          Suivi Temps Réel
        </Button>
        <Button 
          variant={activeTab === 'sales' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sales')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Suivi Ventes
        </Button>
        <Button 
          variant={activeTab === 'time' ? 'default' : 'outline'}
          onClick={() => setActiveTab('time')}
        >
          <Clock className="w-4 h-4 mr-2" />
          Pointage
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'realtime' && (
        <EmployeeRealtimeTracker 
          onEmployeeSelect={(employee) => {
            setSelectedEmployee(employee);
            setActiveTab('list');
          }}
        />
      )}

      {activeTab === 'sales' && (
        <EmployeeSalesTracker 
          selectedEmployee={selectedEmployee?.id}
          onEmployeeSelect={(employeeId) => {
            const employee = employees.find(e => e.user_id === employeeId);
            setSelectedEmployee(employee);
          }}
        />
      )}

      {activeTab === 'time' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <TimeTracking 
            employeeId={selectedEmployee?.id}
            employeeName={selectedEmployee?.name}
            onTimeUpdate={(timeData) => {
              console.log('Time update:', timeData);
            }}
          />
          <Card>
            <CardHeader>
              <CardTitle>Historique des Pointages</CardTitle>
              <CardDescription>
                Dernières activités de pointage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Jean Dupont</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pointé à 08:00
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Marie Nguema</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pointé à 09:30
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'list' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employés</p>
                <p className="text-2xl font-bold">
                  {employeesLoading ? "..." : stats.totalEmployees}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Présents Aujourd'hui</p>
                <p className="text-2xl font-bold text-accent">
                  {employeesLoading ? "..." : stats.presentToday}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ventes Équipe</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : `${stats.totalSalesToday.toLocaleString()} FCFA`}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Heures Moy.</p>
                <p className="text-2xl font-bold">
                  {loadingStats ? "..." : `${stats.avgHoursWorked.toFixed(1)}h`}
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
      {employeesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Chargement des employés...</span>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun employé enregistré</p>
          <p className="text-sm">Ajoutez votre premier employé pour commencer</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.map((employee) => {
            const user = employee.users;
            const empStats = employeeStats[employee.user_id] || { todaySales: 0, todayOrders: 0 };
            
            return (
              <Card key={employee.id} className="card-stats">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'E'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{user?.name || 'Employé'}</h3>
                          <Badge variant="secondary">{user?.role || 'Employé'}</Badge>
                          <Badge className={getStatusColor('present')}>
                            {getStatusText('present')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>08:00 - 18:00</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{user?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right space-y-1">
                        <div>
                          <p className="text-sm text-muted-foreground">Ventes aujourd'hui</p>
                          <p className="font-semibold text-primary">
                            {loadingStats ? "..." : `${empStats.todaySales.toLocaleString()} FCFA`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commandes</p>
                          <p className="font-semibold">
                            {loadingStats ? "..." : empStats.todayOrders}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle>Planning de la Semaine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Fonctionnalité de planning disponible avec l'intégration Supabase</p>
            <p className="text-sm">Créez et gérez les horaires de votre équipe</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" className="h-16 flex-col gap-2">
          <UserCheck className="w-6 h-6" />
          <span>Marquer Présence</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <Clock className="w-6 h-6" />
          <span>Gérer Planning</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col gap-2">
          <DollarSign className="w-6 h-6" />
          <span>Calculer Salaires</span>
        </Button>
      </div>
        </>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EmployeeProfile 
              mode="create"
              onSave={(employeeData) => {
                setShowAddEmployee(false);
                toast({
                  title: "Employé ajouté !",
                  description: `${employeeData.name} a été ajouté avec succès`,
                });
              }}
              onClose={() => setShowAddEmployee(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}