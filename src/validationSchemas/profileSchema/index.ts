import z from "zod";

export const profileUpdateSchema = z
    .object({
        email: z
            .string()
            .email("Invalid email address")
            .optional().default(""),

        username: z
            .string()
            .min(3, "Username too short")
            .max(20, "Username too long")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .optional().default(""),
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
    })
    .refine(data => data.username || data.email, {
        message: "Either username or email is required",
        path: ['username'],
    });