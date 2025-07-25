
import { Request, Response } from 'express';

class StudentDocumentsController {
  public async index(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentDocumentsController index' });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentDocumentsController show' });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentDocumentsController create' });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentDocumentsController  update' });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'StudentDocumentsController delete' });
  }
}

export default new StudentDocumentsController();
  