<script lang="ts" setup>
defineProps({
  text: { type: String },
});
</script>

<template>
  <div class="detail-item-container">
    <p>{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/colors.scss' as c;
.detail-item-container {
  display: inline-flex;
  border-radius: 4px;
  background: c.$item;
  min-width: 4rem;
  max-width: 8rem;
  p {
    margin: 0.5rem;
    color: c.$text-muted;
  }
}
</style>
