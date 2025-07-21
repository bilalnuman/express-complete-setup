import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    username: z.string()
        .min(3, "Username too short")
        .max(20, "Username too long")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^a-zA-Z\d]/, "Password must contain at least one special character"),
    firstName: z
        .string()
        .min(3, "FirstName too short")
        .max(20, "FirstName too long")
        .regex(/^[a-zA-Z0-9_ ]+$/, "FirstName can only contain letters, numbers, underscores, and spaces")
        .optional(),

    lastName: z
        .string()
        .min(3, "LastName too short")
        .max(20, "LastName too long")
        .regex(/^[a-zA-Z0-9_ ]+$/, "LastName can only contain letters, numbers, underscores, and spaces")
        .optional(),
});

export const loginSchema = z.object({
    emailOrUsername: z.string().nonempty("Email or Username is required."),
    password: z.string().nonempty("Password is required."),
});

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters long.")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/\d/, "Password must contain at least one number")
            .regex(/[^a-zA-Z\d]/, "Password must contain at least one special character"),

        currentPassword: z
            .string()
            .min(1, "Current Password is required"),
    })
    .refine(data => data.newPassword !== data.currentPassword, {
        path: ['newPassword'],
        message: "New password must be different from the current password.",
    });


