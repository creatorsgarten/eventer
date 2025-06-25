import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const users = table("users", {
  id: t.text("id").primaryKey(),
  username: t.text("username").notNull().unique(),
  email: t.text("email").notNull().unique(),
  createdAt: t.integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: t.integer("updated_at", { mode: "timestamp" }).notNull(),
});
