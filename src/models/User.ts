import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { db } from '../db';
import { users, User, NewUser } from '../db/schema';
import { JwtService } from '../services/JwtService';

export class UserModel {
  // 🔐 Password Hashing
  static async hashPassword(password: string): Promise<string> {
    return await JwtService.hashPassword(password)
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await JwtService.verifyPassword(plainPassword, hashedPassword)
  }

  // ✅ Generate Access Token (Short-lived)
  static generateAccessToken(userId: number): string {
    return JwtService.generateAccessToken(userId)
  }

  // ✅ Generate Refresh Token (Long-lived)
  static generateRefreshToken(userId: number): string {
    return JwtService.generateRefreshToken(userId)
  }

  // ✅ Verify Access Token
  static verifyToken(token: string): { userId: number } | null {
    return JwtService.verifyToken(token)
  }

  // ✅ Verify Refresh Token
  static verifyRefreshToken(token: string): { userId: number } | null {
    return JwtService.verifyRefreshToken(token)
  }

  // ✅ Authenticate (Login)
  static async authenticate(emailOrUsername: string, password: string) {
    const user = await this.findByEmailOrUsername(emailOrUsername);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid || !user.isActive) return null;

    await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, user.id));

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {...userWithoutPassword,role:"admin"},
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

  static async findByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || null;
  }

  static async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const result = await db.select().from(users).where(
      or(
        eq(users.email, emailOrUsername),
        eq(users.username, emailOrUsername)
      )
    ).limit(1);
    return result[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  // 🔄 Update user
  static async update(id: number, updateData: Partial<Omit<NewUser, 'id'>>): Promise<User | null> {
    if (updateData.password) {
      updateData.password = await this.hashPassword(updateData.password);
    }

    const [updatedUser] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }

  // ❌ Delete user (if needed later)
  static async delete(id: number): Promise<boolean> {
    // Not implemented fully
    return false;
  }

  // ✅ Toggle active status
  static async toggleActive(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const [updatedUser] = await db.update(users)
      .set({ isActive: !user.isActive, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  // ✅ Verify Email
  static async verifyEmail(id: number): Promise<User | null> {
    const [updatedUser] = await db.update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  }
}
