
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { firestore } from '@/config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { Loader2, LogIn, LogOut, X } from 'lucide-react';
import { Employee } from '@/hooks/useEmployees';

interface TimeClockProps {
  businessId: string;
  onClose: () => void;
}

const TimeClock: React.FC<TimeClockProps> = ({ businessId, onClose }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [lastAttendance, setLastAttendance] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (employee) {
      fetchLastAttendance();
    }
  }, [employee]);

  const fetchLastAttendance = async () => {
    if (!employee) return;
    const q = query(
        collection(firestore, 'attendance'), 
        where('employee_id', '==', employee.id),
        orderBy('clock_in', 'desc'),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const attendanceDoc = querySnapshot.docs[0];
        setLastAttendance({ id: attendanceDoc.id, ...attendanceDoc.data() });
    } else {
        setLastAttendance(null);
    }
  };

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
      toast({ title: "Code PIN invalide", variant: "destructive" });
      setEmployee(null);
    } else {
      const empDoc = querySnapshot.docs[0];
      setEmployee({ id: empDoc.id, ...empDoc.data() } as Employee);
      toast({ title: `Bienvenue, ${empDoc.data().full_name}` });
    }
    setLoading(false);
  };

  const handleClockIn = async () => {
    if (!employee) return;
    setLoading(true);
    try {
        await addDoc(collection(firestore, 'attendance'), {
            employee_id: employee.id,
            business_id: businessId,
            clock_in: serverTimestamp(),
            clock_out: null,
        });
        toast({ title: "Heure d'arrivée enregistrée" });
        fetchLastAttendance();
    } catch (e) {
      toast({ title: "Erreur lors du pointage", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!lastAttendance) return;
    setLoading(true);
    try {
        const attendanceRef = doc(firestore, 'attendance', lastAttendance.id);
        await updateDoc(attendanceRef, { clock_out: serverTimestamp() });
        toast({ title: "Heure de départ enregistrée" });
        fetchLastAttendance();
    } catch (e) {
        toast({ title: "Erreur lors du départ", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const reset = () => {
    setPin('');
    setEmployee(null);
    setLastAttendance(null);
  };

  return (
    <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Pointage Employé</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
            </div>
        </CardHeader>
      <CardContent className="text-center">
        {!employee ? (
          <div className="space-y-4">
            <p>Veuillez entrer votre code PIN à 4 chiffres pour continuer.</p>
            <Input
              type="password"
              value={pin}
              onChange={handlePinChange}
              onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
              maxLength={4}
              className="w-40 mx-auto text-center text-2xl tracking-[1rem]"
              placeholder="••••"
            />
            <Button onClick={handleVerifyPin} disabled={loading || pin.length < 4}>
              {loading ? <Loader2 className="animate-spin"/> : 'Vérifier'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Bonjour, {employee.full_name}</h3>
            {lastAttendance && !lastAttendance.clock_out ? (
              <div className="space-y-2">
                <p>Pointage d'arrivée enregistré à: {new Date(lastAttendance.clock_in.toDate()).toLocaleTimeString()}</p>
                <Button onClick={handleClockOut} className="w-full" variant="destructive" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin"/> : <LogOut className="mr-2"/>} Pointer Départ
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {lastAttendance?.clock_out && <p>Dernier départ à: {new Date(lastAttendance.clock_out.toDate()).toLocaleTimeString()}</p>}
                <Button onClick={handleClockIn} className="w-full" variant="default" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin"/> : <LogIn className="mr-2"/>} Pointer Arrivée
                </Button>
              </div>
            )}
            
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {employee && <Button variant="link" onClick={reset}>Changer d'employé</Button>}
      </CardFooter>
    </Card>
  );
};

export default TimeClock;
