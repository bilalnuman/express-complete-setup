import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable("role_permissions", {
    id: serial("id").primaryKey(),
    roleId: integer("role_id").references(() => roles.id).notNull(),
    permissionId: integer("permission_id").references(() => permissions.id).notNull(),
});

// recmanded

// export const rolePermissions = pgTable("role_permissions", {
//   roleId: integer("role_id").notNull().references(() => roles.id),
//   permissionId: integer("permission_id").notNull().references(() => permissions.id),
// }, (table) => [
//   primaryKey({ columns: [table.roleId, table.permissionId] }),
// ]);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;