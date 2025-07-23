import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { validateSchema } from '../helpers/validateSchema'
import { forgotPasswordSchema } from '../validationSchemas/forgotPasswordSchema';
import { resetPasswordSchema } from '../validationSchemas/authSchema';


export class PasswordController {

    static takeEmail = asyncHandler(async (req: Request, res: Response) => {
        const data = validateSchema(forgotPasswordSchema, req.body, res);
        if (!data) return;

        const existingUser = await UserModel.findByEmail(data.email);
        if (!existingUser) {
            return sendBadResponse(res, {}, "Account with this email or username does not exist");
        }

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Reset email sent",
        });
    });


    static changePassword = asyncHandler(async (req: Request, res: Response) => {
        const data = validateSchema(resetPasswordSchema, req.body, res);
        if (!data) return;

        const userId = (req as any).userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return sendBadResponse(res, {}, "User not found", StatusCodes.NOT_FOUND);
        }

        const isCurrentPasswordValid = await UserModel.verifyPassword(data.currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return sendBadResponse(res, {}, "Current password is incorrect");
        }

        await UserModel.update(userId, { password: data.newPassword });

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password changed successfully",
        });
    });


    static resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const data = validateSchema(resetPasswordSchema, req.body, res);
        if (!data) return;

        const userId = (req as any).userId;
        const user = await UserModel.findById(userId);
        if (!user) {
            return sendBadResponse(res, {}, "User not found", StatusCodes.NOT_FOUND);
        }

        await UserModel.update(userId, { password: data.newPassword });

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: "Password reset successfully",
        });
    });
}
