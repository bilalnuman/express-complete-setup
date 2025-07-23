import { eq } from "drizzle-orm";
import db from "../db";
import { NewRolePermission, RolePermission, rolePermissions } from "../db/schema";

export class RolePermissionModel {


    static async create(payload: Omit<NewRolePermission, "id" | "createdAt" | "updatedAt">): Promise<RolePermission> {
        const [newRolePer] = await db.insert(rolePermissions).values({
            ...payload,
        }).returning()
        return newRolePer
    }


    static async update(id: number, data: Partial<Omit<NewRolePermission, "id" | "createdAt" | "updatedAt">>): Promise<RolePermission | null> {
        const updatedRolePer = await db.update(rolePermissions).set(data).where(eq(rolePermissions.id, id)).returning();
        if (updatedRolePer.length === 0) {
            return null;
        }
        return updatedRolePer[0];
    }

    static async delete(id: number): Promise<boolean> {
        const deletedCount = await db.delete(rolePermissions).where(eq(rolePermissions.id, id));
        return Number(deletedCount.rowCount) > 0 ? true : false;
    }
}