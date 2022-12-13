import { pipe } from 'fp-ts/function';
import { List } from '@/api/gloabal-types';
import { defineStore } from 'pinia';
import { z } from 'zod';
import * as O from 'fp-ts/Option';

export const Lists = z.array(List);

export type ListT = z.infer<typeof Lists>;

export const listStore = defineStore({
  id: 'lists',
  state: () => ({
    allLists: [] as ListT,
    personaLists: [] as ListT,
    selectedList: {} as z.infer<typeof List>,
  }),
  actions: {
    setSelectedList(listId: string) {
      pipe(
        this.allLists.find((list) => list.id === listId),
        O.fromNullable,
        O.map((list) => (this.selectedList = list)),
      );
    },
  },
});
