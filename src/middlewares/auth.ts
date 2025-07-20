import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import { sendResponse } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
      userRole?: string;
    }
  }
}



export const authenticateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return sendResponse({
      res,
      statusCode: 401,
      success: false,
      message: 'Access token is required',
    });
  }

  const decoded = UserModel.verifyToken(token);

  if (!decoded) {
    return sendResponse({
      res,
      statusCode: 403,
      success: false,
      message: 'Invalid or expired token',
    });
  }

  const user = await UserModel.findById(decoded.userId);

  if (!user) {
    return sendResponse({
      res,
      statusCode: 403,
      success: false,
      message: 'User not found',
    });
  }

  if (!user.isActive) {
    return sendResponse({
      res,
      statusCode: 403,
      success: false,
      message: 'Account is deactivated',
    });
  }

  req.userId = decoded.userId;
  req.user = user;

  next();
});


export const optionalAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    const decoded = UserModel.verifyToken(token);
    if (decoded) {
      const user = await UserModel.findById(decoded.userId);
      if (user?.isActive) {
        req.userId = decoded.userId;
        req.user = user;
      }
    }
  }

  next();
});


export const requireVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isVerified) {
    return sendResponse({
      res,
      statusCode: 403,
      success: false,
      message: 'Email verification required',
    });
  }

  next();
};
