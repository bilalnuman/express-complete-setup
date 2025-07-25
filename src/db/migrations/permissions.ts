// db/schema/permissions.ts
import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const nameEnum = pgEnum('name', ['create', 'read', 'update', 'delete']);

export const permissions = pgTable("permissions", {
    id: serial("id").primaryKey(),
    name: nameEnum("name"),
    description: text("description"),
});



export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;