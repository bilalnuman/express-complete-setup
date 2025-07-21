import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      uploadFolder?: string;
      user?: {
        id: number;
        email: string;
        role: string;
      };
    }
  }
}