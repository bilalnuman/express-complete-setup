import { z } from 'zod';
import { sendBadResponse } from './sendBadResponse';
import { Response } from 'express';
export function validateSchema<T>(
    schema: z.ZodSchema<T>,
    data: unknown,
    res: Response
): T | undefined {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        sendBadResponse(res, parsed.error.flatten().fieldErrors);
        return;
    }
    return parsed.data;
}