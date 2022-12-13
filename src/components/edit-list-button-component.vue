<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <button class="edit-list-button-container">
    <p>Edit</p>
    <pencil-icon class="icon" />
  </button>
</template>

<style lang="scss" scoped>
@use '@/scss/colors.scss' as c;
@use '@/scss/text.scss' as t;
.edit-list-button-container {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  min-width: 6rem;
  background-color: c.$purple;
  border: none;
  border-radius: 4px;

  p {
    font-weight: t.$regular;
    font-size: em;
    margin: 0.5rem;
  }
  .icon {
    width: 1.2rem;
    color: c.$text;
  }
}
</style>
