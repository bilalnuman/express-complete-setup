import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { loginSchema, registerSchema } from '../validationSchemas/authSchema';
import { validateSchema } from '../helpers/validateSchema';

export class AuthController {

  static register = asyncHandler(async (req: Request, res: Response) => {
    const data = validateSchema(registerSchema, req.body, res);
    if (!data) return;
    const { email, username, password } = data;

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
    const data = validateSchema(loginSchema, req.body, res);
    if (!data) return;
    const { emailOrUsername, password } = data;

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

}
