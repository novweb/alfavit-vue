<script setup lang="ts">
import MenuColorControlVue from './MenuColorControl.vue'
import MenuMusicControlVue from './MenuMusicControl.vue'
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 grid grid-cols-5 gap-4 p-2 m-2 bg-white rounded shadow-lg">
    <menu-color-control-vue class="w-10 h-10 mx-auto" />
    <div />
    <div />
    <div />
    <menu-music-control-vue class="w-10 h-10 mx-auto" />
  </div>
</template>
