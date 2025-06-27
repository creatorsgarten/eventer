import { z } from "zod";

export const updateAgendaDTO = z.object({
  name: z.string().min(1, "Agenda slot is required"),
  startDate: z.date().refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.date(),
  location: z.string().min(1, "Location is required"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable(),
  createdBy: z.string().uuid("Invalid user ID format"),
});

export type UpdateAgendaDTO = z.infer<typeof updateAgendaDTO>;
