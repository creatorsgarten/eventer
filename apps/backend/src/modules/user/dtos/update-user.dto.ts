import { z } from "zod";

export const updateUserDTO = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username cannot exceed 50 characters")
    .optional(),
  email: z.string().email("Invalid email format").optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserDTO>;
