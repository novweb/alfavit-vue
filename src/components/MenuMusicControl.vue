<script setup type="ts">
import { useAudio } from '/~/composables/use-audio'
const { toggleBackgroundSound, isPlayingBackgroundAudio } = useAudio()
</script>

<template>
  <button
    :class="{
      'grayscale': !isPlayingBackgroundAudio
    }"
    @click="toggleBackgroundSound"
  >
    <img
      src="/~/assets/headphones.svg"
      alt=""
    >
  </button>
</template>
