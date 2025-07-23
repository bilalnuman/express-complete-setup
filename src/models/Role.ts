import { eq } from "drizzle-orm";
import db from "../db";
import { NewRole, Role, roles } from "../db/schema";

export class RoleModel {

    static async getAll(): Promise<Role[]> {
        const allRoles = await db.select().from(roles)
        return allRoles;
    }
    static async create(roleData: Omit<NewRole, "id" | "createdAt" | "updatedAt">): Promise<Role> {
        const [newRole] = await db.insert(roles).values({
            ...roleData,
        }).returning()
        return newRole
    }

    static async getOne(id: number): Promise<Role | null> {
        const role = await db.select().from(roles).where(eq(roles.id, id))
        if (!role.length) {
            return null;
        }
        return role[0];
    }

    static async update(id: number, data: Partial<Omit<NewRole, "id" | "createdAt" | "updatedAt">>): Promise<Role | null> {
        const updatedRole = await db.update(roles).set(data).where(eq(roles.id, id)).returning();
        if (updatedRole.length === 0) {
            return null;
        }
        return updatedRole[0];
    }

    static async delete(id: number): Promise<boolean> {
        const deletedCount = await db.delete(roles).where(eq(roles.id, id));
        return Number(deletedCount.rowCount) > 0 ? true : false;
    }
}