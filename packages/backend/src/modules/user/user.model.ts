import { users } from "#backend/infrastructure/db/schema";

export { users };
export type UserType = typeof users.$inferSelect;
