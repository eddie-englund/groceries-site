<script lang="ts" setup>
defineProps({
  msg: { type: String, required: true },
  disabled: Boolean,
});
</script>

<template>
  <div class="button-container" :class="[disabled]">
    <button @click.prevent="$emit('clicked')" :disabled="disabled">
      <p>{{ msg }}</p>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/scss/colors.scss' as c;

.button-container {
  min-width: 12rem;
  max-width: 100%;
}

.button-container button {
  min-width: 100%;
  text-align: center;
  border-radius: 4px;
  border: none;
  background-color: c.$purple;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
}

.button-container.disabled {
  opacity: 0.7;
}
</style>
