import { desc } from "drizzle-orm";
import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
    id: serial('id').primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text('description'),
})


export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;