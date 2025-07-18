"use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { Search, Plus, Calendar, Filter, X, GripVertical } from "lucide-react";
// import { useCreateAgenda } from "@/hooks/use-create-agenda";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../../../../packages/ui/src/components"

// import { Search, Plus, Calendar, Filter, X, GripVertical } from "lucide-react";
// import {
//   Button,
//   Input,
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   Label,
// } from "@/components/atoms";

// //TODO : Import components and connect to hooks
// //TODO : Refactor variable

// type AgendaSectionProps = {
//   eventData: {
//     id: string;
//     name: string;
//     startDate: string;
//     endDate: string;
//   };
// };

// type AgendaSlot = {
//   id: string;
//   eventId: string;
//   slot: number;
//   order: number;
//   start: string;
//   end: string;
//   title: string;
//   place: string;
//   responsiblePeople: string;
//   day: number;
//   createdAt: string;
//   updatedAt: string;
// };

// export function AgendaSection({ eventData }: AgendaSectionProps) {
//   const [agendaSlots, setAgendaSlots] = useState<AgendaSlot[]>([]);
//   const [editingSlot, setEditingSlot] = useState<AgendaSlot | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const { createAgenda, isCreating } = useCreateAgenda();

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   //   const eventDays = useMemo(() => {
//   //     const start = new Date(eventData.startDate);
//   //     const end = new Date(eventData.endDate);
//   //     return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
//   //   }, [eventData.startDate, eventData.endDate]);

//   const handleAddSlot = useCallback(() => {
//     const now = new Date().toISOString();
//     const newSlot: AgendaSlot = {
//       id: crypto.randomUUID(),
//       eventId: eventData.id,
//       slot: agendaSlots.length + 1,
//       order: agendaSlots.length + 1,
//       start: "",
//       end: "",
//       title: "",
//       place: "",
//       responsiblePeople: "",
//       day: 1,
//       createdAt: now,
//       updatedAt: now,
//     };
//     setEditingSlot(newSlot);
//     setIsDialogOpen(true);
//   }, [agendaSlots.length, eventData.id]);

//   const handleSaveSlot = useCallback(() => {
//     if (!editingSlot) return;

//     createAgenda(editingSlot, {
//       onSuccess: () => {
//         setAgendaSlots((prev) => [...prev, editingSlot]);
//         setIsDialogOpen(false);
//         setEditingSlot(null);
//       },
//       onError: (err) => {
//         console.error("Failed to create agenda slot", err);
//       },
//     });
//   }, [createAgenda, editingSlot]);

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h1 className="text-xl font-bold">{eventData.name}</h1>
//           <p className="text-sm text-gray-500">
//             Current Time: {currentTime.toLocaleTimeString()}
//           </p>
//         </div>
//         <button onClick={handleAddSlot}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Slot
//         </button>
//       </div>

//       {/* Simple list for MVP */}
//       <ul className="space-y-2">
//         {agendaSlots.map((slot) => (
//           <li key={slot.id} className="p-4 bg-white shadow rounded">
//             <div className="font-semibold">{slot.title || "Untitled Slot"}</div>
//             <div className="text-sm text-gray-500">
//               {slot.start} - {slot.end}
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Dialog for creating agenda */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Agenda Slot</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-2">
//             <Label>Title</Label>
//             <Input
//               value={editingSlot?.title || ""}
//               onChange={(e) =>
//                 setEditingSlot((prev) =>
//                   prev ? { ...prev, title: e.target.value } : null
//                 )
//               }
//             />
//             <Label>Start Time</Label>
//             <Input
//               value={editingSlot?.start || ""}
//               onChange={(e) =>
//                 setEditingSlot((prev) =>
//                   prev ? { ...prev, start: e.target.value } : null
//                 )
//               }
//             />
//             <label>End Time</label>
//             <Input
//               value={editingSlot?.end || ""}
//               onChange={(e) =>
//                 setEditingSlot((prev) =>
//                   prev ? { ...prev, end: e.target.value } : null
//                 )
//               }
//             />

