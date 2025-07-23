import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable("role_permissions", {
    id: serial("id").primaryKey(),
    roleId: integer("role_id").references(() => roles.id),
    permissionId: integer("permission_id").references(() => permissions.id),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;