import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  UserCheck, 
  Clock, 
  DollarSign,
  Edit,
  MoreHorizontal,
  Phone,
  Mail
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
  // Mock employee data
  const employees: Employee[] = [
    {
      id: "1",
      name: "Marie Kouassi", 
      role: "Gérant",
      status: "present",
      shift: "08:00 - 18:00",
      phone: "+225 07 12 34 56",
      email: "marie@restaurant.ci",
      todaySales: 85000,
      hoursWorked: 8
    },
    {
      id: "2", 
      name: "Jean Bakayoko",
      role: "Caissier",
      status: "present", 
      shift: "09:00 - 17:00",
      phone: "+225 05 98 76 54",
      email: "jean@restaurant.ci",
      todaySales: 65000,
      hoursWorked: 7
    },
    {
      id: "3",
      name: "Fatou Traoré", 
      role: "Serveuse",
      status: "present",
      shift: "10:00 - 19:00", 
      phone: "+225 01 45 67 89",
      email: "fatou@restaurant.ci",
      todaySales: 45000,
      hoursWorked: 6
    },
    {
      id: "4",
      name: "Koffi Assamoi",
      role: "Cuisinier", 
      status: "absent",
      shift: "07:00 - 15:00",
      phone: "+225 08 23 45 67", 
      email: "koffi@restaurant.ci",
      todaySales: 0,
      hoursWorked: 0
    }
  ];

  const stats = {
    totalEmployees: employees.length,
    presentToday: employees.filter(emp => emp.status === 'present').length,
    totalSalesToday: employees.reduce((sum, emp) => sum + emp.todaySales, 0),
    avgHoursWorked: employees.reduce((sum, emp) => sum + emp.hoursWorked, 0) / employees.length
  };

  const getStatusColor = (status: Employee['status']) => {
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

  const getStatusText = (status: Employee['status']) => {
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
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter Employé
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employés</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
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
                <p className="text-2xl font-bold text-accent">{stats.presentToday}</p>
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
                <p className="text-2xl font-bold">{stats.totalSalesToday.toLocaleString()} FCFA</p>
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
                <p className="text-2xl font-bold">{stats.avgHoursWorked.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
      <div className="grid gap-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="card-stats">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{employee.name}</h3>
                      <Badge variant="secondary">{employee.role}</Badge>
                      <Badge className={getStatusColor(employee.status)}>
                        {getStatusText(employee.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{employee.shift}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{employee.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {employee.status === 'present' && (
                    <div className="text-right space-y-1">
                      <div>
                        <p className="text-sm text-muted-foreground">Ventes aujourd'hui</p>
                        <p className="font-semibold text-primary">{employee.todaySales.toLocaleString()} FCFA</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Heures travaillées</p>
                        <p className="font-semibold">{employee.hoursWorked}h</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
}