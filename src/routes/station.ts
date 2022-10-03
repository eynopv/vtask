import express, { Router, Request, Response } from 'express';
import { hasBody } from './helpers';
import { create, retrieve, update, destroy, list, retrievePopulatedCompanyRelated } from '../db/station';

const router: Router = express.Router(); 

// Create
router.post('/', hasBody, async (req: Request, res: Response) => {
  try {
    const stationId = await create(req.body);
    return res.status(201).send(Object.assign({}, req.body, { id: stationId }));
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Retrieve
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const station = await retrieve(Number(req.params.id));
    if (!station) {
      return res.status(404).send({ error: 'Not found' });
    }
    return res.status(200).send(station);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Retrieve company related stations including child companies
router.get('/company/:companyId', async (req: Request, res: Response) => {
  try {
    const station = await retrievePopulatedCompanyRelated(Number(req.params.companyId));
    if (!station) {
      return res.status(404).send({ error: 'Not found' });
    }
    return res.status(200).send(station);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Update
router.put('/:id', hasBody, async (req: Request, res: Response) => {
  try {
    const station = await retrieve(Number(req.params.id));
    if (!station) {
      return res.status(404).send({ error: 'Not found' });
    }
    await update(Number(req.params.id), req.body);

    const updatedStation = Object.assign({}, station, req.body);
    return res.status(200).send(updatedStation);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await destroy(Number(req.params.id));
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// List
router.get('/', async (req: Request, res: Response) => {
  try {
    const allStations = await list();
    return res.send(allStations);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

export default router;