//             <button
//               className="w-full bg-purple-600 text-white mt-4"
//               onClick={handleSaveSlot}
//               disabled={isCreating}
//             >
//               {isCreating ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// TODO : Other section
// export default function AgendaSection({ eventData }: AgendaSectionProps) {
//   const [currentTime, setCurrentTime] = useState(() => new Date());
//   const [agendaSlots, setAgendaSlots] = useState<AgendaSlot[]>([]);
//   const [editingSlot, setEditingSlot] = useState<AgendaSlot | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [draggedItem, setDraggedItem] = useState<string | null>(null);
//   const [currentDay, setCurrentDay] = useState(1);

//   // Derived state for days
//   const eventDays = useMemo(() => {
//     const start = new Date(eventData.startDate);
//     const end = new Date(eventData.endDate);
//     const days =
//       Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
//     return days;
//   }, [eventData.startDate, eventData.endDate]);

//   // Update time
//   useEffect(() => {
//     const interval = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Load agenda slots (stub)
//   const loadAgendaSlots = useCallback(async () => {
//     setAgendaSlots([]);
//   }, []);

//   useEffect(() => {
//     loadAgendaSlots();
//   }, [loadAgendaSlots, eventData.id, currentDay]);

//   const handleAddSlot = useCallback(() => {
//     const now = new Date().toISOString();
//     const newSlot: AgendaSlot = {
//       id: Date.now().toString(),
//       eventId: eventData.id,
//       slot: agendaSlots.length + 1,
//       order: agendaSlots.length + 1,
//       start: "",
//       end: "",
//       title: "",
//       place: "",
//       responsiblePeople: "",
//       day: currentDay,
//       createdAt: now,
//       updatedAt: now,
//     };
//     setEditingSlot(newSlot);
//     setIsDialogOpen(true);
//   }, [agendaSlots, eventData.id, currentDay]);

//   const handleEditSlot = useCallback((slot: AgendaSlot) => {
//     setEditingSlot({ ...slot });
//     setIsDialogOpen(true);
//   }, []);

//   const handleSaveSlot = useCallback(() => {
//     if (!editingSlot) return;

//     setAgendaSlots((slots) =>
//       slots.some((s) => s.id === editingSlot.id)
//         ? slots.map((s) => (s.id === editingSlot.id ? editingSlot : s))
//         : [...slots, editingSlot]
//     );
//     setIsDialogOpen(false);
//     setEditingSlot(null);
//   }, [editingSlot]);

//   const handleDeleteSlot = useCallback((id: string) => {
//     setAgendaSlots((slots) =>
//       slots
//         .filter((s) => s.id !== id)
//         .map((slot, index) => ({
//           ...slot,
//           slot: index + 1,
//           order: index + 1,
//           updatedAt: new Date().toISOString(),
//         }))
//     );
//   }, []);

//   const handleDrag = useCallback((e: React.DragEvent, id: string) => {
//     e.dataTransfer.effectAllowed = "move";
//     setDraggedItem(id);
//   }, []);

//   const handleDrop = useCallback(
//     (e: React.DragEvent, targetId: string) => {
//       e.preventDefault();
//       if (!draggedItem || draggedItem === targetId) return;

//       const updated = [...agendaSlots];
//       const draggedIndex = updated.findIndex((s) => s.id === draggedItem);
//       const targetIndex = updated.findIndex((s) => s.id === targetId);

//       const [moved] = updated.splice(draggedIndex, 1);
//       updated.splice(targetIndex, 0, moved);

//       setAgendaSlots(
//         updated.map((slot, idx) => ({
//           ...slot,
//           slot: idx + 1,
//           order: idx + 1,
//           updatedAt: new Date().toISOString(),
//         }))
//       );
//       setDraggedItem(null);
//     },
//     [agendaSlots, draggedItem]
//   );

//   const formatTime = useCallback(
//     (date: Date) =>
//       date.toLocaleTimeString("th-TH", {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       }),
//     []
//   );

