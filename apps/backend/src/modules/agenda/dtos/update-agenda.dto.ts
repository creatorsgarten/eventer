import { type Static, Type } from "@sinclair/typebox";

export const updateAgendaDTO = Type.Object({
	id: Type.String({ format: "uuid", description: "Invalid agenda ID" }), // Required to know which agenda to update
	startTime: Type.Optional(Type.String({ format: "date-time" })),
	endTime: Type.Optional(Type.String({ format: "date-time" })),
	activity: Type.Optional(Type.String({ minLength: 1, description: "Activity is required" })),
	remark: Type.Optional(
		Type.Union([Type.String({ maxLength: 500, description: "Remark too long" }), Type.Null()])
	),
	picUserId: Type.Optional(Type.String({ format: "uuid", description: "Invalid user ID" })),
	location: Type.Optional(Type.String()),
});

export type UpdateAgendaDTO = Static<typeof updateAgendaDTO>;
