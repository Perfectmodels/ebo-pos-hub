
import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployees, Employee } from '@/hooks/useEmployees';
import { firestore } from '@/config/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { Plus, Loader2, Trash2 } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  employee_id: string;
  color?: string;
}

export default function Planning() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { employees, loading: employeesLoading } = useEmployees();

  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<ScheduleEvent> | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(firestore, 'schedules'), where('business_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedEvents = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          start: data.start.toDate(),
          end: data.end.toDate(),
          employee_id: data.employee_id,
          // You can add logic for event color based on employee or role
        };
      });
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
      toast({ title: "Erreur", description: "Impossible de charger le planning.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSelect = (selectInfo: any) => {
    setIsNewEvent(true);
    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setIsNewEvent(false);
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      employee_id: clickInfo.event.extendedProps.employee_id,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent || !user) return;

    const { title, start, end, employee_id, id } = selectedEvent;

    if (!title || !start || !end || !employee_id) {
        toast({ title: "Champs requis", description: "Veuillez remplir tous les champs.", variant: "destructive" });
        return;
    }

    const eventData = {
      business_id: user.uid,
      title,
      start: Timestamp.fromDate(new Date(start)),
      end: Timestamp.fromDate(new Date(end)),
      employee_id,
    };

    try {
      if (id) { // Update existing event
        const eventRef = doc(firestore, 'schedules', id);
        await updateDoc(eventRef, eventData);
        toast({ title: "Événement mis à jour" });
      } else { // Create new event
        await addDoc(collection(firestore, 'schedules'), eventData);
        toast({ title: "Événement créé" });
      }
      fetchEvents();
      handleModalClose();
    } catch (error) {
      console.error("Error saving event: ", error);
      toast({ title: "Erreur", description: "Impossible de sauvegarder l'événement.", variant: "destructive" });
    }
  };

  const handleDeleteEvent = async () => {
      if (!selectedEvent?.id) return;
      if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce quart de travail ?")) return;
      
      try {
          await deleteDoc(doc(firestore, 'schedules', selectedEvent.id));
          toast({ title: "Événement supprimé" });
          fetchEvents();
          handleModalClose();
      } catch (error) {
          console.error("Error deleting event: ", error);
          toast({ title: "Erreur", description: "Impossible de supprimer l'événement.", variant: "destructive" });
      }
  }

  const getEmployeeName = (employeeId: string) => {
      return employees.find(e => e.id === employeeId)?.full_name || 'Employé inconnu';
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground mb-4">Planning de l'Équipe</h1>
      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView='timeGridWeek'
              events={events.map(e => ({...e, title: `${e.title} - ${getEmployeeName(e.employee_id)}`}))}
              selectable={true}
              select={handleSelect}
              eventClick={handleEventClick}
              locale={'fr'}
              height="auto"
              editable={true}
              droppable={true}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isNewEvent ? 'Nouveau Quart' : 'Modifier le Quart'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={selectedEvent?.title || ''} onChange={(e) => setSelectedEvent({...selectedEvent, title: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Employé</Label>
                {employeesLoading ? <p>Chargement...</p> : (
                    <Select value={selectedEvent?.employee_id} onValueChange={(val) => setSelectedEvent({...selectedEvent, employee_id: val})}>
                        <SelectTrigger><SelectValue placeholder="Assigner à..." /></SelectTrigger>
                        <SelectContent>
                            {employees.map(emp => (
                                <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start">Début</Label>
                    <Input id="start" type="datetime-local" value={selectedEvent?.start ? new Date(selectedEvent.start).toISOString().slice(0,16) : ''} onChange={(e) => setSelectedEvent({...selectedEvent, start: new Date(e.target.value)})} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="end">Fin</Label>
                    <Input id="end" type="datetime-local" value={selectedEvent?.end ? new Date(selectedEvent.end).toISOString().slice(0,16) : ''} onChange={(e) => setSelectedEvent({...selectedEvent, end: new Date(e.target.value)})} />
                </div>
            </div>
          </div>
          <DialogFooter className="justify-between">
            <div>
                {!isNewEvent && (
                    <Button variant="destructive" onClick={handleDeleteEvent}><Trash2 className="w-4 h-4 mr-2"/> Supprimer</Button>
                )}
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handleModalClose}>Annuler</Button>
                <Button onClick={handleSaveEvent}>Enregistrer</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
