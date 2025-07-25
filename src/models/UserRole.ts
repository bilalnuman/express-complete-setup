import { eq } from "drizzle-orm";
import db from "../db";
import { UserRole, NewUserRole, userRoles, roles, permissions, rolePermissions } from "../db/schema";

export class UserRoleModel {


    static async create(roleData: Omit<NewUserRole, "id" | "createdAt" | "updatedAt">): Promise<UserRole> {
        const [newRole] = await db.insert(userRoles).values({
            ...roleData,
        }).returning()
        return newRole
    }

    static async getUserRolesAndPermissions(userId: number) {
        const result = await db
            .select({
                userId: userRoles.userId,
                roleId: roles.id,
                roleName: roles.role,
                permissionName: permissions.name,
            })
            .from(userRoles)
            .innerJoin(roles, eq(userRoles.roleId, roles.id))
            .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
            .where(eq(userRoles.userId, userId));


        const permission: string[] = [];
        const role: string[] = [];

        result.forEach(item => {
            if (item.permissionName) {
                permission.push(item.permissionName);
            }
            if (item.roleName) {
                role.push(item.roleName);
            }
        });
        return { rolePermissions: result, permissions: permission, roles: role };
    }
    static async update(id: number, data: Partial<Omit<NewUserRole, "id" | "createdAt" | "updatedAt">>): Promise<UserRole | null> {
        const updatedRole = await db.update(userRoles).set(data).where(eq(userRoles.userId, id)).returning();
        if (updatedRole.length === 0) {
            return null;
        }
        return updatedRole[0];
    }

    static async delete(id: number): Promise<boolean> {
        const deletedCount = await db.delete(userRoles).where(eq(userRoles.userId, id));
        return Number(deletedCount.rowCount) > 0 ? true : false;
    }
}