// import z from "zod";

// export const fileSchema = z.object({
//     originalname: z.string().min(1, 'File name is required'),
//     mimetype: z.string().refine(
//         val => ['image/png', 'image/jpeg', 'application/pdf'].includes(val),
//         { message: 'Only PNG, JPEG, and PDF files are allowed' }
//     ),
//     size: z.number().max(5 * 100 * 1024, 'Maximum file size is 5MB'),
//     buffer: z.instanceof(Buffer),
// });


import { z } from "zod";

export const fileSchema = z.object({
    originalname: z.string().min(1, "File name is required"),

    mimetype: z.string().refine(
        (val) => ["image/png", "image/jpeg", "application/pdf"].includes(val),
        { message: "Only PNG, JPEG, and PDF files are allowed" }
    ),

    size: z.number().max(5 * 1024 * 1024, "Maximum file size is 5MB"),

    // Use .refine(Buffer.isBuffer) instead of z.instanceof(Buffer)
    buffer: z.any().refine((val) => Buffer.isBuffer(val), {
        message: "Invalid file buffer",
    }),
});

