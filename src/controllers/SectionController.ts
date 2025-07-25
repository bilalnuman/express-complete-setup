
import { Request, Response } from 'express';

class SectionController {
  public async index(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'SectionController index' });
  }

  public async show(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'SectionController show' });
  }

  public async create(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'SectionController create' });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'SectionController  update' });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    return res.json({ message: 'SectionController delete' });
  }
}

export default new SectionController();
  