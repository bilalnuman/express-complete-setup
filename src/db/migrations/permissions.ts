// db/schema/permissions.ts
import { integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { roles } from "./roles";

export const nameEnum = pgEnum('name', ['create', 'read', 'update', 'delete']);

export const permissions = pgTable("permissions", {
    id: serial("id").primaryKey(),
    name: nameEnum("name"),
    role_id: integer("role_id").references(() => roles.id),
    description: text("description"),
});



export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;