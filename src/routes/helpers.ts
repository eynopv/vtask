import { Request, Response } from 'express';

export function hasBody(req: Request, res: Response, next: Function) {
  const body = req.body;

  if (!body || !Object.values(body).length) {
    return res.status(400).send('Body is empty');
  }

  next();
}
