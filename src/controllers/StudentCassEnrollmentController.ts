
import { Request, Response } from 'express';

class StudentCassEnrollmentController {
  public async index(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentCassEnrollmentController index' });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentCassEnrollmentController show' });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentCassEnrollmentController create' });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentCassEnrollmentController  update' });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentCassEnrollmentController delete' });
  }
}

export default new StudentCassEnrollmentController();
  