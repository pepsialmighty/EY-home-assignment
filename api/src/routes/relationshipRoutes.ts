import { Router, Request, Response, NextFunction } from 'express';
import * as relationshipService from '../services/relationshipService';
import { createRelationshipSchema } from '../validation/relationshipSchema';

export const relationshipRouter = Router();

relationshipRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  const result = createRelationshipSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.errors[0]?.message ?? 'Invalid input';
    res.status(400).json({ error: { message } });
    return;
  }
  try {
    const relationship = relationshipService.createRelationship(result.data);
    res.status(201).json({ data: relationship });
  } catch (err) {
    next(err);
  }
});

relationshipRouter.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  try {
    relationshipService.deleteRelationship(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
