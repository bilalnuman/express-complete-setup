import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export class JwtService {
    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // ✅ Generate Access Token (Short-lived)
    static generateAccessToken(userId: number): string {
        const secret = process.env.JWT_SECRET!;
        const expiresIn: any = process.env.JWT_EXPIRES_IN || '15m';
        return jwt.sign({ userId }, secret, { expiresIn });
    }

    // ✅ Generate Refresh Token (Long-lived)
    static generateRefreshToken(userId: number): string {
        const secret = process.env.REFRESH_TOKEN_SECRET!;
        const expiresIn: any = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
        return jwt.sign({ userId }, secret, { expiresIn });
    }

    // ✅ Verify Access Token
    static verifyToken(token: string): { userId: number } | null {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        } catch {
            return null;
        }
    }

    // ✅ Verify Refresh Token
    static verifyRefreshToken(token: string): { userId: number } | null {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: number };
        } catch {
            return null;
        }
    }
}