//   const sortedSlots = useMemo(
//     () => [...agendaSlots].sort((a, b) => a.order - b.order),
//     [agendaSlots]
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="w-full px-8 py-6 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400">
//         <div className="flex justify-between items-start">
//           <div className="text-white">
//             <h1 className="text-2xl font-bold">{eventData.name}</h1>
//             <p className="text-purple-200">Agenda Management</p>
//             <Button
//               variant="secondary"
//               size="sm"
//               className="mt-4 bg-white text-purple-600 hover:bg-gray-100"
//               onClick={() => window.location.assign(`/${eventData.id}/timer`)}
//             >
//               View Timer
//             </Button>
//           </div>
//           <div className="bg-white text-gray-900 rounded-2xl p-6 min-w-80 shadow">
//             <div className="text-center mb-4">
//               <div className="text-sm text-gray-500 mb-2">เวลาปัจจุบัน</div>
//               <div className="text-4xl font-bold">
//                 {formatTime(currentTime)}
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div className="text-center">
//                 <div className="text-gray-500">กิจกรรมปัจจุบัน</div>
//                 <div>No Slot</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-gray-500">กิจกรรมต่อไป</div>
//                 <div>No Slot</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="px-8 py-6 bg-white border-b">
//         <div className="flex justify-between items-center">
//           <div className="relative w-full max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="Search Event"
//               className="pl-10 bg-gray-50 border-gray-200"
//             />
//           </div>
//           <div className="flex gap-2 ml-4">
//             <Button variant="outline" size="sm">
//               <Calendar className="w-4 h-4 mr-2" />
//               {new Date(eventData.startDate).toLocaleDateString()}
//             </Button>
//             <Button variant="outline" size="sm">
//               <Filter className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Agenda Table */}
//       <div className="px-8 py-8">
//         <div className="bg-white shadow rounded-lg">
//           {/* Day selector */}
//           <div className="flex justify-between items-center px-6 py-4 border-b">
//             <div className="flex items-center gap-3">
//               <h2 className="text-xl font-bold">Day {currentDay}</h2>
//               {eventDays > 1 && (
//                 <div className="flex gap-2">
//                   {Array.from({ length: eventDays }, (_, i) => i + 1).map(
//                     (day) => (
//                       <Button
//                         key={day}
//                         variant={day === currentDay ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setCurrentDay(day)}
//                         className={
//                           day === currentDay ? "bg-purple-600 text-white" : ""
//                         }
//                       >
//                         Day {day}
//                       </Button>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//             <Button
//               onClick={handleAddSlot}
//               className="bg-purple-600 text-white"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Task
//             </Button>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {[
//                     "Slot",
//                     "Start",
//                     "End",
//                     "Title",
//                     "Place",
//                     "Responsible People",
//                     "Actions",
//                   ].map((header) => (
//                     <th
//                       key={header}
//                       className="px-6 py-3 text-left font-semibold text-gray-600"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {sortedSlots.length > 0 ? (
//                   sortedSlots.map((slot) => (
//                     <tr
//                       key={slot.id}
//                       draggable
//                       onDragStart={(e) => handleDrag(e, slot.id)}
//                       onDragOver={(e) => e.preventDefault()}
//                       onDrop={(e) => handleDrop(e, slot.id)}
//                       className="hover:bg-gray-50 border-t cursor-move"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <GripVertical className="w-4 h-4 text-gray-400" />
//                           {slot.slot}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">{slot.start}</td>
//                       <td className="px-6 py-4">{slot.end}</td>
//                       <td className="px-6 py-4">{slot.title}</td>
//                       <td className="px-6 py-4">{slot.place}</td>
//                       <td className="px-6 py-4">{slot.responsiblePeople}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             onClick={() => handleEditSlot(slot)}
//                             className="bg-purple-600 text-white"
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleDeleteSlot(slot.id)}
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="text-center py-10 text-gray-500">
//                       No agenda slots yet. Click “Add Task” to get started.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader className="flex justify-between items-center">
//             <DialogTitle>
//               {editingSlot?.id ? "Edit" : "Add"} Task Schedule
//             </DialogTitle>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsDialogOpen(false)}
//               className="h-6 w-6 p-0"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </DialogHeader>

//           {editingSlot && (
//             <div className="space-y-4">
//               {["start", "end", "title", "place", "responsiblePeople"].map(
//                 (field) => (
//                   <div key={field}>
//                     <Label htmlFor={field} className="text-sm capitalize">
//                       {field}
//                     </Label>
//                     <Input
//                       id={field}
//                       placeholder={field}
//                       value={editingSlot[field as keyof AgendaSlot] as string}
//                       onChange={(e) =>
//                         setEditingSlot({
//                           ...editingSlot,
//                           [field]: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 )
//               )}

//               <Button
//                 className="w-full bg-purple-600 text-white mt-2"
//                 onClick={handleSaveSlot}
//               >
//                 Save Changes
//               </Button>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
