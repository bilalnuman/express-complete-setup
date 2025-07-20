import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { profileUpdateSchema, registerSchema, resetPasswordSchema } from '../utils/authSchema';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';

export class AuthController {

  static register = asyncHandler(async (req: Request, res: Response) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { email, username, password } = parsed.data;

    const existingUser =
      (await UserModel.findByEmailOrUsername(email)) ||
      (await UserModel.findByEmailOrUsername(username));

    if (existingUser) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'User already exists',
      });
    }

    const user = await UserModel.create({ email, username, password });
    const { password: _, ...userWithoutPassword } = user;

    return sendResponse({
      res,
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'User registered successfully',
      data: { user: userWithoutPassword },
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Email/username and password are required',
      });
    }

    const authResult = await UserModel.authenticate(emailOrUsername, password);

    if (!authResult) {
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'Invalid credentials',
      });
    }


    res.cookie('refreshToken', authResult.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Login successful',
      data: {
        user: authResult.user,
        accessToken: authResult.accessToken,
      },
    });
  });

  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendResponse({
        res,
        statusCode: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'No refresh token provided',
      });
    }

    const payload = UserModel.verifyRefreshToken(token);

    if (!payload) {
      return sendResponse({
        res,
        statusCode: StatusCodes.FORBIDDEN,
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const accessToken = UserModel.generateAccessToken(payload.userId);

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Access token refreshed successfully',
      data: { accessToken },
    });
  });

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

  static updateProfile = asyncHandler(async (req: Request, res: Response, next: Function) => {

    const parsed = profileUpdateSchema.safeParse(req.body);
    const userId = (req as any).userId;

    if (!parsed.success) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { firstName, lastName, email, username } = parsed.data;
    if (parsed.success) {
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

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const parsed = resetPasswordSchema.safeParse(req.body);


    if (!parsed.success) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }


    const user = await UserModel.findById(userId);
    if (!user) {
      return sendResponse({
        res,
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: 'User not found',
      });
    }
    const { currentPassword, newPassword } = parsed.data;
    const isCurrentPasswordValid = await UserModel.verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return sendResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Current password is incorrect',
      });
    }

    await UserModel.update(userId, { password: newPassword });

    return sendResponse({
      res,
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password changed successfully',
    });
  });

}
