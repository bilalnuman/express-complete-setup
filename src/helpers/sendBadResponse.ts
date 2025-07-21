import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/apiResponse";
import { Response } from "express";

/**
    * Utility to send consistent error responses
    */
export function sendBadResponse(
    res: Response,
    errors: any = {},
    message: string = "Validation failed",
    statusCode: number = StatusCodes.BAD_REQUEST
) {
    return sendResponse({
        res,
        statusCode,
        success: false,
        message,
        errors,
    });
}