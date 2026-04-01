import { z } from 'zod';

export const createRelationshipSchema = z.object({
  parentId: z.number({ required_error: 'parentId is required' }).int().positive(),
  childId: z.number({ required_error: 'childId is required' }).int().positive(),
});
