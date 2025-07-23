
import { Request, Response } from 'express';
import { RoleModel } from '../models/Role';
import z from 'zod';
import { validateSchema } from '../helpers/validateSchema';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
const roleSchema = z.object({
  role: z.enum(["admin", "teacher", "parent", "student"]),
  description: z.string().optional()
})
class RoleController {
  public async index(req: Request, res: Response) {
    try {
      const roles = await RoleModel.getAll();
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Roles retrieved successfully',
        data: roles,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const role = await RoleModel.getOne(Number(id));
      if (!role) {
        return sendBadResponse(res, {}, `Role of id ${id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Role retrieved successfully',
        data: role,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async create(req: Request, res: Response): Promise<Response | undefined> {
    const data = validateSchema(roleSchema, req.body, res);
    if (!data) return;

    try {
      const { role } = data;

      const roleCreated = await RoleModel.create({
        role,
        description: "This is a test role",
      });

      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Role successfully assigned',
        data: roleCreated,
      });
    } catch (error: any) {
      if (error.cause.code === '23505') {
        return sendBadResponse(res, {}, `Role "${req.body.role}" already exists`);
      }
      console.error('Unhandled Role Create Error:', error);
      return sendBadResponse(res, {}, error?.cause);
    }

  }

  public async update(req: Request, res: Response): Promise<any> {
    try {
      const roleUpdateSchema = roleSchema.omit({ role: true });

      const data = validateSchema(roleUpdateSchema, req.body, res);

      if (!data) return;
      const updated = await RoleModel.update(Number(req.params.id), data);
      if (!updated) {
        return sendBadResponse(res, {}, `Role of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Role successfully updated',
        data: updated,
      });

    } catch (error) {
      return sendBadResponse(res, error);
    }

  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await RoleModel.delete(Number(req.params.id));
      if (!deleted) {
        return sendBadResponse(res, {}, `Role of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Role successfully deleted',
      });
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }
}

export default new RoleController();
