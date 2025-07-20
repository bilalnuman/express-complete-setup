import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/apiResponse';

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return sendResponse({
                res,
                statusCode: 403,
                success: false,
                message: 'You are not authorized to access this resource',
            });
        }

        next();
    };
};
