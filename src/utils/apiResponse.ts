// utils/sendResponse.ts
import { Response } from 'express';
interface SendResponseParams {
    res: Response;
    statusCode: number;
    success: boolean;
    message: string;
    data?: any;
    errors?: any;
}

export const sendResponse = ({
    res,
    statusCode,
    success,
    message,
    data = null,
    errors = null,
}: SendResponseParams) => {
    return res.status(statusCode).json({
        success,
        message,
        ...(data && { data }),
        ...(errors && { errors }),
    });
};
