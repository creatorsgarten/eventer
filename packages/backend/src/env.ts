import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default("file:./db.sqlite"),
});

export const env = envSchema.parse(process.env);
