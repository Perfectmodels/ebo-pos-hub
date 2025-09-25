
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shiftData: any) => Promise<void>;
  onDelete?: (shiftId: string) => Promise<void>;
  employees: Employee[];
  eventInfo?: any; // Contains start, end, and existing event data
}

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, onSave, onDelete, employees, eventInfo }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (eventInfo) {
      const { start, end, allDay, extendedProps } = eventInfo;
      setEmployeeId(extendedProps?.resourceId || '');

      const formatForInput = (date: Date) => {
          const yyyy = date.getFullYear();
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const hh = String(date.getHours()).padStart(2, '0');
          const min = String(date.getMinutes()).padStart(2, '0');
          return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
      };

      const { date: sDate, time: sTime } = formatForInput(new Date(start));
      setStartDate(sDate);
      setStartTime(sTime);

      // If it's an all-day event from a date click, default end time
      const endDateObj = allDay ? new Date(new Date(start).setHours(17, 0, 0)) : new Date(end);
      const { date: eDate, time: eTime } = formatForInput(endDateObj);
      setEndDate(eDate);
      setEndTime(eTime);
    }
  }, [eventInfo]);

  const handleSubmit = async () => {
    if (!employeeId) {
        toast({ title: "Veuillez sélectionner un employé", variant: "destructive"});
        return;
    }
    
    setLoading(true);
    const start_time = `${startDate}T${startTime}:00`;
    const end_time = `${endDate}T${endTime}:00`;

    if (new Date(start_time) >= new Date(end_time)) {
        toast({ title: "L'heure de fin doit être après l'heure de début", variant: "destructive"});
        setLoading(false);
        return;
    }

    await onSave({
        id: eventInfo?.id, // Pass id if editing
        employee_id: employeeId,
        start_time,
        end_time
    });
    setLoading(false);
  };

  const handleDelete = async () => {
    if (onDelete && eventInfo?.id) {
        setLoading(true);
        await onDelete(eventInfo.id);
        setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">{eventInfo?.id ? "Modifier" : "Ajouter"} un horaire</h2>
        <div className="space-y-4">
            <div className="space-y-1">
                <Label>Employé</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un employé..." /></SelectTrigger>
                    <SelectContent>
                        {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="start-time">Heure de début</Label>
                    <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="end-time">Heure de fin</Label>
                    <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <div>
                    {eventInfo?.id && onDelete && (
                        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                           {loading ? <Loader2 className="animate-spin"/> : <Trash2 className="w-4 h-4"/>}
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={loading}>Annuler</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
