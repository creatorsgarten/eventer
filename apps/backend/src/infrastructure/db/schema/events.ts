import { pgTable as table, text, timestamp } from "drizzle-orm/pg-core";

export const events = table("events", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	location: text("location").notNull(),
	description: text("description"),
	createdBy: text("created_by").notNull(),
});
