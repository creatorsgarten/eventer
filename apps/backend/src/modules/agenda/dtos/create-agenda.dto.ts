import { type Static, Type } from "@sinclair/typebox";

export const createAgendaDTO = Type.Object({
	id: Type.String({ format: "uuid", description: "Invalid agenda ID format" }),
	eventId: Type.String({ format: "uuid", description: "Invalid event ID" }),
	start: Type.String({ format: "date-time", description: "Start time in ISO format" }),
	end: Type.String({ format: "date-time", description: "End time in ISO format" }),
	personincharge: Type.String({ format: "uuid", description: "Invalid user ID format" }),
	duration: Type.Integer({ minimum: 1, description: "Duration must be at least 1 minute" }),
	activity: Type.String({ minLength: 1, description: "Activity is required" }),
	remarks: Type.Union([
		Type.String({ maxLength: 500, description: "Remark cannot exceed 500 characters" }),
		Type.Null(),
	]),
});

export type CreateAgendaDTO = Static<typeof createAgendaDTO>;
