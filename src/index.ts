import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.get('/ping', (req: Request, res: Response) => {
  return res.send({});
});

app.listen(3000, () => {
  console.log('Starting api on port 3000');
});
