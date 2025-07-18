import { z } from "zod";

export const updateUserDTO = z.object({
	name: z
		.string()
		.min(1, "name is required")
		.max(50, "name cannot exceed 50 characters")
		.optional(),
	email: z.string().email("Invalid email format").optional(),
	avatar_url: z.string().url("Invalid URL format").optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserDTO>;
