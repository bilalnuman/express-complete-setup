import { Request, Response } from 'express';
import z from 'zod';
import { validateSchema } from '../helpers/validateSchema';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { PermissionModel } from '../models/Permission';
import { RolePermissionModel } from '../models/RolePermission';
const permissionSchema = z.object({
  roleId: z.number("roleId must be a positive integer").positive("roleId must be a positive integer"),
  permissionId: z.number("permissionId must be a positive integer").positive("permissionId must be a positive integer")
});


class RolePermissionContoller {

  public async create(req: Request, res: Response): Promise<Response | undefined> {
    const data = validateSchema(permissionSchema, req.body, res);
    if (!data) return;

    try {

      const permissionCreated = await RolePermissionModel.create({
        permissionId: Number(data.permissionId),
        roleId: Number(data.roleId)
      });

      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Permission successfully assigned',
        data: permissionCreated,
      });
    } catch (error: any) {
      if (error.cause.code === '23505') {
        return sendBadResponse(res, {}, `Permission "${data.permissionId}" already exists`);
      }
      if (error.cause.code === '23503') {
        return sendBadResponse(res, {}, `Permission "${data.permissionId}" not exists`);
      }
      console.error('Unhandled permission Create Error:', error);
      return sendBadResponse(res, {}, error?.cause);
    }

  }

  public async update(req: Request, res: Response): Promise<any> {
    try {

      const data = validateSchema(permissionSchema, req.body, res);

      if (!data) return;
      const updated = await RolePermissionModel.update(Number(req.params.id), {
        permissionId: Number(data.permissionId),
        roleId: Number(data.roleId)
      });
      if (!updated) {
        return sendBadResponse(res, {}, `Permission of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Permission successfully updated',
        data: updated,
      });

    } catch (error) {
      return sendBadResponse(res, error);
    }

  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await PermissionModel.delete(Number(req.params.id));
      if (!deleted) {
        return sendBadResponse(res, {}, `Permission of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Permission successfully deleted',
      });
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }
}

export default new RolePermissionContoller();
