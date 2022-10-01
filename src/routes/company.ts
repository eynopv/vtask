import express, { Router, Request, Response } from 'express';
import { hasBody } from './helpers';
import { create, retrieve, update, destroy, list } from '../db/company';

const router: Router = express.Router(); 

// Create
router.post('/', hasBody, async (req: Request, res: Response) => {
  try {
    const companyId = await create(req.body);
    return res.status(201).send(Object.assign({}, req.body, { id: companyId }));
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Retrieve
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const company = await retrieve(Number(req.params.id));
    if (!company) {
      return res.status(404).send({ error: 'Not found' });
    }
    return res.status(200).send(company);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

// Update
router.put('/:id', hasBody, async (req: Request, res: Response) => {
  try {
    const company = await retrieve(Number(req.params.id));
    if (!company) {
      return res.status(404).send({ error: 'Not found' });
    }
    await update(Number(req.params.id), req.body);

    const updatedCompany = Object.assign({}, company, req.body);
    return res.status(200).send(updatedCompany);
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
    const allCompanies = await list();
    return res.send(allCompanies);
  } catch (err) {
    return res.status(500).send({ error: String(err) });
  }
});

export default router;
