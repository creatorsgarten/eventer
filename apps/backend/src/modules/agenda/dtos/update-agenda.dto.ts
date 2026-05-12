import { type Static, Type } from "@sinclair/typebox";

export const updateAgendaDTO = Type.Object({
	id: Type.String({ format: "uuid", description: "Invalid agenda ID" }),
	start: Type.Optional(Type.String()),
	end: Type.Optional(Type.String()),
	activity: Type.Optional(Type.String({ minLength: 1, description: "Activity is required" })),
	remarks: Type.Optional(
		Type.Union([Type.String({ maxLength: 500, description: "Remark too long" }), Type.Null()])
	),
	personincharge: Type.Optional(Type.String()),
	actualEndTime: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export type UpdateAgendaDTO = Static<typeof updateAgendaDTO>;

export const endSessionDTO = Type.Object({
	id: Type.String({ format: "uuid", description: "Invalid agenda ID" }),
	actualEndTime: Type.String({
		format: "date-time",
		description: "Invalid end time format",
	}),
});

export type EndSessionDTO = Static<typeof endSessionDTO>;
