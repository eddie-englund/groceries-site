import { z } from 'zod';

export const Stores = z.enum(['willys', 'coop', 'martin & servera', 'hemköp', 'öob']);

export const ListItem = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(64),
  description: z.optional(z.string().trim().min(1).max(256)),
  price: z.optional(z.number().min(1).max(1024)),
  store: z.optional(Stores),
});

export const StatusResponses = z.enum(['Success', 'Failure']);

export const ZodDefaultResponse = z.object({
  msg: z.string().min(1).max(128),
  status: StatusResponses,
  statusCode: z.number().min(100).max(500),
});

export type ZodDefaultResponseT = z.infer<typeof ZodDefaultResponse>;
