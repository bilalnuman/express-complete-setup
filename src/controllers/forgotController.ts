import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const forgotEmailSchema = z.object({
    email: z.string().email("Invalid Email"),
})
export class ForgotController {

    static sendBadResponse(res: Response, errors?: any, message: string = "Validation failed") {
        return sendResponse({
            res,
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message,
            errors
        });
    }

    static takeEmail = asyncHandler(async (req: Request, res: Response) => {

        const parsed = forgotEmailSchema.safeParse(req.body);
        if (!parsed.success) {
            return this.sendBadResponse(res, parsed.error.flatten().fieldErrors)
        }

        const { email } = parsed.data;
        const existingUser = await UserModel.findByEmailOrUsername(email);
        if (!existingUser) {
            return this.sendBadResponse(res, {}, "Acount with this email or username not exists")
        }

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Email sent",
        });
    });

}
