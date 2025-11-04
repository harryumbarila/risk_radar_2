import { z } from 'zod';

export const stringNumberZod = z
  .string()
  .refine((val) => !isNaN(Number(val)), 'Value must be a number');
