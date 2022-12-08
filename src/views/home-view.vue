<script lang="ts" setup>
import { listStore, type ListT } from '@/stores/list-store';
import listItemComponent from '@/components/list-item-component.vue';
import { onMounted } from 'vue';
import { getAllUsers } from '@/api/user';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

const listState = listStore();

onMounted(async () => {
  await pipe(
    getAllUsers(),
    TE.map((res) =>
      res.data.reduce<ListT>((a, v) => {
        a.push(...v.lists);
        return a;
      }, []),
    ),
    TE.map((res) => (listState.allLists = res)),
    TE.mapLeft((left) => console.error(left)),
  )();
});
</script>

<template>
  <div class="home-view-container">
    <h3>Recent grocery lists</h3>
    <div class="list-items-container">
      <list-item-component
        v-for="list in listState.allLists"
        :key="list.id"
        :name="list.name"
        :date="list.createdAt"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 15%;
  .list-items-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 85%;
    margin-top: 25%;
  }
}
</style>
