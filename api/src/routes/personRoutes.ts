import { Router, Request, Response, NextFunction } from 'express';
import { createPersonSchema, updatePersonSchema } from '../validation/personSchema';
import * as personService from '../services/personService';

export const personRouter = Router();

personRouter.get('/', (_req: Request, res: Response) => {
  const people = personService.getAllPeople();
  res.json({ data: people });
});

personRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  const parsed = createPersonSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0].message;
    res.status(400).json({ error: { message } });
    return;
  }
  try {
    const person = personService.createPerson(parsed.data);
    res.status(201).json({ data: person });
  } catch (err) {
    next(err);
  }
});

personRouter.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const parsed = updatePersonSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.errors[0].message;
    res.status(400).json({ error: { message } });
    return;
  }
  try {
    const person = personService.updatePerson(id, parsed.data);
    res.json({ data: person });
  } catch (err) {
    next(err);
  }
});

personRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  try {
    personService.deletePerson(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
