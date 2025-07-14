import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

export const events = table("events", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	startDate: t.integer("start_date", { mode: "timestamp" }).notNull(),
	endDate: t.integer("end_date", { mode: "timestamp" }).notNull(),
	location: t.text("location").notNull(),
	description: t.text("description"),
	createdBy: t.text("created_by").notNull(),
});
