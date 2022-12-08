import { List } from '@/api/gloabal-types';
import { defineStore } from 'pinia';
import { z } from 'zod';

export const Lists = z.array(List);

export type ListT = z.infer<typeof Lists>;

export const listStore = defineStore({
  id: 'lists',
  state: () => ({
    allLists: [] as ListT,
    personaLists: [] as ListT,
  }),
});
