import { eq } from 'drizzle-orm';
import { db } from '../db';

import { JwtService } from '../services/JwtService';
import { users } from '../db/migrations/users';
import { NewUser, User } from '../db/schema';

export class UserModel {
  
  static async hashPassword(password: string): Promise<string> {
    return await JwtService.hashPassword(password);
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await JwtService.verifyPassword(plainPassword, hashedPassword);
  }

  
  static generateAccessToken(userId: number): string {
    return JwtService.generateAccessToken(userId);
  }

  static generateRefreshToken(userId: number): string {
    return JwtService.generateRefreshToken(userId);
  }

  static verifyToken(token: string): { userId: number } | null {
    return JwtService.verifyToken(token);
  }

  static verifyRefreshToken(token: string): { userId: number } | null {
    return JwtService.verifyRefreshToken(token);
  }

  // ✅ Authenticate (Login)
  static async authenticate(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid || !user.isActive) return null;

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: { ...userWithoutPassword, role: 'admin' },
      accessToken,
      refreshToken,
    };
  }

  // ✅ Create new user
  static async create(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);

    const [newUser] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
    }).returning();

    return newUser;
  }

  // 🔍 Finders
  static async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  // 🔄 Update user
  static async update(id: number, updateData: Partial<NewUser>): Promise<User | null> {
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    const [updatedUser] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }

  // ❌ Delete user (not implemented yet)
  static async delete(id: number): Promise<boolean> {
    return false;
  }

  // ✅ Toggle Active Status
  static async toggleActive(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const [updatedUser] = await db.update(users)
      .set({ isActive: !user.isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }
}
