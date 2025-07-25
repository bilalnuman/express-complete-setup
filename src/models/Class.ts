import { eq } from 'drizzle-orm';
import { db } from '../db';
import { classes, Classes, NewClasses, students } from '../db/schema';

export class ClassModel {

  static async create(userData: NewClasses): Promise<Classes> {

    const [newData] = await db.insert(classes).values({
      ...userData
    }).returning();

    return newData;
  }

  static async getAll(): Promise<Classes[]> {
    const result = await db.select().from(classes);
    return result;
  }

  static async findById(id: number): Promise<Classes | null> {
    const result = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
    return result[0] || null;
  }

  static async update(id: number, updateData: Partial<NewClasses>): Promise<Classes | null> {

    const [updated] = await db.update(classes)
      .set({ ...updateData })
      .where(eq(students.id, id))
      .returning();

    return updated || null;
  }

  static async delete(id: number): Promise<boolean> {
    const deletedCount = await db.delete(classes).where(eq(classes.id, id));
    return Number(deletedCount.rowCount) > 0 ? true : false;
  }
}
