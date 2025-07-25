import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { classes } from "./classes";

export const sections = pgTable("sections", {
    id: serial('id').primaryKey(),
    classId: integer('class_id').references(() => classes.id),
    name: text('name').notNull(),
    description: text('description'),
})

export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert