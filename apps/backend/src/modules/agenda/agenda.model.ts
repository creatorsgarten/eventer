import { agenda } from "#backend/infrastructure/db/schema";

export { agenda };
export type AgendaType = typeof agenda.$inferSelect;
export type AgendaInsertType = typeof agenda.$inferInsert;
