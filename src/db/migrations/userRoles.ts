import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { roles } from "./roles";

export const userRoles = pgTable("user_roles", {
    userId: integer("user_id").notNull().references(() => users.id).notNull(),
    roleId: integer("role_id").notNull().references(() => roles.id).notNull(),
}, (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    // Or PK with custom name
    // primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] }),
]);


export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;