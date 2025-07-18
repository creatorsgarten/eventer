import { type Static, Type } from "@sinclair/typebox";

export const queryAgendaDTO = Type.Object({
	page: Type.Integer({
		minimum: 1,
		description: "Page number must be a positive integer",
		default: 1,
	}),
	limit: Type.Integer({
		minimum: 1,
		maximum: 100,
		description: "Limit must be a positive integer and cannot exceed 100",
		default: 10,
	}),
	sortBy: Type.Optional(Type.String({ description: "e.g., startTime" })),
	sortOrder: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
	eventId: Type.Optional(Type.String({ format: "uuid", description: "Invalid event ID" })),
	picUserId: Type.Optional(Type.String({ format: "uuid", description: "Invalid PIC user ID" })),
});

export type QueryAgendaDTO = Static<typeof queryAgendaDTO>;
