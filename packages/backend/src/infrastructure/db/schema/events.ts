import { pgTable as table } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const events = table("events", {
  id: t.text("id").primaryKey(),
  name: t.text("name").notNull(),
  startDate: t.timestamp("start_date").notNull(),
  endDate: t.timestamp("end_date").notNull(),
  location: t.text("location").notNull(),
  description: t.text("description"),
  createdBy: t.text("created_by").notNull(),
});
