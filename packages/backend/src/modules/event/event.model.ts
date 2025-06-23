import { events } from "~/infrastructure/db/schema";

export { events };
export type EventType = typeof events.$inferSelect;
