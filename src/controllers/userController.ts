import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { profileUpdateSchema } from '../validationSchemas/profileSchema';
import { validateSchema } from '../helpers/validateSchema';
import { fileSchema } from '../validationSchemas/fileSchema';

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

        const { firstName, lastName, email, username } = data;
        if (data) {
            const existingUser = await UserModel.findByEmailOrUsername(email || username);
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

    static setUploadFolder = (req: Request, res: Response, next: Function) => {
        req.uploadFolder = 'uploads/profile-pictures';
        next();
    };

    static updatePicture = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const data = validateSchema(fileSchema, req.file, res);
        if (!data) return;
        const file = req.file as Express.Multer.File;
        // if (!data) {
        //     return sendResponse({
        //         res,
        //         statusCode: StatusCodes.BAD_REQUEST,
        //         success: false,
        //         message: 'No profile picture file uploaded',
        //     });
        // }

        // const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        // if (!allowedMimeTypes.includes(file.mimetype)) {
        //     return sendResponse({
        //         res,
        //         statusCode: StatusCodes.BAD_REQUEST,
        //         success: false,
        //         message: 'Invalid file type. Only JPEG, PNG, and GIF images are allowed',
        //     });
        // }

        const profilePicturePath = file.path || `uploads/${file.filename}`;

        const updatedUser = await UserModel.update(userId, {
            profilePicture: profilePicturePath,
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
            message: 'Profile picture updated successfully',
            data: {
                user: userWithoutPassword,
                profilePicture: profilePicturePath
            },
        });
    })
}
