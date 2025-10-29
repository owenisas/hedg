import { z } from 'zod';

export const exposureFormSchema = z.object({
  statement: z.string().min(10, 'Risk statement must be at least 10 characters'),
  horizon: z.string().min(1, 'Time horizon is required'),
  budget: z.number().min(1000, 'Budget must be at least $1,000'),
  venuesAllowed: z.array(z.string()).min(1, 'At least one venue must be selected'),
  jurisdiction: z.string().min(2, 'Jurisdiction is required'),
});

export type ExposureFormValues = z.infer<typeof exposureFormSchema>;