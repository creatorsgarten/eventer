import { z } from "zod";

export const queryEventDTO = z.object({
	page: z.number().int().min(1, "Page number must be a positive integer").default(1),
	limit: z
		.number()
		.int()
		.min(1, "Limit must be a positive integer")
		.max(100, "Limit cannot exceed 100")
		.default(10),
	sortBy: z.string().optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type QueryEventDTO = z.infer<typeof queryEventDTO>;
