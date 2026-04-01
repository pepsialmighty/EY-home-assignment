import { z } from 'zod';

const dateOfBirthField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)')
  .refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Invalid date')
  .refine((val) => {
    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, 'Date of birth cannot be in the future');

export const createPersonSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(1, 'Name is required'),
  dateOfBirth: z.string({ required_error: 'Date of birth is required' }).pipe(dateOfBirthField),
  placeOfBirth: z.string().trim().optional(),
});

export const updatePersonSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).trim().min(1, 'Name is required'),
  dateOfBirth: z.string({ required_error: 'Date of birth is required' }).pipe(dateOfBirthField),
  placeOfBirth: z.string().trim().optional(),
});
