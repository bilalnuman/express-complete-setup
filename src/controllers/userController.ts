import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { profileUpdateSchema } from '../validationSchemas/profileSchema';
import { validateSchema } from '../helpers/validateSchema';
import { uploadFiles } from './fileController';

export class UserController {

    static getProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: 'User not found',
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User profile fetched successfully',
            data: { user: userWithoutPassword },
        });
    });

    static updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const data = validateSchema(profileUpdateSchema, req.body, res);
        const userId = (req as any).userId;
        if (!data) return;

        const { firstName, lastName, email } = data;
        if (data) {
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return sendResponse({
                    res,
                    statusCode: StatusCodes.BAD_REQUEST,
                    success: false,
                    message: 'Validation failed',
                    errors: "Acount with this email or username not exists",
                });
            }
        }

        const updatedUser = await UserModel.update(userId, {
            firstName,
            lastName,
        });

        if (!updatedUser) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: 'User not found',
            });
        }

        const { password: _, ...userWithoutPassword } = updatedUser;

        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Profile updated successfully',
            data: { user: userWithoutPassword },
        });
    });

    static updatePicture = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const fileRes = uploadFiles(req, res)
        if (fileRes?.statusCode === 409) {
            sendResponse({
                res,
                statusCode: StatusCodes.CONFLICT, success: false,
                message: "This picture already exists",
            });
        }

        const updatedUser = await UserModel.update(userId, {
            profilePicture: fileRes?.files?.fileName,
        });

        if (!updatedUser) {
            return sendResponse({
                res,
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: 'User not found',
            });
        }


        return sendResponse({
            res,
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Profile picture updated successfully',
        });
    })
}
