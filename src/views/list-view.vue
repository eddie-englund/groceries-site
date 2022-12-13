<script lang="ts" setup>
import { listStore } from '@/stores/list-store';
import { storeToRefs } from 'pinia';
import { DateTime } from 'luxon';
import detailItemComponent from '@/components/detail-item-component.vue';
import editListButtonComponent from '@/components/edit-list-button-component.vue';
import ListItemComponent from '@/components/list-item-component.vue';

const listState = listStore();
const listStateRef = storeToRefs(listState);
const selectedList = listStateRef.selectedList;

function handleEditClick() {
  // Do stuff
}
</script>

<template>
  <section class="list-view-container">
    <div class="details-container">
      <h2>{{ selectedList.name }}</h2>
      <div class="details-item-container">
        <detail-item-component v-if="selectedList.store" :text="selectedList.store" />
        <detail-item-component :text="DateTime.fromISO(selectedList.createdAt).toLocaleString()" />
        <edit-list-button-component @click.prevent="handleEditClick" />
      </div>
    </div>
    <div class="list-items-container">
      <list-item-component
        v-for="list in listState.selectedList.items"
        :key="list.id"
        :name="list.name"
        :meta="list.store"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.list-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100vw;
  h2 {
    text-transform: capitalize;
  }

  .details-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10%;
  }

  .details-item-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    margin-top: 5%;
    min-width: 100%;
  }

  .list-items-container {
    min-width: 65%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 25%;
  }
}
</style>
