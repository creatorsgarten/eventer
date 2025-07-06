import { z } from "zod";

export const createUserDTO = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username cannot exceed 50 characters"),
  email: z.string().email("Invalid email format"),
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;
