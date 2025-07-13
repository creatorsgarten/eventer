import { z } from "zod";

export const queryAgendaDTO = z.object({
	page: z.number().int().min(1, "Page number must be a positive integer").default(1),
	limit: z
		.number()
		.int()
		.min(1, "Limit must be a positive integer")
		.max(100, "Limit cannot exceed 100")
		.default(10),
	sortBy: z.string().optional(), // e.g., "startTime"
	sortOrder: z.enum(["asc", "desc"]).optional(),
	eventId: z.string().uuid("Invalid event ID").optional(),
	picUserId: z.string().uuid("Invalid PIC user ID").optional(),
});

export type QueryAgendaDTO = z.infer<typeof queryAgendaDTO>;
