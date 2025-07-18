import { z } from "zod";

export const queryUserDTO = z.object({
	page: z.number().int().min(1, "Page number must be a positive integer").default(1),
	limit: z
		.number()
		.int()
		.min(1, "Limit must be a positive integer")
		.max(100, "Limit cannot exceed 100")
		.default(10),
	name: z.string().optional(),
	email: z.string().optional(),
	avatar_url: z.string().url().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type QueryUserDTO = z.infer<typeof queryUserDTO>;
