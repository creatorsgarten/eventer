import { type Static, Type } from "@sinclair/typebox";

export const queryUserDTO = Type.Object({
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
	name: Type.Optional(Type.String()),
	email: Type.Optional(Type.String()),
	avatar_url: Type.Optional(Type.String({ format: "uri" })),
	sortBy: Type.Optional(Type.String()),
	sortOrder: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
});

export type QueryUserDTO = Static<typeof queryUserDTO>;
