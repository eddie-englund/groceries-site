<script lang="ts" setup>
import { DateTime } from 'luxon';

defineProps({
  name: String,
  date: { type: String, required: true },
});
</script>

<template>
  <div class="list-item-container">
    <p class="list-name">{{ name }}</p>
    <p class="list-date">{{ DateTime.fromISO(date).toLocaleString() }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/colors.scss' as c;
.list-item-container {
  padding: 1rem;
  background-color: c.$item;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;

  p {
    margin: 0;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 1.1em;
  }

  .list-date {
    color: c.$text-muted;
  }
}
</style>
