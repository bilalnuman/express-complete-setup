import { eq } from "drizzle-orm";
import db from "../db";
import { NewPermission, Permission, permissions } from "../db/schema";

export class PermissionModel {

    static async getAll(): Promise<Permission[]> {
        const allRoles = await db.select().from(permissions)
        return allRoles;
    }
    static async create(roleData: Omit<NewPermission, "id" | "createdAt" | "updatedAt">): Promise<Permission> {
        const [newRole] = await db.insert(permissions).values({
            ...roleData,
        }).returning()
        return newRole
    }

    static async getOne(id: number): Promise<Permission | null> {
        const role = await db.select().from(permissions).where(eq(permissions.id, id))
        if (!role.length) {
            return null;
        }
        return role[0];
    }

    static async update(id: number, data: Partial<Omit<NewPermission, "id" | "createdAt" | "updatedAt">>): Promise<Permission | null> {
        const updatedRole = await db.update(permissions).set(data).where(eq(permissions.id, id)).returning();
        if (updatedRole.length === 0) {
            return null;
        }
        return updatedRole[0];
    }

    static async delete(id: number): Promise<boolean> {
        const deletedCount = await db.delete(permissions).where(eq(permissions.id, id));
        return Number(deletedCount.rowCount) > 0 ? true : false;
    }
}