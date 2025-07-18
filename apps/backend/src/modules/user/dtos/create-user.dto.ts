import { z } from "zod";

export const createUserDTO = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "name is required").max(50, "name cannot exceed 50 characters"),
	email: z.string().email("Invalid email format"),
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;
