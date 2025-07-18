import { type Static, Type } from "@sinclair/typebox";

export const updateUserDTO = Type.Object({
	name: Type.Optional(
		Type.String({
			minLength: 1,
			maxLength: 50,
			description: "name is required and cannot exceed 50 characters",
		})
	),
	email: Type.Optional(Type.String({ format: "email", description: "Invalid email format" })),
	avatar_url: Type.Optional(Type.String({ format: "uri", description: "Invalid URL format" })),
});

export type UpdateUserDTO = Static<typeof updateUserDTO>;
