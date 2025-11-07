
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { Loader2, UserCog } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees'; // Adjusted import

// Define the shape of the props
interface EditEmployeeFormProps {
  employee: Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => Promise<void>;
  onFinished: () => void;
}

// Validation schema
const employeeSchema = z.object({
  full_name: z.string().min(2, { message: "Le nom complet est requis (2 caractères min)." }),
  role: z.string().min(1, { message: "Le rôle est requis." }),
  email: z.string().email({ message: "L'adresse email est invalide." }),
  phone: z.string().optional(),
  pin_code: z.string().optional()
    .refine(pin => pin === '' || (pin && pin.length === 4 && /^\d{4}$/.test(pin)), {
        message: "Le nouveau code PIN doit contenir exactement 4 chiffres."
    }),
});

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ employee, updateEmployee, onFinished }) => {
  const [formData, setFormData] = useState({
    full_name: employee.full_name || '',
    role: employee.role || '',
    email: employee.email || '',
    phone: employee.phone || '',
    pin_code: '', 
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = employeeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path[0];
        if (path && typeof path === 'string') {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
        const updates: Partial<Employee> = {
            ...result.data,
        };

        if (!result.data.pin_code) {
            delete updates.pin_code;
        }

      await updateEmployee(employee.id, updates);
      
      toast({
        title: "Employé mis à jour",
        description: `Le profil de ${result.data.full_name} a été mis à jour.`,
      });
      onFinished(); // Close the modal
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet</Label>
                <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Vendeur(se)">Vendeur(se)</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Serveur(se)">Serveur(se)</SelectItem>
                        <SelectItem value="Cuisinier(e)">Cuisinier(e)</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="pin_code">Nouveau Code PIN (laisser vide pour ne pas changer)</Label>
            <Input id="pin_code" name="pin_code" type="password" value={formData.pin_code} onChange={handleChange} placeholder="****" maxLength={4} />
            {errors.pin_code && <p className="text-sm text-destructive">{errors.pin_code}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onFinished} disabled={loading}>
                Annuler
            </Button>
            <Button type="submit" className="btn-gradient" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCog className="mr-2 h-4 w-4" />}
                Enregistrer les modifications
            </Button>
        </div>
    </form>
  );
};

export default EditEmployeeForm;
