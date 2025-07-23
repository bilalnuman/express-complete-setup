import { Request, Response } from 'express';
import z from 'zod';
import { validateSchema } from '../helpers/validateSchema';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { PermissionModel } from '../models/Permission';
const permissionSchema = z.object({
  name: z.enum(['create', 'read', 'update', 'delete'],"Valid permission type 'create', 'read', 'update', 'delete'"),
  description: z.string().optional()
});

class PermissionController {
  public async index(req: Request, res: Response) {
    try {
      const permissions = await PermissionModel.getAll();
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Permissions retrieved successfully',
        data: permissions,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const permission = await PermissionModel.getOne(Number(id));
      if (!permission) {
        return sendBadResponse(res, {}, `Permission of id ${id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Permission retrieved successfully',
        data: permission,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async create(req: Request, res: Response): Promise<Response | undefined> {
    const data = validateSchema(permissionSchema, req.body, res);
    if (!data) return;

    try {

      const permissionCreated = await PermissionModel.create({
        ...data
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
        return sendBadResponse(res, {}, `Permission "${req.body.name}" already exists`);
      }
      console.error('Unhandled permission Create Error:', error);
      return sendBadResponse(res, {}, error?.cause);
    }

  }

  public async update(req: Request, res: Response): Promise<any> {
    try {
      const permissionUpdateSchema = permissionSchema.omit({ name: true });

      const data = validateSchema(permissionUpdateSchema, req.body, res);

      if (!data) return;
      const updated = await PermissionModel.update(Number(req.params.id), data);
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

export default new PermissionController();

