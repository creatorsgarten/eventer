import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const schedules = table("agenda", {
  id: t.text("id").primaryKey(), // UUID
  eventId: t.text("event_id").notNull(), // FK to event
  start: t.text("start").notNull(), // e.g., "09:00"
  end: t.text("end").notNull(),     // e.g., "10:30"
  personincharge: t.text("person_in_charge").notNull(), // e.g., "John Doe"
  duration: t.integer("duration").notNull(), // in minutes
  activity: t.text("activity").notNull(),    // e.g., "Keynote"
  remarks: t.text("remarks").default(""),  
});
