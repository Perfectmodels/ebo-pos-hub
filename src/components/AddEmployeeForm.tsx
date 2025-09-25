
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from 'zod';
import { Loader2, UserPlus } from 'lucide-react';

// Define the shape of the props
interface AddEmployeeFormProps {
  addEmployee: (employee: any) => Promise<{ data: any; error: any; }>;
  onFinished: () => void;
  businessId: string; // Business ID is required to associate the employee
}

// Validation schema
const employeeSchema = z.object({
  full_name: z.string().min(2, { message: "Le nom complet est requis (2 caractères min)." }),
  role: z.string().min(1, { message: "Le rôle est requis." }),
  email: z.string().email({ message: "L'adresse email est invalide." }),
  phone: z.string().optional(),
  pin_code: z.string().length(4, { message: "Le code PIN doit contenir exactement 4 chiffres." }).regex(/^\d{4}$/, { message: "Le code PIN ne doit contenir que des chiffres." }),
  business_id: z.string(),
});

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ addEmployee, onFinished, businessId }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    email: '',
    phone: '',
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

    const dataToValidate = {
      ...formData,
      business_id: businessId,
    };

    const result = employeeSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const { error } = await addEmployee(result.data);
      if (error) {
        throw new Error(error.message);
      }
      toast({
        title: "Employé ajouté",
        description: `${result.data.full_name} a été ajouté à votre équipe.`,
      });
      onFinished(); // Close the modal
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout de l'employé.",
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
                <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Jean Dupont" />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select name="role" onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
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
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemple.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Téléphone (Optionnel)</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+241 XX XX XX XX" />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="pin_code">Code PIN (pour pointage/caisse)</Label>
            <Input id="pin_code" name="pin_code" type="password" value={formData.pin_code} onChange={handleChange} placeholder="1234" maxLength={4} />
            {errors.pin_code && <p className="text-sm text-destructive">{errors.pin_code}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onFinished} disabled={loading}>
                Annuler
            </Button>
            <Button type="submit" className="btn-gradient" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Ajouter l'employé
            </Button>
        </div>
    </form>
  );
};

export default AddEmployeeForm;
