<script lang="ts" setup>
import { listStore, type ListT } from '@/stores/list-store';
import listItemComponent from '@/components/list-item-component.vue';
import { onMounted } from 'vue';
import { getAllUsers } from '@/api/user';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { useRouter } from 'vue-router';

const router = useRouter();
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

  console.log(listState.allLists);
});

const handleListClick = (id: string) => {
  listState.setSelectedList(id);
  router.push(`/list`);
};
</script>

<template>
  <main class="home-view-container">
    <h2>Recent grocery lists</h2>
    <div class="list-items-container">
      <list-item-component
        v-for="list in listState.allLists"
        :key="list.id"
        :name="list.name"
        :date="list.createdAt"
        @click.prevent="handleListClick(list.id)"
      />
    </div>
  </main>
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
    width: 65%;
    margin-top: 25%;
  }
}
</style>
