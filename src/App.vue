<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
@use '@/scss/colors.scss' as c;

body,
body::before,
body::after {
  margin: 0;
  padding: 0;
}

body {
  background-color: c.$bg;
}
</style>
