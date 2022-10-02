import express, { Router, Request, Response } from 'express';
import { hasBody } from './helpers';
import { create, retrieve, update, destroy, list } from '../db/station_type';

const router: Router = express.Router(); 

// Create
router.post('/', hasBody, async (req: Request, res: Response) => {
  try {
    const stationTypeId = await create(req.body);
    return res.status(201).send(Object.assign({}, req.body, { id: stationTypeId }));
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Retrieve
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const stationType = await retrieve(Number(req.params.id));
    if (!stationType) {
      return res.status(404).send({ error: 'Not found' });
    }
    return res.status(200).send(stationType);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Update
router.put('/:id', hasBody, async (req: Request, res: Response) => {
  try {
    const stationType = await retrieve(Number(req.params.id));
    if (!stationType) {
      return res.status(404).send({ error: 'Not found' });
    }
    await update(Number(req.params.id), req.body);

    const updatedStationType = Object.assign({}, stationType, req.body);
    return res.status(200).send(updatedStationType);
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
    const allStationTypes = await list();
    return res.send(allStationTypes);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

export default router;
