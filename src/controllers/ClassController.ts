
import { Request, Response } from 'express';
import { ClassModel } from '../models/Class';
import { sendResponse } from '../utils/apiResponse';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { StatusCodes } from 'http-status-codes';

class ClassController {
  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const students = await ClassModel.getAll();
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Classes retrieved successfully',
        data: students,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'ClassController show' });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'ClassController create' });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'ClassController  update' });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'ClassController delete' });
  }
}

export default new ClassController();
