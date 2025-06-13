import  {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

// id name date location

export const events = sqliteTable('events', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    date: integer('date').notNull(), // Store as timestamp
    location: text('location').notNull(),
    });

