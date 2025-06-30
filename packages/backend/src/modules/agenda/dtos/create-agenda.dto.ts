import { z } from "zod";


export const createAgendaDTO = z.object({
  id: z.string().uuid("Invalid agenda ID format"),
  eventId: z.string().uuid("Invalid event ID"),
  start: z.date().transform(date => date.toISOString()), // Can remove ISO
  end: z.date().transform(date => date.toISOString()), // Can remove ISO
  personincharge: z.string().uuid("Invalid user ID format"),
  duration: z.number().int().min(1, "Duration must be at least 1 minute"),
  activity: z.string().min(1, "Activity is required"),
  remarks: z.string().max(500, "Remark cannot exceed 500 characters").nullable(),
}).refine((data) => data.start< data.end,{
  message: "End time must be after start time",
  path: ["endTime"],
});

export type CreateAgendaDTO = z.infer<typeof createAgendaDTO>;
