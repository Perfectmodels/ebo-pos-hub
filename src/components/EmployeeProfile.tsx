import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useEmployees } from "@/hooks/useEmployees";
import { 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface EmployeeProfileProps {
  employee?: any;
  onSave?: (employeeData: any) => void;
  onClose?: () => void;
  mode?: 'create' | 'edit' | 'view';
}

export default function EmployeeProfile({ 
  employee, 
  onSave, 
  onClose, 
  mode = 'create' 
}: EmployeeProfileProps) {
  const { addEmployee, updateEmployee } = useEmployees();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    role: employee?.role || "Vendeur",
    address: employee?.address || "",
    hire_date: employee?.hire_date || "",
    salary: employee?.salary || 0,
    status: employee?.status || "Actif",
    notes: employee?.notes || ""
  });

  const roles = [
    "Vendeur",
    "Caissier", 
    "Gestionnaire",
    "Superviseur",
    "Manager",
    "Administrateur"
  ];

  const statuses = [
    "Actif",
    "Inactif", 
    "En congé",
    "Suspendu"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Champs requis",
        description: "Le nom et l'email sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const employeeData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
        hire_date: formData.hire_date,
        salary: formData.salary,
        status: formData.status,
        notes: formData.notes
      };

      if (mode === 'create') {
        const { data, error } = await addEmployee(employeeData);
        if (error) throw new Error(error);
        
        toast({
          title: "Employé créé !",
          description: `${formData.name} a été ajouté avec succès`,
        });
      } else {
        const { data, error } = await updateEmployee(employee?.id, employeeData);
        if (error) throw new Error(error);
        
        toast({
          title: "Employé mis à jour !",
          description: `${formData.name} a été modifié avec succès`,
        });
      }

      onSave?.(employeeData);
      onClose?.();
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {mode === 'create' ? 'Nouvel Employé' : 
           mode === 'edit' ? 'Modifier Employé' : 'Profil Employé'}
        </CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Créez un nouveau profil employé' :
           mode === 'edit' ? 'Modifiez les informations de l\'employé' :
           'Informations du profil employé'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={employee?.avatar} />
            <AvatarFallback className="text-lg">
              {getInitials(formData.name || 'E')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{formData.name || 'Nouvel Employé'}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={formData.status === 'Actif' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
              <Badge variant="outline">{formData.role}</Badge>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Jean Dupont"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="jean.dupont@entreprise.com"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+237 6XX XXX XXX"
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleInputChange('status', value)}
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hire_date">Date d'embauche</Label>
            <Input
              id="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={(e) => handleInputChange('hire_date', e.target.value)}
              disabled={mode === 'view'}
            />
          </div>

          <div>
            <Label htmlFor="salary">Salaire (FCFA)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', Number(e.target.value))}
              placeholder="0"
              disabled={mode === 'view'}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Adresse complète"
              disabled={mode === 'view'}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes sur l'employé..."
              rows={3}
              disabled={mode === 'view'}
            />
          </div>
        </div>

        {/* Actions */}
        {mode !== 'view' && (
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.email}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Créer Employé' : 'Sauvegarder'}
                </>
              )}
            </Button>
            
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
