import { z } from "zod";

export const updateAgendaDTO = z.object({
	id: z.string().uuid("Invalid agenda ID"), // Required to know which agenda to update
	startTime: z.date().optional(),
	endTime: z.date().optional(),
	activity: z.string().min(1, "Activity is required").optional(),
	remark: z.string().max(500, "Remark too long").nullable().optional(),
	picUserId: z.string().uuid("Invalid user ID").optional(),
	location: z.string().optional(),
});

export type UpdateAgendaDTO = z.infer<typeof updateAgendaDTO>;
