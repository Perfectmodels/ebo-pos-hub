
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AddEmployeeForm from "@/components/AddEmployeeForm";
import EditEmployeeForm from "@/components/EditEmployeeForm"; 
import TimeClock from "@/components/TimeClock"; 
import { 
  Users, 
  Plus, 
  Edit,
  Trash2,
  Loader2,
  Clock
} from "lucide-react";

export default function Personnel() {
  const { user } = useAuth();
  const { employees, loading: employeesLoading, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const { toast } = useToast();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTimeClock, setShowTimeClock] = useState(false); 
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) return;
    try {
      const { error } = await deleteEmployee(employeeId);
      if (error) throw new Error(error.message);
      toast({ title: "Employé supprimé" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Personnel</h1>
          <p className="text-muted-foreground mt-1">Ajoutez, modifiez et suivez les membres de votre équipe.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTimeClock(true)} disabled={!user}>
            <Clock className="w-4 h-4 mr-2" />
            Pointage
          </Button>
          <Button className="btn-gradient" onClick={() => setShowAddModal(true)} disabled={!user}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Employé
          </Button>
        </div>
      </div>

      {employeesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun employé enregistré.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.map((employee) => (
            <Card key={employee.id} className="card-stats">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {getInitials(employee.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{employee.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(employee)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteEmployee(employee.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Ajouter un employé</CardTitle>
            </CardHeader>
            <CardContent>
              {user && (
                <AddEmployeeForm 
                  addEmployee={addEmployee}
                  onFinished={() => setShowAddModal(false)}
                  businessId={user.uid}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Modifier le profil de {selectedEmployee.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <EditEmployeeForm 
                employee={selectedEmployee}
                updateEmployee={updateEmployee}
                onFinished={() => {
                  setShowEditModal(false);
                  setSelectedEmployee(null);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {showTimeClock && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <TimeClock 
                businessId={user?.uid ?? ''} 
                onClose={() => setShowTimeClock(false)}
            />
        </div>
      )}

    </div>
  );
}
