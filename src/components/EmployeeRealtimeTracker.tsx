import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  RefreshCw,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Timer,
  Activity
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'on_break' | 'offline';
  avatar?: string;
  current_location?: string;
  last_activity?: string;
  today_sales?: number;
  today_hours?: number;
  is_clocked_in?: boolean;
  check_in_time?: string;
}

interface EmployeeRealtimeTrackerProps {
  onEmployeeSelect?: (employee: Employee) => void;
  onRefresh?: () => void;
}

export default function EmployeeRealtimeTracker({ 
  onEmployeeSelect, 
  onRefresh 
}: EmployeeRealtimeTrackerProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  // Utiliser les vraies données des employés
  const { employees: realEmployees, loading: employeesLoading } = useEmployees();

  useEffect(() => {
    if (realEmployees && realEmployees.length > 0) {
      // Transformer les données réelles pour inclure les informations de tracking
      const transformedEmployees: Employee[] = realEmployees.map(emp => ({
        id: emp.id,
        name: emp.full_name,
        email: emp.email,
        phone: emp.phone || '',
        role: emp.role,
        status: 'active', // Tous les employés sont considérés comme actifs
        current_location: 'En service',
        last_activity: 'En ligne',
        today_sales: 0, // À calculer depuis les ventes
        today_hours: 0, // À calculer depuis les heures
        is_clocked_in: true,
        check_in_time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }));
      setEmployees(transformedEmployees);
    }
    setFilteredEmployees(employees);
  }, [realEmployees]);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, statusFilter, roleFilter, employees]);

  const filterEmployees = () => {
    let filtered = employees;

    // Filtrage par nom
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    // Filtrage par rôle
    if (roleFilter !== "all") {
      filtered = filtered.filter(emp => emp.role === roleFilter);
    }

    setFilteredEmployees(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'on_break':
        return <Timer className="w-4 h-4 text-yellow-600" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simuler le rafraîchissement
    setTimeout(() => {
      setLoading(false);
      onRefresh?.();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Suivi Employés en Temps Réel</h2>
          <p className="text-muted-foreground">
            Surveillez l'activité de vos employés en direct
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="on_break">En pause</SelectItem>
                <SelectItem value="offline">Hors ligne</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="Vendeur">Vendeur</SelectItem>
                <SelectItem value="Caissier">Caissier</SelectItem>
                <SelectItem value="Gestionnaire">Gestionnaire</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {filteredEmployees.length} employé{filteredEmployees.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(employee.status)}
                  <span className="text-sm font-medium">
                    {employee.status === 'active' ? 'En service' :
                     employee.status === 'on_break' ? 'En pause' :
                     'Hors ligne'}
                  </span>
                </div>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{employee.current_location}</span>
              </div>

              {/* Activity */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                <span>Dernière activité: {employee.last_activity}</span>
              </div>

              {/* Clock Status */}
              {employee.is_clocked_in && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Pointé depuis {employee.check_in_time}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {employee.today_sales?.toLocaleString()} FCFA
                  </div>
                  <div className="text-xs text-muted-foreground">Ventes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {employee.today_hours?.toFixed(1)}h
                  </div>
                  <div className="text-xs text-muted-foreground">Heures</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onEmployeeSelect?.(employee)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Voir détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">En service</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.reduce((sum, e) => sum + (e.today_sales || 0), 0).toLocaleString()} FCFA
                </div>
                <div className="text-sm text-muted-foreground">Ventes totales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.reduce((sum, e) => sum + (e.today_hours || 0), 0).toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Heures totales</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.filter(e => e.is_clocked_in).length}/{employees.length}
                </div>
                <div className="text-sm text-muted-foreground">Pointés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
