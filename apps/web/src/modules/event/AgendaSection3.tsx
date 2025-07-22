"use client";

import { useState, useMemo } from "react";
import { GripVertical } from "lucide-react";
import { useGetAgenda } from "@/hooks/use-get-agenda";
import { useCreateAgenda } from "@/hooks/use-create-agenda";
import { Button } from "@/components/atoms/button";
// shadcn dialog imports
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";

const agendaHeaders = [
  "Slot",
  "Start",
  "End",
  "Activity",
  "Person in Charge",
  "Remarks",
];

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

export default function AgendaSection() {
  const eventId = "static-event-1"; // your static eventId for now
  const [currentDay, setCurrentDay] = useState(1);

  const {
    data: agendaSlots,
    isLoading,
    error,
  } = useGetAgenda(eventId, currentDay);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    start: "",
    end: "",
    activity: "",
    personincharge: "",
    remarks: "",
  });

  const { createAgenda, isPending: isCreating } = useCreateAgenda();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Debug: Log the form data
    console.log("Submitting form data:", {
      eventId,
      day: currentDay,
      ...form,
    });

    createAgenda(
      {
        eventId,
        day: currentDay,
        ...form,
      },
      {
        onSuccess: () => {
          console.log("Agenda created successfully");
          setOpen(false);
          setForm({
            start: "",
            end: "",
            activity: "",
            personincharge: "",
            remarks: "",
          });
        },
        onError: (error) => {
          console.error("Error creating agenda:", error);
          setSubmitError(
            error instanceof Error ? error.message : "Failed to create agenda"
          );
        },
      }
    );
  };

  const sortedSlots = useMemo(() => {
    if (!agendaSlots) return [];
    return [...agendaSlots].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [agendaSlots]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-purple-500">
        Loading agenda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
        Error loading agenda: {(error as any).message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Static Event Agenda (Day {currentDay})
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Create Agenda</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Agenda Slot</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {submitError}
                </div>
              )}
              <div>
                <label htmlFor="start">Start</label>
                <Input
                  id="start"
                  name="start"
                  type="datetime-local"
                  value={form.start}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="end">End</label>
                <Input
                  id="end"
                  name="end"
                  type="datetime-local"
                  value={form.end}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="activity">Activity</label>
                <Input
                  id="activity"
                  name="activity"
                  value={form.activity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="personincharge">Person in Charge</label>
                <Input
                  id="personincharge"
                  name="personincharge"
                  value={form.personincharge}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="remarks">Remarks</label>
                <Input
                  id="remarks"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleInputChange}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* TODO: Add Day Buttons if multiple days */}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
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
            </tr>
          </thead>
          <tbody>
            {sortedSlots.length > 0 ? (
              sortedSlots.map((slot, idx) => (
                <tr
                  key={slot.id}
                  className="border-t hover:bg-gray-50 cursor-move"
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4">{slot.start}</td>
                  <td className="px-6 py-4">{slot.end}</td>
                  <td className="px-6 py-4">{slot.activity}</td>
                  <td className="px-6 py-4">{slot.personincharge}</td>
                  <td className="px-6 py-4">{slot.remarks || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={agendaHeaders.length}
                  className="text-center text-gray-500 py-10"
                >
                  No agenda slots found for this event and day.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
