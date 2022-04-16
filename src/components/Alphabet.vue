<script setup lang="ts">
import { alphabet } from '/~/state/alfavit'
import AlphabetItem from './AlphabetItem.vue'
</script>

<template>
  <div class="grid grid-cols-5 gap-4 p-4 pb-28 ">
    <alphabet-item
      v-for="(letter, index) in alphabet"
      :key="index"
      :letter="letter"
      :sub-key="index"
    />
  </div>
</template>
