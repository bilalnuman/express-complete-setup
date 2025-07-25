import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const classes = pgTable("classes", {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    level: text('level'),
})

export type Classes = typeof classes.$inferSelect;
export type NewClasses = typeof classes.$inferInsert