
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees';

interface PinInputProps {
  businessId: string;
  onVerified: (employee: Employee) => void;
}

const PinInput: React.FC<PinInputProps> = ({ businessId, onVerified }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const handleVerifyPin = async () => {
    if (pin.length !== 4) return;
    setLoading(true);
    const q = query(
        collection(firestore, 'employees'), 
        where('business_id', '==', businessId),
        where('pin_code', '==', pin)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast({ title: "Code PIN invalide", description: "Veuillez réessayer ou contacter un manager.", variant: "destructive" });
      setPin('');
    } else {
      const empDoc = querySnapshot.docs[0];
      const employee = { id: empDoc.id, ...empDoc.data() } as Employee;
      toast({ title: `Connecté en tant que ${employee.full_name}` });
      onVerified(employee); 
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleVerifyPin();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identification Requise</CardTitle>
        <CardDescription>Veuillez entrer votre code PIN à 4 chiffres pour accéder au point de vente.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Input
          type="password"
          value={pin}
          onChange={handlePinChange}
          onKeyPress={handleKeyPress}
          maxLength={4}
          className="w-48 text-center text-3xl tracking-[1.5rem] font-bold"
          placeholder="••••"
          autoFocus
        />
        <Button onClick={handleVerifyPin} disabled={loading || pin.length < 4} className="w-48 btn-gradient">
          {loading ? <Loader2 className="animate-spin" /> : 'Valider'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PinInput;
