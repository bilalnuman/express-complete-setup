import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role_enum", ["admin", "teacher", "parent", "student"]);
export const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    role: roleEnum("role").notNull().unique(),
    description: text("description"),
})

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert