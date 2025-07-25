
import { Request, Response } from 'express';
import z from 'zod';
import { validateSchema } from '../helpers/validateSchema';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { UserRoleModel } from '../models/UserRole';

const useRoleSchema = z.object({
  roleId: z.number("roleId must be a positive integer").positive("roleId must be a positive integer"),
  userId: z.number("userId must be a positive integer").positive("userId must be a positive integer")
});
class UserRoleController {

  
  public async create(req: Request, res: Response): Promise<Response | undefined> {
    const data = validateSchema(useRoleSchema, req.body, res);
    if (!data) return;

    try {

      const roleCreated = await UserRoleModel.create({
        ...data
      });

      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Role to user successfully assigned',
        data: roleCreated,
      });
    } catch (error: any) {
      if (error.cause.code === '23505') {
        return sendBadResponse(res, {}, `This role id "${data.roleId}"  already exists`);
      }
      if (error.cause.code === '23503') {
        return sendBadResponse(res, `This role id "${data.roleId}" or user id "${data.userId}" not exists`);
      }
      console.error('Unhandled Role Create Error:', error);
      return sendBadResponse(res, {}, error?.cause);
    }

  }

  public async update(req: Request, res: Response): Promise<any> {
    try {
      const data = validateSchema(useRoleSchema, req.body, res);

      if (!data) return;
      const updated = await UserRoleModel.update(Number(req.params.id), data);
      if (!updated) {
        return sendBadResponse(res, {}, `Id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User role successfully updated',
        data: updated,
      });

    } catch (error) {
      return sendBadResponse(res, error);
    }

  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await UserRoleModel.delete(Number(req.params.id));
      if (!deleted) {
        return sendBadResponse(res, {}, `Id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User role successfully deleted',
      });
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }
  
}

export default new UserRoleController();

