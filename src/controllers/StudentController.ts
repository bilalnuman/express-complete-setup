import { Request, Response } from 'express';
import z from 'zod';
import { validateSchema } from '../helpers/validateSchema';
import { sendBadResponse } from '../helpers/sendBadResponse';
import { sendResponse } from '../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { StudentModel } from '../models/Student';
const studentSchema = z.object({
  id: z.number("User id is required"),
  registrationNo: z.string("registrationNo is required"),
  dateOfAdmission: z.string("dateOfAdmission is required"),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  guardianName: z.string().nullable().optional(),
  contactNo: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  bFormNumber: z.string().nullable().optional(),
  cnic: z.string().nullable().optional(),
});

const studentUpdateSchema = z.object({
  // id: z.number("User id is required"),
  // registrationNo: z.string("registrationNo is required"),
  // dateOfAdmission: z.string("dateOfAdmission is required"),
  // dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  guardianName: z.string().nullable().optional(),
  contactNo: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  // bFormNumber: z.string().nullable().optional(),
  // cnic: z.string().nullable().optional(),
});

class StudentController {
  public async index(req: Request, res: Response) {
    try {
      const students = await StudentModel.getAll();
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Students retrieved successfully',
        data: students,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const student = await StudentModel.findById(Number(id));
      if (!student) {
        return sendBadResponse(res, {}, `Student of id ${id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student retrieved successfully',
        data: student,
      })
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }

  public async create(req: Request, res: Response): Promise<Response | undefined> {
    const data = validateSchema(studentSchema, req.body, res);
    if (!data) return;

    try {
      const studentCreated = await StudentModel.create({
        ...data,
      });

      return sendResponse({
        res,
        statusCode: StatusCodes.CREATED,
        success: true,
        message: 'Student successfully created',
        data: studentCreated,
      });
    } catch (error: any) {
      if (error.cause.code === '23505') {
        return sendBadResponse(res, {error:error.cause}, `Student already exists`);
      }
      if (error.cause.code === '23503') {
        return sendBadResponse(res, {error:error.cause}, `Student note exists`);
      }
      console.error('Unhandled Student Create Error:', error);
      return sendBadResponse(res, {}, error?.cause);
    }

  }

  public async update(req: Request, res: Response): Promise<any> {
    try {
      const data = validateSchema(studentUpdateSchema, req.body, res);
      if (!data) return;
      const updated = await StudentModel.update(Number(req.params.id), data);
      if (!updated) {
        return sendBadResponse(res, {}, `Student of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student successfully updated',
        data: updated,
      });

    } catch (error) {
      return sendBadResponse(res, error);
    }

  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await StudentModel.delete(Number(req.params.id));
      if (!deleted) {
        return sendBadResponse(res, {}, `Student of id ${req.params.id} not found`, StatusCodes.NOT_FOUND);
      }
      return sendResponse({
        res,
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Student successfully deleted',
      });
    } catch (error) {
      return sendBadResponse(res, error);
    }
  }
}

export default new StudentController();

