import { t } from "elysia";

// User schemas
export const UserSchema = t.Object({
	id: t.String(),
	name: t.String(),
	email: t.String({ format: "email" }),
	createdAt: t.Date(),
	updatedAt: t.Date(),
	avatarUrl: t.Optional(t.String({ format: "uri" })),
});

export const CreateUserSchema = t.Object({
	id: t.Optional(t.String()),
	name: t.String(),
	email: t.String({ format: "email" }),
});

export const UpdateUserSchema = t.Object({
	name: t.String(),
	email: t.String({ format: "email" }),
});

// Event schemas
export const EventSchema = t.Object({
	id: t.String(),
	name: t.String(),
	startDate: t.Date(),
	endDate: t.Date(),
	location: t.String(),
	description: t.Nullable(t.String()),
	createdBy: t.String(),
});

export const CreateEventSchema = t.Object({
	name: t.String(),
	startDate: t.String({ format: "date-time" }),
	endDate: t.String({ format: "date-time" }),
	location: t.String(),
	description: t.Optional(t.Nullable(t.String())),
});

// Agenda schemas
export const AgendaSchema = t.Object({
	id: t.String(),
	eventId: t.String(),
	start: t.String(),
	end: t.String(),
	personincharge: t.String(),
	duration: t.Number(),
	activity: t.String(),
	remarks: t.Nullable(t.String()),
	actualEndTime: t.Optional(t.Nullable(t.String())),
});

export const CreateAgendaSchema = t.Object({
	eventId: t.String(),
	start: t.String(),
	end: t.String(),
	personincharge: t.String(),
	duration: t.Number(),
	activity: t.String(),
	remarks: t.Optional(t.Nullable(t.String())),
});

export const UpdateAgendaSchema = t.Object({
	id: t.String(),
	eventId: t.Optional(t.String()),
	startTime: t.Optional(t.String()),
	endTime: t.Optional(t.String()),
	activity: t.Optional(t.String()),
	remark: t.Optional(t.Nullable(t.String())),
	picUserId: t.Optional(t.String()),
	location: t.Optional(t.String()),
	actualEndTime: t.Optional(t.Nullable(t.String())),
});

export const DeleteAgendaSchema = t.Object({
	id: t.String(),
});

// Auth schemas
export const AuthUserSchema = t.Object({
	id: t.String(),
	email: t.String({ format: "email" }),
	name: t.String(),
	avatar_url: t.Optional(t.String({ format: "uri" })),
});

export const AuthCallbackSchema = t.Object({
	access_token: t.String(),
	refresh_token: t.String(),
});

// Query schemas
export const PaginationQuerySchema = t.Object({
	page: t.Optional(t.String()),
	limit: t.Optional(t.String()),
	sortBy: t.Optional(t.String()),
	sortOrder: t.Optional(t.Enum({ asc: "asc", desc: "desc" })),
});

// Response schemas
export const PaginationMetaSchema = t.Object({
	page: t.Number(),
	limit: t.Number(),
	total: t.Number(),
});

export const EventListResponseSchema = t.Object({
	data: t.Array(EventSchema),
	pagination: PaginationMetaSchema,
});

export const AgendaListResponseSchema = t.Object({
	data: t.Array(AgendaSchema),
	pagination: PaginationMetaSchema,
});

export const SuccessResponseSchema = t.Object({
	success: t.Boolean(),
	message: t.String(),
});

export const ErrorResponseSchema = t.Object({
	error: t.String(),
});

export const AuthSuccessResponseSchema = t.Object({
	success: t.Boolean(),
	message: t.String(),
	user: AuthUserSchema,
});

// Optional response schemas for nullable results
export const UserResponseSchema = t.Union([UserSchema, t.Null()]);

export const UserWithErrorResponseSchema = {
	200: UserSchema,
	404: ErrorResponseSchema,
};

export const NotFoundResponseSchema = t.Object({
	error: t.Literal("Not found"),
});

export const AuthResponseSchema = t.Object({
	user: t.Union([AuthUserSchema, t.Null()]),
});
