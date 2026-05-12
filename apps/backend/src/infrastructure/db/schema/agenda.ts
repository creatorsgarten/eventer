import { integer, pgTable as table, text } from "drizzle-orm/pg-core";
import { events } from "./events";

export const agenda = table("agenda", {
	id: text("id").primaryKey(),
	eventId: text("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	start: text("start").notNull(),
	end: text("end").notNull(),
	personincharge: text("person_in_charge").notNull(),
	duration: integer("duration").notNull(),
	activity: text("activity").notNull(),
	remarks: text("remarks").default(""),
	actualEndTime: text("actual_end_time"),
});
