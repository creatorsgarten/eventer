import { type Static, Type } from "@sinclair/typebox";

export const createEventDTO = Type.Object({
	name: Type.String({ minLength: 1, description: "Event name is required" }),
	startDate: Type.String({ format: "date-time", description: "Start date must be in the future" }),
	endDate: Type.String({ format: "date-time" }),
	location: Type.String({ minLength: 1, description: "Location is required" }),
	description: Type.Union([
		Type.String({ maxLength: 500, description: "Description cannot exceed 500 characters" }),
		Type.Null(),
	]),
	createdBy: Type.String({ format: "uuid", description: "Invalid user ID format" }),
});

export type CreateEventDTO = Static<typeof createEventDTO>;
