import { events } from "#backend/infrastructure/db/schema";

export { events };
export type EventType = typeof events.$inferSelect;
