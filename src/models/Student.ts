import { eq } from 'drizzle-orm';
import { db } from '../db';
import { NewStudent, Student, students } from '../db/schema';

export class StudentModel {

  static async create(userData: NewStudent): Promise<Student> {

    const [NewStudent] = await db.insert(students).values({
      ...userData
    }).returning();

    return NewStudent;
  }

  static async getAll(): Promise<Student[]> {
    const result = await db.select().from(students);
    return result;
  }

  static async findById(id: number): Promise<Student | null> {
    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
    return result[0] || null;
  }

  static async update(id: number, updateData: Partial<NewStudent>): Promise<Student | null> {

    const [updatedUser] = await db.update(students)
      .set({ ...updateData })
      .where(eq(students.id, id))
      .returning();

    return updatedUser || null;
  }

  static async delete(id: number): Promise<boolean> {
    const deletedCount = await db.delete(students).where(eq(students.id, id));
    return Number(deletedCount.rowCount) > 0 ? true : false;
  }
}
