import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useActivity } from "@/contexts/ActivityContext";
import { getActivityRoles, getDefaultRole } from "@/utils/employeeProfiles";
import { 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Key,
  Shield,
  Loader2,
  Users
} from "lucide-react";

interface AddEmployeeFormProps {
  onEmployeeAdded?: () => void;
  onClose?: () => void;
}

export default function AddEmployeeForm({ onEmployeeAdded, onClose }: AddEmployeeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addEmployee } = useEmployees();
  const { currentActivity } = useActivity();

  // Obtenir les rôles spécifiques à l'activité
  const activityRoles = getActivityRoles(currentActivity?.id || 'restaurant');
  const defaultRole = getDefaultRole(currentActivity?.id || 'restaurant');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: defaultRole.id,
    pin_code: '',
    status: 'active' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast({
        title: "Champs requis",
        description: "Le nom complet est obligatoire",
        variant: "destructive"
      });
      return;
    }

    if (!formData.pin_code || formData.pin_code.length !== 4) {
      toast({
        title: "Code PIN requis",
        description: "Le code PIN doit contenir exactement 4 chiffres",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await addEmployee(formData);
      
      if (result.success) {
        toast({
          title: "Employé ajouté",
          description: `${formData.full_name} a été ajouté avec le rôle ${activityRoles.find(r => r.id === formData.role)?.name}`,
        });
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          role: defaultRole.id,
          pin_code: '',
          status: 'active'
        });
        
        setIsOpen(false);
        onEmployeeAdded?.();
        onClose?.();
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible d'ajouter l'employé",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const selectedRole = activityRoles.find(role => role.id === formData.role);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un employé
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Nouvel employé - {currentActivity?.name}
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouvel employé avec un rôle adapté à votre activité
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations personnelles */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Nom complet de l'employé"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optionnel)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="employe@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+237 123 456 789"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin_code">Code PIN *</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin_code"
                  type="password"
                  placeholder="1234"
                  value={formData.pin_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, pin_code: e.target.value }))}
                  className="pl-10"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sélection du rôle */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {activityRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.icon} {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description du rôle sélectionné */}
          {selectedRole && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedRole.icon}</span>
                <Badge className={selectedRole.color}>
                  {selectedRole.name}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedRole.description}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Permissions :</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRole.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="btn-gradient">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Ajout en cours..." : "Ajouter l'employé"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}