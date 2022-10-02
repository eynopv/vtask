import express, { Express, Request, Response } from 'express';
import companyRouter from './routes/company';
import stationTypeRouter from './routes/station_type';

const app: Express = express();

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  return res.send({});
});

app.use('/company', companyRouter);

app.use('/station_type', stationTypeRouter);

app.listen(3000, () => {
  console.log('Starting api on port 3000');
});
