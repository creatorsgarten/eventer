import { integer, pgTable as table, text } from "drizzle-orm/pg-core";

export const agenda = table("agenda", {
	id: text("id").primaryKey(), // UUID
	eventId: text("event_id").notNull(), // FK to event
	start: text("start").notNull(), // e.g., "09:00"
	end: text("end").notNull(), // e.g., "10:30"
	personincharge: text("person_in_charge").notNull(), // e.g., "John Doe"
	duration: integer("duration").notNull(), // in minutes
	activity: text("activity").notNull(), // e.g., "Keynote"
	remarks: text("remarks").default(""),
	actualEndTime: text("actual_end_time"), // Actual end time as ISO string when session is ended
});
