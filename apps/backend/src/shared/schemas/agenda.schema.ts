import { z } from "zod";

export const AgendaSchema = z.object({
	id: z.string(),
	eventId: z.string(),
	day: z.number(),
	start: z.string(), // Now accepts time format HH:MM
	end: z.string(), // Now accepts time format HH:MM
	activity: z.string(),
	personincharge: z.string(),
	duration: z.number(),
	remarks: z.string().optional(),
});

export const CreateAgendaSchema = z.object({
	eventId: z.string(),
	day: z.number(),
	start: z.string(), // Now accepts time format HH:MM
	end: z.string(), // Now accepts time format HH:MM
	activity: z.string(),
	personincharge: z.string(),
	duration: z.number(),
	remarks: z.string().optional(),
});

export const AgendaListResponseSchema = z.object({
	data: z.array(AgendaSchema),
	pagination: z.object({
		page: z.number(),
		limit: z.number(),
		total: z.number(),
	}),
});

export const ErrorResponseSchema = z.object({
	message: z.string(),
	code: z.string(),
});
