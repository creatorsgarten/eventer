"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Plus, Calendar, Filter, X, GripVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";

import { useCreateAgenda } from "@/hooks/use-create-agenda";
import { useGetAgenda } from "@/hooks/use-get-agenda";

type AgendaSectionProps = {
  eventData: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
};

type AgendaSlot = {
  id: string;
  eventId: string;
  start: string;
  end: string;
  personincharge: string;
  duration: number;
  activity: string;
  remarks?: string;
};

const agendaHeaders = [
  "Slot",
  "Start",
  "End",
  "Activity",
  "Person in Charge",
  "Remarks",
];

const editableFields: { key: keyof AgendaSlot; label: string }[] = [
  { key: "start", label: "Start Time" },
  { key: "end", label: "End Time" },
  { key: "activity", label: "Activity" },
  { key: "personincharge", label: "Person in Charge" },
  { key: "remarks", label: "Remarks" },
];

export default function AgendaSection({ eventData }: AgendaSectionProps) {
  const [agendaSlots, setAgendaSlots] = useState<AgendaSlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<AgendaSlot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const { createAgenda, isPending, error } = useCreateAgenda();
  const [hasMounted, setHasMounted] = useState(false);
  // Live time ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Days from start to end
  const eventDays = useMemo(() => {
    const start = new Date(eventData.startDate);
    const end = new Date(eventData.endDate);
    return (
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
  }, [eventData]);

  // Load from backend (stub for now)
  const { data: fetchedAgenda, isLoading } = useGetAgenda(
    eventData.id,
    currentDay
  );

  const loadAgendaSlots = useCallback(() => {
    if (fetchedAgenda) {
      setAgendaSlots(fetchedAgenda);
    }
  }, [fetchedAgenda]);

  useEffect(() => {
    if (Array.isArray(fetchedAgenda)) {
      setAgendaSlots(fetchedAgenda);
    } else {
      setAgendaSlots([]); // fallback to empty
    }
  }, [fetchedAgenda]);

  useEffect(() => {
    loadAgendaSlots();
  }, [loadAgendaSlots, eventData.id, currentDay]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAddSlot = () => {
    setEditingSlot({
      id: Date.now().toString(),
      eventId: eventData.id,
      start: "",
      end: "",
      duration: 0,
      personincharge: "",
      activity: "",
      remarks: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditSlot = (slot: AgendaSlot) => {
    setEditingSlot({ ...slot });
    setIsDialogOpen(true);
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;

    createAgenda(
      { ...editingSlot, remarks: editingSlot.remarks || "" },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingSlot(null);
          // loadAgendaSlots();
        },
      }
    );
  };

  const handleDeleteSlot = (id: string) => {
    setAgendaSlots((slots) =>
      slots
        .filter((s) => s.id !== id)
        .map((slot, idx) => ({
          ...slot,
          slot: idx + 1,
          order: idx + 1,
          updatedAt: new Date().toISOString(),
        }))
    );
  };

  const handleDrag = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedItem(id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const updated = [...agendaSlots];
    const fromIndex = updated.findIndex((s) => s.id === draggedItem);
    const toIndex = updated.findIndex((s) => s.id === targetId);

    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setAgendaSlots(
      updated.map((slot, idx) => ({
        ...slot,
        slot: idx + 1,
        order: idx + 1,
        updatedAt: new Date().toISOString(),
      }))
    );
    setDraggedItem(null);
  };

  const sortedSlots = useMemo(() => {
    if (!Array.isArray(agendaSlots)) return [];
    return [...agendaSlots].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [agendaSlots]);
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  if (isCreating) {
    return (
      <div className="flex items-center justify-center min-h-screen text-purple-500">
        <Calendar className="w-8 h-8 animate-spin" />
        <span className="ml-2 font-medium">Creating agenda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
        Error creating agenda. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{eventData.name}</h1>
            <p className="text-purple-200">Agenda Management</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 bg-white text-purple-600"
              onClick={() => window.location.assign(`/timer`)}
            >
              View Timer
            </Button>
          </div>
          <div className="bg-white text-gray-900 rounded-2xl p-6 shadow min-w-80">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">
                {hasMounted ? formatTime(currentTime) : "--:--:--"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-center">
              <div>
                <p className="text-gray-500">กิจกรรมปัจจุบัน</p>
                <p>No Slot</p>
              </div>
              <div>
                <p className="text-gray-500">กิจกรรมต่อไป</p>
                <p>No Slot</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-8 py-4 bg-white border-b flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search Task" className="pl-10 bg-gray-50" />
        </div>
        <div className="flex gap-2 ml-4">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(eventData.startDate).toLocaleDateString()}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Agenda Table */}
      <div className="px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          {/* Day Selector */}
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Day {currentDay}</h2>
              {eventDays > 1 && (
                <div className="flex gap-2">
                  {Array.from({ length: eventDays }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentDay === i + 1 ? "default" : "outline"}
                      size="sm"
                      className={
                        currentDay === i + 1 ? "bg-purple-600 text-white" : ""
                      }
                      onClick={() => setCurrentDay(i + 1)}
                    >
                      Day {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleAddSlot}
              className="bg-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {agendaHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-gray-600 font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedSlots.length > 0 ? (
                  sortedSlots.map((slot) => (
                    <tr
                      key={slot.id}
                      draggable
                      onDragStart={(e) => handleDrag(e, slot.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      className="border-t hover:bg-gray-50 cursor-move"
                    >
                      <td className="px-6 py-4 flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        {slot.id}
                      </td>
                      <td className="px-6 py-4">{slot.start}</td>
                      <td className="px-6 py-4">{slot.end}</td>
                      <td className="px-6 py-4">{slot.activity}</td>
                      <td className="px-6 py-4">{slot.personincharge}</td>
                      <td className="px-6 py-4">{slot.remarks}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-purple-600 text-white"
                            onClick={() => handleEditSlot(slot)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={agendaHeaders.length + 1}
                      className="text-center text-gray-500 py-10"
                    >
                      No agenda slots yet. Click “Add Task” to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSlot?.id ? "Edit" : "Add"} Task Schedule
            </DialogTitle>
          </DialogHeader>
          {editingSlot && (
            <div className="space-y-4 mt-4">
              {editableFields.map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={key} className="text-sm block mb-1">
                    {label}
                  </label>
                  <Input
                    id={key}
                    value={editingSlot[key] as string}
                    onChange={(e) =>
                      setEditingSlot(
                        (prev) => prev && { ...prev, [key]: e.target.value }
                      )
                    }
                    placeholder={label}
                  />
                </div>
              ))}
              <Button
                className="w-full bg-purple-600 text-white mt-4"
                onClick={handleSaveSlot}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
