import { ZodDefaultResponse } from './../gloabal-types';
import { Lists } from './../../stores/list-store';
import { z } from 'zod';

export const UserSchema = z
  .object({
    data: z.array(
      z.object({
        username: z.string(),
        lists: Lists,
      }),
    ),
  })
  .merge(ZodDefaultResponse);
