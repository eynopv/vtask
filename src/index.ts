import express, { Express, Request, Response } from 'express';
import companyRouter from './routes/company';
import stationTypeRouter from './routes/station_type';
import stationRouter from './routes/station';
import { Workflow } from './workflow';


const app: Express = express();

app.use(express.text());
app.post('/workflow', async (req: Request, res: Response) => {
  const script = req.body;
  const workflow = new Workflow(script);
  await workflow.setup();
  return res.send(workflow.prepareReport());
});

app.use(express.json());

app.get('/ping', (req: Request, res: Response) => {
  return res.send({});
});

app.use('/company', companyRouter);

app.use('/station_type', stationTypeRouter);

app.use('/station', stationRouter);

app.listen(3000, () => {
  console.log('Starting api on port 3000');
});
