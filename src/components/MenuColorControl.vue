<script setup type="ts">
import { useColors } from '/~/composables/use-colors'
const { updateColor } = useColors()
</script>

<template>
  <button @click="updateColor">
    <img
      src="/~/assets/brush.svg"
      alt=""
    >
  </button>
</template>
