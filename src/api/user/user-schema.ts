import { z } from 'zod';
import { ListItem, Stores } from '../gloabal-types';

export const UserSchema = z.object({
  username: z.string(),
  lists: z.array(
    z.object({
      name: z.string(),
      store: z.optional(Stores),
      items: z.array(ListItem),
    }),
  ),
});
